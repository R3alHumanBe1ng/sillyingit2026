from flask import Flask, render_template, request

app = Flask(__name__)

from google import genai

client = genai.Client(api_key='')

@app.route("/")
def home():
    return render_template('index.html')

@app.route('/submit', methods=['POST'])
def handle_post():
    subject = request.form['field1']
    background = request.form['field2']
    text = request.form['field3']

    if subject == '' | background == '' | text == '':
        return render_template('index.html')
    
    