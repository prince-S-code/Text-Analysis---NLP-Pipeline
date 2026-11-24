from textblob import TextBlob

def analyze_sentiment(text):
    blob = TextBlob(text)
    polarity = blob.sentiment.polarity

    if polarity > 0:
        label = "Positive"
    elif polarity < 0:
        label = "Negative"
    else:
        label = "Neutral"

    # score: map polarity (-1..1) to confidence (0..1)
    score = (abs(polarity) + 1) / 2

    return {"label": label, "score": score, "polarity": polarity}