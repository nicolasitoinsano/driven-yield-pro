
import logging
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from dotenv import load_dotenv
load_dotenv()

import uvicorn

if __name__ == "__main__":
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)

load_dotenv()  # Carga el .env antes de todo

from app.routers import auth, admin, citas, servicios, perfil

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="driven yield Pro API",
    version="2.0.0",
    description="Backend para driven yield Pro System",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.middleware("http")
async def log_requests(request: Request, call_next):
    logger.info("%s %s", request.method, request.url.path)
    response = await call_next(request)
    return response

app.include_router(auth.router)
app.include_router(admin.router)
app.include_router(citas.router)
app.include_router(servicios.router)
app.include_router(perfil.router)

@app.get("/")
def root():
    return {"status": "ok", "api": "driven yield Pro v2.0"}

@app.get("/health")
def health():
    from app.database import get_db
    try:
        with get_db() as conn:
            conn.ping(reconnect=True)
        return {"status": "ok", "db": "connected"}
    except Exception as exc:
        return {"status": "error", "db": str(exc)}