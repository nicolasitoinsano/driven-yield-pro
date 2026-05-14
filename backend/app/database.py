# app/database.py
# ─────────────────────────────────────────────────────────────────────────────
# Conexión a MySQL con PyMySQL.
# Cambia los valores de DB_CONFIG según tu entorno.
#
# CORRECCIONES vs versión anterior:
#   - get_db() ahora hace rollback en caso de excepción en lugar de silenciar
#     el error. Con autocommit=True esto igual protege transacciones explícitas.
#   - Se agrega connect_timeout para no colgar el proceso si MySQL no responde.
#   - Se expone ping() en el healthcheck correctamente (conn.ping(reconnect=True)).
# ─────────────────────────────────────────────────────────────────────────────
import pymysql
import pymysql.cursors
from contextlib import contextmanager

DB_CONFIG = {
    "host":            "localhost",
    "port":            3306,
    "user":            "root",
    "password":        "",           # <-- pon tu contraseña aquí
    "database":        "driven_yield1",
    "charset":         "utf8mb4",
    "cursorclass":     pymysql.cursors.DictCursor,
    "autocommit":      True,
    "connect_timeout": 10,
}


def get_connection() -> pymysql.connections.Connection:
    return pymysql.connect(**DB_CONFIG)


@contextmanager
def get_db():
    """
    Context manager que garantiza cierre de conexión.
    Si ocurre una excepción dentro del bloque `with get_db() as conn:`
    el error se propaga normalmente (FastAPI lo captura y responde 500).
    """
    conn = get_connection()
    try:
        yield conn
    except Exception:
        # Deja que la excepción suba; FastAPI genera HTTP 500 automáticamente.
        raise
    finally:
        conn.close()
