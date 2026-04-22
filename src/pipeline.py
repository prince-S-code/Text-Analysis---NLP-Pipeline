from .preprocessing import preprocess_text
from .sentiment_analysis import analyze_sentiment
from .ner_extraction import extract_entities
from .keyword_extraction import extract_keywords
from .summarizer import summarize_text
from .wordcloud_gen import generate_wordcloud

def run_pipeline(filepath):
    with open(filepath, "r", encoding="utf-8") as f:
        text = f.read()

    tokens = preprocess_text(text)
    sentiment = analyze_sentiment(text)
    entities = extract_entities(text)
    keywords = extract_keywords(text)
    summary = summarize_text(text)
    wc_path = generate_wordcloud(text)

    return {
        "tokens": tokens,
        "sentiment": sentiment,
        "entities": entities,
        "keywords": keywords,
        "summary": summary,
        "wordcloud": wc_path
    }