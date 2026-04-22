from textblob import TextBlob

def summarize_text(text):
    blob = TextBlob(text)
    sentences = blob.sentences
    if len(sentences) > 3:
        return str(" ".join(str(s) for s in sentences[:3]))
    return text