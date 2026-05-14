# app/routers/citas.py
# ─────────────────────────────────────────────────────────────────────────────
# CORRECCIONES vs versión anterior:
#
#  [CIT-1] _resolve_or_create_vehiculo: si body.vehiculo era "" y body.marca era
#          "" también, split(" ")[0] retornaba "" → se insertaba marca vacía en BD.
#          Se aplica un fallback a "Desconocido".
#
#  [CIT-2] _resolve_or_create_vehiculo: si body.placa era "" se generaba la
#          clave "SIN-PLACA" sin importar cuántas veces se llamara → múltiples
#          citas del mismo usuario creaban múltiples vehículos con placa "SIN-PLACA".
#          Ahora se busca por (marca, modelo, id_usuario) si no hay placa.
#
#  [CIT-3] _resolve_servicio: si el servicio no existía se usaba silenciosamente
#          id_servicio=1 sin avisar. Esto podía registrar citas con servicio
#          incorrecto sin que el usuario lo supiera. Se lanza 400 en su lugar.
#
#  [CIT-4] crear_cita: si no había mecánico disponible (mec=None), se usaba
#          id_mecanico=1 hardcodeado sin verificar que exista → FK violation.
#          Ahora se permite NULL si no hay mecánico (la columna debe ser nullable).
#
#  [CIT-5] update_estado: un cliente podía cambiar el estado a CUALQUIER valor
#          incluyendo "completada" o "confirmada", que solo debería poder poner
#          el admin. Se restringe a clientes únicamente el estado "cancelada".
#
#  [CIT-6] eliminar_cita: se borraba historial antes de verificar que la cita
#          existía y pertenecía al usuario. Si la cita no existía, rowcount=0
#          devolvía 404 pero el historial ya estaba potencialmente borrado.
#          Se verifica primero.
#
#  [CIT-7] hora: mismo problema que [ADM-3], se formatea timedelta → HH:MM.
#
#  [CIT-8] Envío de correo al crear cita (integración con email_service).
# ─────────────────────────────────────────────────────────────────────────────

import datetime as dt

from fastapi import APIRouter, HTTPException, Header
from pydantic import BaseModel
from typing import Optional

from app.database import get_db
from app.security import get_current_user
from app.email_service import send_cita_confirmada

router = APIRouter(prefix="/api/citas", tags=["citas"])


# ── Schemas ───────────────────────────────────────────────────────────────────

class CitaBody(BaseModel):
    cliente:  str
    vehiculo: str = ""
    placa:    str = ""
    marca:    str = ""
    modelo:   str = ""
    anio:     Optional[str] = None
    color:    Optional[str] = None
    servicio: str
    fecha:    str
    hora:     str
    notas:    str = ""
    monto:    float = 0.0

class EstadoBody(BaseModel):
    estado: str


# ── Helpers ───────────────────────────────────────────────────────────────────

def _format_hora(value) -> str:
    """[CIT-7] Convierte timedelta de MySQL → 'HH:MM'."""
    if value is None:
        return ""
    if isinstance(value, dt.timedelta):
        total = int(value.total_seconds())
        h, rem = divmod(total, 3600)
        m, _   = divmod(rem, 60)
        return f"{h:02d}:{m:02d}"
    return str(value)


def _format_cita(row: dict) -> dict:
    if row.get("fecha"):
        row["fecha"] = str(row["fecha"])
    if "hora" in row:
        row["hora"] = _format_hora(row["hora"])
    return row


def _resolve_or_create_vehiculo(conn, uid: int, body: CitaBody) -> int:
    cur = conn.cursor()

    # [CIT-1] Fallbacks seguros para marca y modelo
    marca  = (body.marca  or body.vehiculo.split(" ")[0] if body.vehiculo else "").strip() or "Desconocido"
    modelo = (body.modelo or (" ".join(body.vehiculo.split(" ")[1:]) if body.vehiculo else "")).strip() or "N/A"
    placa  = body.placa.upper().strip() if body.placa else ""

    if placa:
        # Buscar por placa del usuario
        cur.execute(
            "SELECT id_vehiculo FROM vehiculo WHERE numero_de_placa = %s AND id_usuario = %s LIMIT 1",
            (placa, uid)
        )
        row = cur.fetchone()
        if row:
            return row["id_vehiculo"]
    else:
        # [CIT-2] Sin placa: buscar por marca+modelo+usuario para evitar duplicados
        cur.execute(
            """SELECT id_vehiculo FROM vehiculo
               WHERE marca = %s AND modelo = %s AND id_usuario = %s
               AND (numero_de_placa IS NULL OR numero_de_placa = 'SIN-PLACA')
               LIMIT 1""",
            (marca, modelo, uid)
        )
        row = cur.fetchone()
        if row:
            return row["id_vehiculo"]

    # Crear vehículo nuevo
    cur.execute(
        """INSERT INTO vehiculo (marca, modelo, año, color, numero_de_placa, id_usuario)
           VALUES (%s, %s, %s, %s, %s, %s)""",
        (
            marca,
            modelo,
            body.anio  or "2024",
            body.color or "N/A",
            placa      or "SIN-PLACA",
            uid,
        )
    )
    return cur.lastrowid


def _resolve_servicio(conn, nombre: str) -> int:
    cur = conn.cursor()
    cur.execute("SELECT id_servicio FROM servicio WHERE nombre = %s LIMIT 1", (nombre,))
    row = cur.fetchone()
    if not row:
        # [CIT-3] Error explícito — no silenciar con id=1
        raise HTTPException(status_code=400, detail=f"Servicio '{nombre}' no encontrado")
    return row["id_servicio"]


# ── GET /api/citas ────────────────────────────────────────────────────────────

@router.get("")
def get_mis_citas(authorization: str = Header(None)):
    payload = get_current_user(authorization)
    uid = payload["sub"]
    with get_db() as conn:
        cur = conn.cursor()
        cur.execute("""
            SELECT
                c.id_cita                      AS id,
                u.nombre                        AS cliente,
                u.email,
                CONCAT(v.marca, ' ', v.modelo) AS vehiculo,
                v.numero_de_placa               AS placa,
                s.nombre                        AS servicio,
                c.fecha,
                c.hora,
                c.notas,
                c.monto,
                c.estado
            FROM cita c
            LEFT JOIN usuario  u ON c.id_usuario  = u.id_usuario
            LEFT JOIN vehiculo v ON c.id_vehiculo = v.id_vehiculo
            LEFT JOIN servicio s ON c.id_servicio = s.id_servicio
            WHERE c.id_usuario = %s
            ORDER BY c.fecha DESC, c.hora DESC
        """, (uid,))
        rows = cur.fetchall()
    return [_format_cita(r) for r in rows]


# ── POST /api/citas ───────────────────────────────────────────────────────────

@router.post("")
def crear_cita(body: CitaBody, authorization: str = Header(None)):
    payload = get_current_user(authorization)
    uid = payload["sub"]

    with get_db() as conn:
        vid = _resolve_or_create_vehiculo(conn, uid, body)
        sid = _resolve_servicio(conn, body.servicio)   # [CIT-3] lanza 400 si no existe

        # [CIT-4] Mecánico disponible — NULL si no hay ninguno (columna nullable)
        cur = conn.cursor()
        cur.execute(
            "SELECT id_mecanico FROM mecanico WHERE disponible = 1 ORDER BY RAND() LIMIT 1"
        )
        mec = cur.fetchone()
        mid = mec["id_mecanico"] if mec else None   # NULL es preferible a FK inválida

        cur.execute(
            """INSERT INTO cita
               (fecha, hora, notas, monto, estado, id_usuario, id_vehiculo, id_servicio, id_mecanico)
               VALUES (%s, %s, %s, %s, 'pendiente', %s, %s, %s, %s)""",
            (body.fecha, body.hora, body.notas, body.monto, uid, vid, sid, mid)
        )
        new_id = cur.lastrowid

        # Leer la cita recién creada con JOINs
        cur.execute("""
            SELECT
                c.id_cita                      AS id,
                u.nombre                        AS cliente,
                u.email,
                CONCAT(v.marca, ' ', v.modelo) AS vehiculo,
                v.numero_de_placa               AS placa,
                s.nombre                        AS servicio,
                c.fecha, c.hora, c.notas, c.monto, c.estado
            FROM cita c
            LEFT JOIN usuario  u ON c.id_usuario  = u.id_usuario
            LEFT JOIN vehiculo v ON c.id_vehiculo = v.id_vehiculo
            LEFT JOIN servicio s ON c.id_servicio = s.id_servicio
            WHERE c.id_cita = %s
        """, (new_id,))
        cita = cur.fetchone()

    cita = _format_cita(cita)

    # [CIT-8] Notificación por correo (no bloqueante)
    send_cita_confirmada(
        cita["email"],
        cita["cliente"],
        cita["servicio"],
        cita["fecha"],
        cita["hora"],
    )

    return {"ok": True, "cita": cita}


# ── PUT /api/citas/{id}/estado ────────────────────────────────────────────────

@router.put("/{cita_id}/estado")
def update_estado(cita_id: int, body: EstadoBody, authorization: str = Header(None)):
    payload = get_current_user(authorization)
    uid  = payload["sub"]
    role = payload.get("role")

    estados_validos = {"pendiente", "confirmada", "completada", "cancelada"}
    if body.estado not in estados_validos:
        raise HTTPException(status_code=400, detail="Estado inválido")

    # [CIT-5] Clientes solo pueden cancelar sus propias citas
    if role != "admin" and body.estado != "cancelada":
        raise HTTPException(
            status_code=403,
            detail="Los clientes solo pueden cancelar citas"
        )

    with get_db() as conn:
        cur = conn.cursor()
        if role == "admin":
            cur.execute(
                "UPDATE cita SET estado = %s WHERE id_cita = %s",
                (body.estado, cita_id)
            )
        else:
            cur.execute(
                "UPDATE cita SET estado = %s WHERE id_cita = %s AND id_usuario = %s",
                (body.estado, cita_id, uid)
            )
        if cur.rowcount == 0:
            raise HTTPException(status_code=404, detail="Cita no encontrada o sin permiso")

    return {"ok": True}


# ── DELETE /api/citas/{id} ────────────────────────────────────────────────────

@router.delete("/{cita_id}")
def eliminar_cita(cita_id: int, authorization: str = Header(None)):
    payload = get_current_user(authorization)
    uid  = payload["sub"]
    role = payload.get("role")

    with get_db() as conn:
        cur = conn.cursor()

        # [CIT-6] Verificar existencia y pertenencia ANTES de borrar historial
        if role == "admin":
            cur.execute("SELECT id_cita FROM cita WHERE id_cita = %s", (cita_id,))
        else:
            cur.execute(
                "SELECT id_cita FROM cita WHERE id_cita = %s AND id_usuario = %s",
                (cita_id, uid)
            )
        if not cur.fetchone():
            raise HTTPException(status_code=404, detail="Cita no encontrada o sin permiso")

        cur.execute("DELETE FROM historial_cita WHERE id_cita = %s", (cita_id,))
        cur.execute("DELETE FROM cita WHERE id_cita = %s", (cita_id,))

    return {"ok": True}
