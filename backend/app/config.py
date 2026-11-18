from functools import lru_cache

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Configurações lidas de variáveis de ambiente (ou do arquivo .env em desenvolvimento)."""

    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    ai_api_key: str = ""
    ai_base_url: str = "https://generativelanguage.googleapis.com/v1beta/openai"
    ai_model: str = ""
    ai_timeout_seconds: float = 30.0
    cors_origins: str = "http://localhost:3000"


    jwt_secret: str = "496c95fc5373168f76d3a5025b66ddb53c34ac456165256ff7ba757c6aa86735"
    jwt_algorithm: str = "HS256"
    jwt_expire_minutes: int = 1440
    @property
    def cors_origins_list(self) -> list[str]:
        return [o.strip().rstrip("/") for o in self.cors_origins.split(",") if o.strip()]


@lru_cache
def get_settings() -> Settings:
    return Settings()
