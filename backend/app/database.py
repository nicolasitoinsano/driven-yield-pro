# app/database.py
# ─────────────────────────────────────────────────────────────────────────────
# Conexión a PostgreSQL (Supabase) con psycopg2.
# ─────────────────────────────────────────────────────────────────────────────
import os
import psycopg2
import psycopg2.extras
from contextlib import contextmanager

SUPABASE_URL = os.getenv("SUPABASE_URL", "")

def get_connection():
    SUPABASE_URL = os.getenv("SUPABASE_URL", "")
    if not SUPABASE_URL:
        raise ValueError("La variable SUPABASE_URL no está configurada.")
    
    conn = psycopg2.connect(SUPABASE_URL, cursor_factory=psycopg2.extras.RealDictCursor)
    conn.autocommit = True
    return conn


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
