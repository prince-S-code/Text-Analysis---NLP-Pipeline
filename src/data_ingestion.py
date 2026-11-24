from pathlib import Path

from docx import Document
from PyPDF2 import PdfReader


def read_file(file_path):
    """Extract readable text from a supported document."""
    path = Path(file_path)
    extension = path.suffix.lower()

    if extension == ".txt":
        return path.read_text(encoding="utf-8-sig")
    if extension == ".pdf":
        return "\n".join(page.extract_text() or "" for page in PdfReader(path).pages)
    if extension == ".docx":
        document = Document(path)
        paragraphs = [paragraph.text for paragraph in document.paragraphs]
        cells = [
            cell.text
            for table in document.tables
            for row in table.rows
            for cell in row.cells
        ]
        return "\n".join(text for text in paragraphs + cells if text)

    raise ValueError(f"Unsupported document type: {extension or 'unknown'}")
