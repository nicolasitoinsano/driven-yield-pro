# app/routers/admin.py
# ─────────────────────────────────────────────────────────────────────────────
# CORRECCIONES vs versión anterior:
#
#  [ADM-1] admin/login: la conexión se cerraba antes de verify_password porque
#          el `with get_db()` terminaba mientras `row` ya estaba en memoria.
#          Aunque funcionaba, el patrón es frágil (e.g. si verify_password
#          necesitara la conexión). Se restructura igual que auth/login.
#
#  [ADM-2] delete_cita_admin: se borraba el historial y luego se verificaba
#          `rowcount` del DELETE de cita. Si la cita no existía, el DELETE de
#          historial ya había corrido sin errores → rowcount=0 lanzaba 404 pero
#          el historial ya estaba borrado. Se verifica existencia PRIMERO.
#
#  [ADM-3] get_all_citas: hora era un objeto datetime.timedelta en MySQL → al
#          serializarse a JSON daba un error o un número de segundos. Se convierte
#          a string formateado HH:MM explícitamente.
#
#  [ADM-4] require_admin se llama correctamente pasando el header como string
#          (ver [SEC-2] en security.py).
#
#  [ADM-5] No existía endpoint GET /api/admin/stats para el panel de control.
#          Se agrega con conteos útiles.
# ─────────────────────────────────────────────────────────────────────────────

from fastapi import APIRouter, HTTPException, Header
from pydantic import BaseModel

from app.database import get_db
from app.security import verify_password, create_token, require_admin, hash_password

router = APIRouter(prefix="/api/admin", tags=["admin"])


# ── Schemas ───────────────────────────────────────────────────────────────────

class AdminLoginBody(BaseModel):
    email:      str
    contrasena: str

class EstadoBody(BaseModel):
    estado: str


# ── Helpers ───────────────────────────────────────────────────────────────────

def _format_hora(value) -> str:
    """
    [ADM-3] MySQL devuelve TIME como datetime.timedelta.
    Convertimos a 'HH:MM' para JSON.
    """
    if value is None:
        return ""
    import datetime
    if isinstance(value, datetime.timedelta):
        total = int(value.total_seconds())
        h, rem = divmod(total, 3600)
        m, _   = divmod(rem, 60)
        return f"{h:02d}:{m:02d}"
    return str(value)


def _format_cita_row(row: dict) -> dict:
    if row.get("fecha"):
        row["fecha"] = str(row["fecha"])
    if "hora" in row:
        row["hora"] = _format_hora(row["hora"])
    return row


# ── POST /api/admin/login ─────────────────────────────────────────────────────

@router.post("/login")
def admin_login(body: AdminLoginBody):
    # [ADM-1] Todo dentro del mismo bloque
    with get_db() as conn:
        cur = conn.cursor()
        cur.execute(
            "SELECT * FROM administrador WHERE email = %s LIMIT 1",
            (body.email.lower().strip(),)
        )
        row = cur.fetchone()

    if not row or not verify_password(body.contrasena, row["contrasena"]):
        raise HTTPException(status_code=401, detail="Credenciales de administrador incorrectas")

    nombre_completo = f"{row['nombre']} {row.get('apellido', '')}".strip()
    token = create_token({
        "sub":    row["id_admin"],
        "role":   "admin",
        "nombre": nombre_completo,
    })
    return {
        "token": token,
        "user": {
            "id":     row["id_admin"],
            "nombre": nombre_completo,
            "email":  row["email"],
            "role":   "admin",
        }
    }


# ── GET /api/admin/setup (TEMPORARY) ─────────────────────────────────────────

@router.get("/setup")
def setup_admin():
    with get_db() as conn:
        cur = conn.cursor()
        cur.execute("SELECT id_admin, email FROM administrador LIMIT 1")
        row = cur.fetchone()
        if row:
            hashed = hash_password("admin123")
            cur.execute("UPDATE administrador SET contrasena = %s WHERE id_admin = %s", (hashed, row["id_admin"]))
            return {"msg": "Contraseña reseteada", "email": row["email"], "password": "admin123"}
        else:
            email = "admin@taller.com"
            hashed = hash_password("admin123")
            cur.execute("INSERT INTO administrador (nombre, apellido, email, contrasena) VALUES ('Admin', 'Master', %s, %s)", (email, hashed))
            return {"msg": "Administrador creado", "email": email, "password": "admin123"}


# ── GET /api/admin/citas ──────────────────────────────────────────────────────

@router.get("/citas")
def get_all_citas(authorization: str = Header(None)):
    require_admin(authorization)
    with get_db() as conn:
        cur = conn.cursor()
        cur.execute("""
            SELECT
                c.id_cita              AS id,
                u.nombre               AS cliente,
                u.email,
                CONCAT(v.marca, ' ', v.modelo) AS vehiculo,
                v.numero_de_placa      AS placa,
                s.nombre               AS servicio,
                c.fecha,
                c.hora,
                c.notas,
                c.monto,
                c.estado,
                m.nombre               AS mecanico
            FROM cita c
            LEFT JOIN usuario  u ON c.id_usuario  = u.id_usuario
            LEFT JOIN vehiculo v ON c.id_vehiculo = v.id_vehiculo
            LEFT JOIN servicio s ON c.id_servicio = s.id_servicio
            LEFT JOIN mecanico m ON c.id_mecanico = m.id_mecanico
            ORDER BY c.fecha DESC, c.hora DESC
        """)
        rows = cur.fetchall()
    return [_format_cita_row(r) for r in rows]   # [ADM-3] hora formateada


# ── GET /api/admin/usuarios ───────────────────────────────────────────────────

@router.get("/usuarios")
def get_usuarios(authorization: str = Header(None)):
    require_admin(authorization)
    with get_db() as conn:
        cur = conn.cursor()
        cur.execute(
            "SELECT id_usuario AS id, nombre, username, email, telefono FROM usuario ORDER BY nombre"
        )
        rows = cur.fetchall()
    for r in rows:
        r["role"] = "cliente"
    return rows


# ── GET /api/admin/stats ──────────────────────────────────────────────────────
# [ADM-5] Nuevo — estadísticas para el dashboard

@router.get("/stats")
def get_stats(authorization: str = Header(None)):
    require_admin(authorization)
    with get_db() as conn:
        cur = conn.cursor()

        cur.execute("SELECT COUNT(*) AS total FROM usuario")
        total_usuarios = cur.fetchone()["total"]

        cur.execute("SELECT COUNT(*) AS total FROM cita")
        total_citas = cur.fetchone()["total"]

        cur.execute("SELECT COUNT(*) AS total FROM cita WHERE estado = 'pendiente'")
        citas_pendientes = cur.fetchone()["total"]

        cur.execute("SELECT COUNT(*) AS total FROM cita WHERE estado = 'completada'")
        citas_completadas = cur.fetchone()["total"]

        cur.execute("SELECT COALESCE(SUM(monto), 0) AS total FROM cita WHERE estado = 'completada'")
        ingresos = float(cur.fetchone()["total"])

    return {
        "usuarios":         total_usuarios,
        "citas_total":      total_citas,
        "citas_pendientes": citas_pendientes,
        "citas_completadas":citas_completadas,
        "ingresos":         ingresos,
    }


# ── PUT /api/admin/citas/{id}/estado ─────────────────────────────────────────

@router.put("/citas/{cita_id}/estado")
def update_estado_admin(cita_id: int, body: EstadoBody, authorization: str = Header(None)):
    require_admin(authorization)
    estados_validos = {"pendiente", "confirmada", "completada", "cancelada"}
    if body.estado not in estados_validos:
        raise HTTPException(status_code=400, detail="Estado inválido")

    with get_db() as conn:
        cur = conn.cursor()
        cur.execute(
            "UPDATE cita SET estado = %s WHERE id_cita = %s",
            (body.estado, cita_id)
        )
        if cur.rowcount == 0:
            raise HTTPException(status_code=404, detail="Cita no encontrada")
    return {"ok": True, "estado": body.estado}


# ── DELETE /api/admin/citas/{id} ──────────────────────────────────────────────

@router.delete("/citas/{cita_id}")
def delete_cita_admin(cita_id: int, authorization: str = Header(None)):
    require_admin(authorization)
    with get_db() as conn:
        cur = conn.cursor()

        # [ADM-2] Verificar existencia ANTES de borrar el historial
        cur.execute("SELECT id_cita FROM cita WHERE id_cita = %s", (cita_id,))
        if not cur.fetchone():
            raise HTTPException(status_code=404, detail="Cita no encontrada")

        cur.execute("DELETE FROM historial_cita WHERE id_cita = %s", (cita_id,))
        cur.execute("DELETE FROM cita WHERE id_cita = %s", (cita_id,))

    return {"ok": True}
