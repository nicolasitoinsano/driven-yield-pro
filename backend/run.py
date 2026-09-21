"""
Punto de entrada para ejecutar el servidor backend FastAPI de Driven Yield Pro.
Carga las variables de entorno y levanta el servidor uvicorn en modo reload.
"""
from dotenv import load_dotenv
load_dotenv(dotenv_path='.env', override=True)

import uvicorn

if __name__ == "__main__":
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
    )
