from io import BytesIO
import os
from uuid import uuid4
from wordcloud import WordCloud


def create_wordcloud(text):
    return WordCloud(width=600, height=300, background_color="white").generate(text)


def generate_wordcloud(text):
    wc = create_wordcloud(text)
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    static_dir = os.path.join(base_dir, "static")
    os.makedirs(static_dir, exist_ok=True)

    filename = f"wordcloud-{uuid4().hex}.png"
    filepath = os.path.join(static_dir, filename)
    wc.to_file(filepath)
    return filename


def generate_wordcloud_image(text):
    image = create_wordcloud(text).to_image()
    output = BytesIO()
    image.save(output, format="PNG")
    output.seek(0)
    return output
