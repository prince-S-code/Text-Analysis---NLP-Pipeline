import os
import io
import base64
from wordcloud import WordCloud
import matplotlib.pyplot as plt

def generate_wordcloud(text):
    wc = WordCloud(width=600, height=300, background_color="white").generate(text)
    
    # Save to bytes
    buf = io.BytesIO()
    wc.to_image().save(buf, format='PNG')
    buf.seek(0)
    
    # Encode to base64
    img_base64 = base64.b64encode(buf.getvalue()).decode('utf-8')
    return f"data:image/png;base64,{img_base64}"
