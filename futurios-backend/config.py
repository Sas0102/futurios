from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    app_name: str = "Futurios Backend"
    environment: str = "development"
    database_url: str
    secret_key: str

    # Comma-separated list, e.g.
    # "http://localhost:3000,https://your-app.vercel.app"
    cors_origins: str = "http://localhost:3000"

    class Config:
        env_file = ".env"

    @property
    def cors_origin_list(self) -> list[str]:
        return [origin.strip() for origin in self.cors_origins.split(",") if origin.strip()]


settings = Settings()