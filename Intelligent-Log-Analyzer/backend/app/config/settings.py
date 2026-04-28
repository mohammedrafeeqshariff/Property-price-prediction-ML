from pydantic_settings import BaseSettings, SettingsConfigDict
from pathlib import Path
import os

class Settings(BaseSettings):
    GEMINI_API_KEY: str = ""
    APP_ENV: str = "development"
    LOG_STORAGE_PATH: str = "./temp_logs"
    PORT: int = 8000
    
    # Create storage path if it doesn't exist
    @property
    def storage_path(self) -> Path:
        path = Path(self.LOG_STORAGE_PATH)
        path.mkdir(parents=True, exist_ok=True)
        return path

    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

settings = Settings()
