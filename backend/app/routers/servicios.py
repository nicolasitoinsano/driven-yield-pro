# app/routers/servicios.py
# ─────────────────────────────────────────────────────────────────────────────
# Sin bugs críticos en el original, pero se agrega:
#  - Conversión explícita de campos Decimal (precio) a float para JSON seguro.
#  - Conversión de campo duracion (puede venir como timedelta) a string.
# ─────────────────────────────────────────────────────────────────────────────

import datetime as dt
from decimal import Decimal

from fastapi import APIRouter
from app.database import get_db

router = APIRouter(prefix="/api/servicios", tags=["servicios"])


def _format_servicio(row: dict) -> dict:
    # Decimal → float (evita error de serialización JSON con pymysql)
    if isinstance(row.get("precio"), Decimal):
        row["precio"] = float(row["precio"])
    # timedelta → string legible (e.g. "01:30")
    dur = row.get("duracion")
    if isinstance(dur, dt.timedelta):
        total = int(dur.total_seconds())
        h, rem = divmod(total, 3600)
        m, _   = divmod(rem, 60)
        row["duracion"] = f"{h:02d}:{m:02d}"
    return row


@router.get("")
def get_servicios():
    with get_db() as conn:
        cur = conn.cursor()
        cur.execute(
            "SELECT id_servicio AS id, nombre, categoria, precio, duracion, descripcion, imagen "
            "FROM servicio WHERE activo = 1 ORDER BY categoria, nombre"
        )
        rows = cur.fetchall()
    return [_format_servicio(r) for r in rows]
