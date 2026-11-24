# TEXT-INTEL: NLP Pipeline for Sentiment Analysis and Text Summarization

Text-Intel is a React + TypeScript workspace backed by a Flask NLP pipeline. Analyze pasted text or TXT, PDF, and DOCX documents to see sentiment, a short summary, keywords, named entities, processed tokens, and a word cloud. Recent results are stored in SQLite locally or PostgreSQL when deployed.

## Features

- Responsive React interface with drag-and-drop document upload and paste-text modes
- Sentiment and polarity metrics, summaries, keywords, named entities, and word clouds
- Recent analysis history, sample input, JSON report export, and one-click summary copy
- TXT, PDF, and DOCX extraction with a 10 MB upload limit and 50,000-character text limit
- Flask JSON API and Vite development proxy

## Run locally (Windows)

Use Python 3.11 or 3.12 and Node.js 22 or newer.

```powershell
# Create and activate a Python environment
py -3.12 -m venv .venv
.\.venv\Scripts\Activate.ps1

# Install backend dependencies and NLP resources
python -m pip install -r requirements.txt
python -m spacy download en_core_web_sm
python -m nltk.downloader punkt punkt_tab stopwords

# Install frontend dependencies
npm --prefix frontend ci
```

Open two terminals in the project directory:

```powershell
# Terminal 1: Flask API on http://127.0.0.1:5000
.\.venv\Scripts\Activate.ps1
python app.py
```

```powershell
# Terminal 2: React development UI on http://localhost:5173
npm --prefix frontend run dev
```

Open **http://localhost:5173**. Vite proxies `/api` requests to Flask. For a production-style local run, build React first and then start Flask:

```powershell
npm --prefix frontend run build
python app.py
```

The compiled app is served by Flask at **http://localhost:5000**. Set `FLASK_DEBUG=1` only for local debugging.

## API

- `GET /api/health` — health check
- `GET /api/history` — recent saved analyses
- `POST /api/analyze` — multipart field `file` or text field `text`

The server validates supported document types, removes uploaded files after extraction, and stores the analysis output (not the original document text).

## Deploy to Render

The repository includes a multi-stage [Dockerfile](./Dockerfile) and a Render Blueprint at [render.yaml](./render.yaml). The Docker build compiles the React app, installs Python dependencies and NLP models, and runs Flask with Gunicorn.

1. Push this repository to a GitHub account you can connect to Render:

   ```powershell
   git add .
   git commit -m "Build Text-Intel React NLP workspace"
   git push origin main
   ```

2. In Render, choose **New → Blueprint**, connect the GitHub repository, and approve the `text-intel-nlp` free web service described by `render.yaml`.
3. Create a free PostgreSQL project at [Neon](https://neon.com/). Copy its connection string; keep the SSL requirement in the URL.
4. In Render, open the web service's **Environment** settings and set `DATABASE_URL` to the Neon connection string, then save and deploy. The app converts PostgreSQL URLs to the psycopg driver format.
5. Wait for the first Docker build. It downloads the spaCy English model and NLTK tokenizer/stopword data, so the initial build may take several minutes.
6. When the deployment is healthy, open the Render service URL. Check `https://<your-service>.onrender.com/api/health` for `{"status":"ok"}` and then use the root URL for the UI.

Render's free web service sleeps after 15 minutes without traffic, so its first request after idle can take about a minute. Its filesystem is ephemeral; use Neon for history instead of SQLite (Render's free Postgres expires after 30 days). Generated word clouds for saved analyses are recreated from the stored tokens, so they still work after a service restart. The app has no user authentication: anyone who can reach the deployment can view the shared saved-analysis history and results. Add authentication and request rate-limiting before exposing sensitive or high-volume use publicly.

### Deploy the Docker image elsewhere

Any container host can build and run the same image:

```powershell
docker build -t text-intel-nlp .
docker run --rm -p 10000:10000 -e DATABASE_URL="<postgresql-connection-url>" text-intel-nlp
```

Set `DATABASE_URL` to a reachable PostgreSQL connection string. The container listens on `PORT` (10000 by default); configure the host's health check to `GET /api/health`.
