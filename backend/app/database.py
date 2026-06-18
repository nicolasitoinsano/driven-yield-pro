# app/database.py
# ─────────────────────────────────────────────────────────────────────────────
# Conexión a MySQL con PyMySQL.
# Configuración desde variables de entorno.
# ─────────────────────────────────────────────────────────────────────────────
import os
import pymysql
import pymysql.cursors
from contextlib import contextmanager

DB_CONFIG = {
    "host":            os.getenv("DB_HOST", "localhost"),
    "port":            int(os.getenv("DB_PORT", "3306")),
    "user":            os.getenv("DB_USER", "root"),
    "password":        os.getenv("DB_PASSWORD", ""),
    "database":        os.getenv("DB_NAME", "driven_yield1"),
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
