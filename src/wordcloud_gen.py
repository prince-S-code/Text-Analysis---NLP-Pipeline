import os
from wordcloud import WordCloud
import matplotlib.pyplot as plt

def generate_wordcloud(text):
    wc = WordCloud(width=600, height=300, background_color="white").generate(text)
    
    # Get the project root directory
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    static_dir = os.path.join(base_dir, "static")
    
    # Ensure static directory exists
    os.makedirs(static_dir, exist_ok=True)
    
    filepath = os.path.join(static_dir, "wordcloud.png")
    wc.to_file(filepath)
    return "wordcloud.png" # Return just the filename for url_for in the template