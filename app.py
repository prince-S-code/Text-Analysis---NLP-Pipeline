from flask import Flask, render_template, request, redirect, url_for
from werkzeug.utils import secure_filename
import os

from config import UPLOAD_FOLDER, ALLOWED_EXTENSIONS
from src.pipeline import run_pipeline
from src.database import init_db, save_analysis, get_all_records

app = Flask(__name__, template_folder='../templates', static_folder='../static')
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

init_db()

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route('/', methods=['GET', 'POST'])
def index():
    results = None

    if request.method == 'POST':
        file = request.files.get('file')
        if not file or file.filename == "":
            return redirect(request.url)

        if allowed_file(file.filename):
            filename = secure_filename(file.filename)
            filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
            file.save(filepath)

            results = run_pipeline(filepath)

            save_analysis(filename, results)

            os.remove(filepath)

    history = get_all_records()
    return render_template('index.html', results=results, history=history)

application = app

if __name__ == "__main__":
    app.run(debug=True)
