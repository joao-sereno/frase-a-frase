from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import get_settings
from app.routers import auth, exercises, study
from app.store import init_demo_data

settings = get_settings()
init_demo_data()

app = FastAPI(
    title="Frase a Frase API",
    description="API com IA para gerar exercícios de inglês e corrigir frases de estudantes.",
    version="0.3.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(exercises.router)
app.include_router(study.router)


@app.get("/", tags=["Status"])
def root():
    return {"app": "Frase a Frase API", "docs": "/docs"}


@app.get("/health", tags=["Status"])
def health():
    return {"status": "ok", "ai_configured": bool(settings.ai_api_key and settings.ai_model)}