from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import get_settings
from app.routers import exercises

settings = get_settings()

app = FastAPI(
    title="Frase a Frase API",
    description="API com IA para gerar exercícios de inglês e corrigir frases de estudantes.",
    version="0.2.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["*"],
)

app.include_router(exercises.router)


@app.get("/", tags=["Status"])
def root():
    return {"app": "Frase a Frase API", "docs": "/docs"}


@app.get("/health", tags=["Status"])
def health():
    return {"status": "ok", "ai_configured": bool(settings.ai_api_key and settings.ai_model)}
