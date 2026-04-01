from flask import Flask, render_template, request

app = Flask(__name__)

from google import genai

client = genai.Client(api_key='AIzaSyDzKGMDweo3xYj6NJbIcXe2QDKqpDmew1k')

@app.route("/")
def home():
    return render_template('index.html')

@app.route('/submit', methods=['POST'])
def make_meme():
    subject = request.form['field1']
    background = request.form['field2']
    text = request.form['field3']

    if subject == '' | background == '' | text == '':
        return render_template('index.html')
    
    response = client.models.generate_content(
        model='gemini-2.5-flash',
        contents='Based on the first 2 inputs provided, choose a file that relates to it the most solely based on its name. Even if it doesnt make sense you have to choose one.\n'
        'input 1:\n' + subject +
        '\nlist 1:\nagony.gif, computer.gif, crush.gif, cry.gif, grin.gif, groove.gif, hadtodoittoem.gif, huh.gif, innocent.gif, kiss.gif, lean.gif, man.gif, okay.gif, point.gif, smugyes.gif, thumbup.gif, yesyes.gif\n'
        'input 2:\n' + background +
        '\nlist 2:\nbeauty.jpg, bliss.jpg, calm.jpg, computer.jpg, difficult.jpg, lost.webp, party.jpg, scary.jpg, university.jpg, work.webp'
        'for this third input, write a meme caption that is somewhat to the phrase provided.\n'
        'input 3:\n' + text +
        '\nformat it in this way: output1|output2|output3'
    )

    outputs = response.text.split('|')
    subject = outputs[0]
    background = outputs[1]
    text = outputs[2]
     #TODO: Create gif from inputs (ImageMagick??)