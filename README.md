# Text Analysis - NLP Pipeline

[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Python](https://img.shields.io/badge/Python-3.8+-blue.svg)](https://www.python.org/)
[![Flask](https://img.shields.io/badge/Flask-2.0+-lightgrey.svg)](https://flask.palletsprojects.com/)

> A comprehensive Natural Language Processing (NLP) pipeline built with Python and Flask for analyzing text data. Upload documents and get instant insights through preprocessing, sentiment analysis, named entity recognition, keyword extraction, summarization, and word cloud visualization.

## 📋 Table of Contents

- [About the Project](#about-the-project)
- [✨ Features](#-features)
- [🛠️ Tech Stack](#️-tech-stack)
- [🚀 Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
- [📖 Usage](#-usage)
- [📁 Project Structure](#-project-structure)
- [🤝 Contributing](#-contributing)
- [📄 License](#-license)
- [📞 Contact](#-contact)

## About the Project

This project provides a complete NLP pipeline for text analysis, featuring a user-friendly web interface built with Flask. It processes various document formats (TXT, PDF, DOCX) and delivers comprehensive analysis results including sentiment scores, extracted entities, keywords, summaries, and visual word clouds. All analysis history is stored in a local SQLite database for easy tracking.

## ✨ Features

- 📄 **Multi-format Support**: Process TXT, PDF, and DOCX files
- 🧹 **Text Preprocessing**: Clean and normalize text data
- 😊 **Sentiment Analysis**: Determine positive/negative sentiment with confidence scores
- 🏷️ **Named Entity Recognition**: Extract persons, organizations, locations, and more
- 🔑 **Keyword Extraction**: Identify important terms using TF-IDF and other methods
- 📝 **Text Summarization**: Generate concise summaries of long documents
- ☁️ **Word Cloud Generation**: Create visual representations of text content
- 🌐 **Web Interface**: Intuitive Flask-based UI for file uploads and results
- 💾 **Analysis History**: SQLite database storage of all processed documents
- 📊 **Real-time Processing**: Instant results with progress tracking

## 🛠️ Tech Stack

### Backend
- **Python** - Core programming language
- **Flask** - Web framework
- **SQLAlchemy** - Database ORM

### NLP Libraries
- **NLTK** - Natural language processing toolkit
- **spaCy** - Industrial-strength NLP
- **TextBlob** - Simplified text processing
- **scikit-learn** - Machine learning algorithms
- **wordcloud** - Word cloud generation

### Data Processing
- **pandas** - Data manipulation
- **numpy** - Numerical computing
- **matplotlib** - Plotting library

### File Handling
- **PyPDF2** - PDF processing
- **python-docx** - Word document handling
- **Werkzeug** - File uploads

## 🚀 Getting Started

Follow these instructions to set up and run the project on your local machine.

### Prerequisites

Before running this project, ensure you have the following installed:

- **Python 3.8 or higher**
  `ash
  python --version
  `
  If not installed, download from [python.org](https://www.python.org/downloads/)

- **pip** (Python package installer - usually comes with Python)
  `ash
  pip --version
  `

- **Git** (for cloning the repository)
  `ash
  git --version
  `
  Download from [git-scm.com](https://git-scm.com/downloads)

### Installation

1. **Clone the repository**
   `ash
   git clone https://github.com/prince-S-code/Text-Analysis---NLP-Pipeline.git
   cd Text-Analysis---NLP-Pipeline
   `

2. **Create a virtual environment (recommended)**
   `ash
   python -m venv venv
   # On Windows:
   venv\Scripts\activate
   # On macOS/Linux:
   # source venv/bin/activate
   `

3. **Install Python dependencies**
   `ash
   pip install -r requirements.txt
   `

4. **Download NLTK data**
   `ash
   python -c "import nltk; nltk.download('punkt'); nltk.download('stopwords'); nltk.download('wordnet')"
   `

5. **Download spaCy language model**
   `ash
   python -m spacy download en_core_web_sm
   `

## 📖 Usage

1. **Start the Flask application**
   `ash
   python app.py
   `

2. **Open your web browser**
   
   Navigate to: http://localhost:5000

3. **Upload and analyze documents**
   
   - Click "Choose File" to select a TXT, PDF, or DOCX file
   - Click "Analyze" to process the document
   - View comprehensive analysis results including:
     - Preprocessed text
     - Sentiment analysis (positive/negative with score)
     - Named entities (persons, organizations, locations)
     - Extracted keywords
     - Text summary
     - Word cloud visualization

4. **View analysis history**
   
   - Scroll down to see previously analyzed documents
   - Each entry shows filename, analysis date, and key results

### API Usage (Optional)

The pipeline can also be used programmatically:

`python
from src.pipeline import run_pipeline

results = run_pipeline('path/to/your/document.txt')
print(results)
`

## 📁 Project Structure

`
Text-Analysis---NLP-Pipeline/
├── app.py                    # Main Flask application
├── config.py                 # Configuration settings
├── requirements.txt          # Python dependencies
├── README.md                 # Project documentation
├── input1.txt               # Sample input file
├── input2.txt               # Sample input file
├── input3.txt               # Sample input file
├── src/                     # Source code directory
│   ├── __init__.py
│   ├── pipeline.py          # Main pipeline orchestration
│   ├── preprocessing.py     # Text cleaning and preprocessing
│   ├── sentiment_analysis.py # Sentiment analysis module
│   ├── ner_extraction.py    # Named entity recognition
│   ├── keyword_extraction.py # Keyword extraction algorithms
│   ├── tfidf_keywords.py    # TF-IDF keyword extraction
│   ├── summarizer.py        # Text summarization
│   ├── wordcloud_gen.py     # Word cloud generation
│   ├── ner.py               # NER utilities
│   └── database.py          # Database operations
├── templates/               # HTML templates
│   └── index.html           # Main web interface
├── static/                  # Static assets
│   └── styles.css           # CSS stylesheets
├── uploads/                 # Temporary file uploads
└── __pycache__/            # Python bytecode cache
`

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

1. Fork the repository
2. Create a feature branch (git checkout -b feature/AmazingFeature)
3. Commit your changes (git commit -m 'Add some AmazingFeature')
4. Push to the branch (git push origin feature/AmazingFeature)
5. Open a Pull Request

### Development Setup

`ash
# Clone your fork
git clone https://github.com/your-username/Text-Analysis---NLP-Pipeline.git
cd Text-Analysis---NLP-Pipeline

# Create and activate virtual environment
python -m venv venv
venv\Scripts\activate  # Windows
# source venv/bin/activate  # macOS/Linux

# Install dependencies
pip install -r requirements.txt

# Download NLP models
python -c "import nltk; nltk.download('punkt'); nltk.download('stopwords'); nltk.download('wordnet')"
python -m spacy download en_core_web_sm

# Run in development mode
python app.py
`

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Contact

**Prince S Code**
- GitHub: [@prince-S-code](https://github.com/prince-S-code)
- Project Link: [https://github.com/prince-S-code/Text-Analysis---NLP-Pipeline](https://github.com/prince-S-code/Text-Analysis---NLP-Pipeline)

---

⭐ If you find this project helpful, please give it a star!
