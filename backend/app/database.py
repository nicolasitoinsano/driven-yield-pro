import psycopg2
import psycopg2.extras
from contextlib import contextmanager

DB_CONFIG = {
    "host":            "aws-1-us-east-2.pooler.supabase.com",
    "port":            5432,
    "user":            "postgres.dfqikpaiiykqxrvsvqhq",
    "password":        "Driven_yield1",
    "dbname":          "postgres",
    "connect_timeout": 10,
    "sslmode":         "require",
}

def get_connection():
    return psycopg2.connect(**DB_CONFIG)


def get_cursor(conn):
    return conn.cursor(cursor_factory=psycopg2.extras.DictCursor)


@contextmanager
def get_db():
    conn = get_connection()
    conn.autocommit = True
    try:
        yield conn
    except Exception:
        raise
    finally:
        conn.close()
