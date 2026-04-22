# 🚀 Text Analysis - NLP Pipeline

A modern, full-stack **Natural Language Processing (NLP) pipeline** built with **Python** and **Flask**. Analyze text documents and extract meaningful insights including sentiment, entities, keywords, summaries, and visualizations — all through a clean web interface.

---

## 📋 Table of Contents

* [About the Project](#about-the-project)
* [✨ Features](#-features)
* [🛠️ Tech Stack](#️-tech-stack)
* [🚀 Getting Started](#-getting-started)

  * [Prerequisites](#prerequisites)
  * [Installation](#installation)
* [📖 Usage](#-usage)
* [📁 Project Structure](#-project-structure)
* [🤝 Contributing](#-contributing)
* [📄 License](#-license)
* [📞 Contact](#-contact)

---

## 📌 About the Project

This project is a **complete NLP pipeline** designed to process and analyze text data efficiently. It supports multiple document formats and provides:

* Deep text preprocessing
* Sentiment insights
* Entity extraction
* Keyword detection
* Automatic summarization
* Visual word clouds

All results are stored in a **SQLite database** for tracking and future reference.

---

## ✨ Features

* 📄 **Multi-format Support**: TXT, PDF, DOCX
* 🧹 **Text Preprocessing**: Cleaning, normalization, tokenization
* 😊 **Sentiment Analysis**: Polarity + confidence scores
* 🏷️ **Named Entity Recognition (NER)**: Persons, locations, organizations
* 🔑 **Keyword Extraction**: TF-IDF & statistical methods
* 📝 **Text Summarization**: Concise summaries of long text
* ☁️ **Word Cloud Generation**: Visual text insights
* 🌐 **Web Interface**: User-friendly Flask UI
* 💾 **History Tracking**: SQLite-based storage
* ⚡ **Real-time Processing**: Instant analysis results

---

## 🛠️ Tech Stack

### Backend

* Python
* Flask
* SQLAlchemy

### NLP Libraries

* NLTK
* spaCy
* TextBlob
* scikit-learn
* wordcloud

### Data Processing

* pandas
* numpy
* matplotlib

### File Handling

* PyPDF2
* python-docx
* Werkzeug

---

## 🚀 Getting Started

### Prerequisites

Make sure you have:

```bash
python --version   # Python 3.8+
pip --version
git --version
```

---

### Installation

```bash
# Clone the repository
git clone https://github.com/prince-S-code/Text-Analysis---NLP-Pipeline.git
cd Text-Analysis---NLP-Pipeline

# Create virtual environment
python -m venv venv

# Activate environment
# Windows
venv\Scripts\activate
# macOS/Linux
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Download NLTK data
python -c "import nltk; nltk.download('punkt'); nltk.download('stopwords'); nltk.download('wordnet')"

# Download spaCy model
python -m spacy download en_core_web_sm
```

---

## 📖 Usage

```bash
python app.py
```

Open your browser and go to:

```
http://localhost:5000
```

### 🔍 Steps

1. Upload a file (TXT, PDF, DOCX)
2. Click **Analyze**
3. View results:

   * Cleaned text
   * Sentiment score
   * Named entities
   * Keywords
   * Summary
   * Word cloud

### 📊 History

* Scroll down to view previously analyzed files
* Stored with timestamps and results

---

### ⚙️ API Usage (Optional)

```python
from src.pipeline import run_pipeline

results = run_pipeline("path/to/file.txt")
print(results)
```

---

## 📁 Project Structure

```
Text-Analysis---NLP-Pipeline/
│── app.py
│── config.py
│── requirements.txt
│── README.md
│── input1.txt
│── input2.txt
│── input3.txt
│
├── src/
│   ├── pipeline.py
│   ├── preprocessing.py
│   ├── sentiment_analysis.py
│   ├── ner_extraction.py
│   ├── keyword_extraction.py
│   ├── tfidf_keywords.py
│   ├── summarizer.py
│   ├── wordcloud_gen.py
│   ├── ner.py
│   └── database.py
│
├── templates/
│   └── index.html
│
├── static/
│   └── styles.css
│
├── uploads/
└── __pycache__/
```

---

## 🤝 Contributing

Contributions are welcome!

```bash
# Fork the repo
# Create feature branch
git checkout -b feature/AmazingFeature

# Commit changes
git commit -m "Add AmazingFeature"

# Push
git push origin feature/AmazingFeature
```

Then open a Pull Request 🚀

---

## 📞 Contact

**Prince S Code**

* GitHub: https://github.com/prince-S-code
* Project: https://github.com/prince-S-code/Text-Analysis---NLP-Pipeline

---

⭐ *If you found this useful, consider giving it a star!*
