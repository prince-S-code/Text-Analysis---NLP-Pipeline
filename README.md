# Text Analysis - NLP Pipeline

A comprehensive Natural Language Processing (NLP) pipeline built with Python and Flask for analyzing text data. This project provides various text processing capabilities including preprocessing, sentiment analysis, named entity recognition (NER), keyword extraction, text summarization, and word cloud generation.

## Features

- **Text Preprocessing**: Clean and prepare text data for analysis
- **Sentiment Analysis**: Determine the sentiment (positive/negative) of text
- **Named Entity Recognition (NER)**: Extract entities like persons, organizations, locations
- **Keyword Extraction**: Identify important keywords using TF-IDF
- **Text Summarization**: Generate concise summaries of longer texts
- **Word Cloud Generation**: Visualize text data as word clouds
- **Web Interface**: Flask-based web application for easy interaction

## Installation

1. Clone the repository:
   `ash
   git clone https://github.com/prince-S-code/Text-Analysis---NLP-Pipeline.git
   cd Text-Analysis---NLP-Pipeline
   `

2. Install the required dependencies:
   `ash
   pip install -r requirements.txt
   `

## Usage

Run the Flask application:
`ash
python app.py
`

Open your browser and navigate to http://localhost:5000 to access the web interface.

## Project Structure

- pp.py: Main Flask application
- config.py: Configuration settings
- src/: Source code directory containing NLP modules
  - preprocessing.py: Text preprocessing functions
  - sentiment_analysis.py: Sentiment analysis module
  - 
er_extraction.py: Named entity recognition
  - keyword_extraction.py: Keyword extraction using various methods
  - summarizer.py: Text summarization
  - wordcloud_gen.py: Word cloud generation
  - pipeline.py: Main pipeline orchestration
- 	emplates/: HTML templates for the web interface
- static/: CSS and other static files
- uploads/: Directory for uploaded files
- equirements.txt: Python dependencies

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is open source. Please check the license file for more details.
