from app.database import get_connection, get_cursor

try:
    conn = get_connection()
    cursor = get_cursor(conn)
    cursor.execute("SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'")
    tablas = cursor.fetchall()
    print("✅ Conexión exitosa. Tablas encontradas:")
    for t in tablas:
        print(f"  - {t['table_name']}")
    conn.close()
except Exception as e:
    print(f"❌ Error: {e}")