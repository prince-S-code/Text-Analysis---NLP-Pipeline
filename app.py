import json
import os
from pathlib import Path
from uuid import uuid4

from flask import Flask, jsonify, request, send_file, send_from_directory, url_for
from werkzeug.utils import secure_filename

from config import (
    ALLOWED_EXTENSIONS,
    FRONTEND_DIST,
    MAX_CONTENT_LENGTH,
    MAX_TEXT_LENGTH,
    UPLOAD_FOLDER,
)
from src.data_ingestion import read_file
from src.database import (
    get_all_records,
    get_analysis_by_id,
    init_db,
    save_analysis,
)
from src.pipeline import analyze_text
from src.wordcloud_gen import generate_wordcloud_image

app = Flask(
    __name__,
    static_folder=str(Path(__file__).resolve().parent / "static"),
    static_url_path="/static",
)
app.config["UPLOAD_FOLDER"] = UPLOAD_FOLDER
app.config["MAX_CONTENT_LENGTH"] = MAX_CONTENT_LENGTH

Path(UPLOAD_FOLDER).mkdir(parents=True, exist_ok=True)
init_db()


def allowed_file(filename):
    return "." in filename and filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS


def serialize_history(records):
    history = []
    for record in records:
        try:
            results = json.loads(record.result)
        except (TypeError, json.JSONDecodeError):
            results = None

        sentiment = results.get("sentiment", {}) if isinstance(results, dict) else {}
        if isinstance(results, dict):
            results["wordcloud_url"] = url_for(
                "history_wordcloud", analysis_id=record.id
            )
        history.append(
            {
                "id": record.id,
                "filename": record.filename,
                "sentiment": sentiment.get("label", ""),
                "score": sentiment.get("score", 0),
                "summary": results.get("summary", "") if isinstance(results, dict) else "",
                "results": results,
            }
        )
    return history


@app.get("/")
def index():
    return send_from_directory(FRONTEND_DIST, "index.html")


@app.get("/api/health")
def health():
    return jsonify({"status": "ok"})


@app.get("/api/history")
def history():
    return jsonify({"history": serialize_history(get_all_records())})


@app.get("/api/history/<int:analysis_id>/wordcloud")
def history_wordcloud(analysis_id):
    record = get_analysis_by_id(analysis_id)
    if record is None:
        return jsonify({"error": "Analysis not found."}), 404

    try:
        results = json.loads(record.result)
    except (TypeError, json.JSONDecodeError):
        results = None

    tokens = results.get("tokens") if isinstance(results, dict) else None
    if not isinstance(tokens, list) or not tokens or not all(
        isinstance(token, str) for token in tokens
    ):
        return jsonify({"error": "No word cloud is available for this analysis."}), 404

    image = generate_wordcloud_image(" ".join(tokens))
    return send_file(image, mimetype="image/png", max_age=60)


@app.post("/api/analyze")
def analyze():
    uploaded_file = request.files.get("file")
    text = request.form.get("text", "")
    filename = "Pasted text"

    if uploaded_file and uploaded_file.filename:
        if text.strip():
            return jsonify({"error": "Choose a file or paste text, not both."}), 400
        filename = secure_filename(uploaded_file.filename)
        if not filename or not allowed_file(filename):
            return jsonify({"error": "Upload a TXT, PDF, or DOCX file."}), 400

        filepath = os.path.join(
            app.config["UPLOAD_FOLDER"],
            f"{uuid4().hex}{Path(filename).suffix}",
        )
        uploaded_file.save(filepath)
        try:
            text = read_file(filepath)
        finally:
            if os.path.exists(filepath):
                os.remove(filepath)
    elif not text.strip():
        return jsonify({"error": "Choose a document or enter some text to analyze."}), 400

    if not text.strip():
        return jsonify({"error": "No readable text was found in that document."}), 400
    if len(text) > MAX_TEXT_LENGTH:
        return jsonify(
            {"error": f"Text must be {MAX_TEXT_LENGTH:,} characters or fewer."}
        ), 413

    results = analyze_text(text)
    wordcloud_filename = results.pop("wordcloud")
    wordcloud_path = Path(app.static_folder) / wordcloud_filename
    try:
        analysis_id = save_analysis(filename, results)
    finally:
        if wordcloud_path.exists():
            wordcloud_path.unlink()

    results["wordcloud_url"] = url_for(
        "history_wordcloud", analysis_id=analysis_id
    )
    return jsonify(
        {
            "filename": filename,
            "results": results,
            "history": serialize_history(get_all_records()),
        }
    )


@app.errorhandler(413)
def request_too_large(_error):
    return jsonify({"error": "The upload is too large. Maximum size is 10 MB."}), 413


application = app

if __name__ == "__main__":
    app.run(
        host="0.0.0.0",
        port=int(os.environ.get("PORT", "5000")),
        debug=os.environ.get("FLASK_DEBUG") == "1",
    )
