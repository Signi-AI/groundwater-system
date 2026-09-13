from pathlib import Path
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    DATABASE_URL: str
    SECRET_KEY: str = "change-me-in-production-use-long-random-string"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    MODEL_PATH: str = "ml/model/groundwater_model.joblib"
    CORS_ORIGINS: str = "http://localhost:3000,http://127.0.0.1:3000"

    MAIL_USERNAME:str=""
    MAIL_PASSWORD:str=""
    MAIL_FROM:str=""
    MAIL_PORT:int=587
    MAIL_SERVER:str="smtp.gmail.com"
    MAIL_STARTTLS: bool = True
    MAIL_SSL_TLS:bool=False
    SMTP_TIMEOUT_SECONDS: int = 10
    DEBUG_OTP:bool=True

    @property
    def cors_origins_list(self) -> list:
        return [o.strip() for o in self.CORS_ORIGINS.split(",") if o.strip()]

    @property
    def database_url(self) -> str:
        if self.DATABASE_URL.startswith("postgres://"):
            return "postgresql+psycopg2://" + self.DATABASE_URL[len("postgres://"):]
        if self.DATABASE_URL.startswith("postgresql://"):
            return "postgresql+psycopg2://" + self.DATABASE_URL[len("postgresql://"):]
        return self.DATABASE_URL

    @property
    def model_full_path(self) -> Path:
        base = Path(__file__).resolve().parents[2]
        return base / self.MODEL_PATH

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"
        extra = "ignore"


settings = Settings()