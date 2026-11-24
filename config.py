import os
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent
UPLOAD_FOLDER = os.environ.get("UPLOAD_FOLDER", str(BASE_DIR / "uploads"))
ALLOWED_EXTENSIONS = {"txt", "pdf", "docx"}
MAX_CONTENT_LENGTH = 10 * 1024 * 1024
MAX_TEXT_LENGTH = 50_000
FRONTEND_DIST = BASE_DIR / "static" / "app"

DB_URI = os.environ.get("DATABASE_URL") or (
    f"sqlite:///{(BASE_DIR / 'analysis.db').as_posix()}"
)
if DB_URI.startswith("postgres://"):
    DB_URI = DB_URI.replace("postgres://", "postgresql+psycopg://", 1)
elif DB_URI.startswith("postgresql://"):
    DB_URI = DB_URI.replace("postgresql://", "postgresql+psycopg://", 1)
