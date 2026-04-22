from sklearn.feature_extraction.text import TfidfVectorizer

def extract_keywords(text, top_n=10):
    vectorizer = TfidfVectorizer(stop_words='english')
    tfidf = vectorizer.fit_transform([text])
    scores = zip(vectorizer.get_feature_names_out(), tfidf.toarray()[0])
    sorted_words = sorted(scores, key=lambda x: x[1], reverse=True)
    # Return just the keyword strings (not tuples)
    return [word for word, score in sorted_words[:top_n] if score > 0]