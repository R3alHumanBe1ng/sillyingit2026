from flask import Flask, render_template, request, send_file
from io import BytesIO
from google import genai
from wand import image, font

app = Flask(__name__)

client = genai.Client()

IMG_SIZE = 420

@app.route("/")
def home():
    return render_template('index.html')

@app.route('/submit', methods=['POST'])
def make_meme():
    blob = BytesIO()
    frames = []

    subject = request.form['field1']
    background = request.form['field2']
    text = request.form['field3']

    if subject == '' or background == '' or text == '':
        return render_template('index.html')
    
    response = client.models.generate_content(
        model='gemini-3.1-flash-lite-preview',
        contents='Based on the first 2 inputs provided, choose a file that relates to it the most solely based on its name. Even if it doesnt make sense you have to choose one.\n'
        'input 1:\n' + subject +
        '\nlist 1:\nagony.gif, computer.gif, crush.gif, cry.gif, grin.gif, groove.gif, hadtodoittoem.gif, huh.gif, innocent.gif, kiss.gif, lean.gif, man.gif, okay.gif, point.gif, smugyes.gif, thumbup.gif, yesyes.gif\n'
        'input 2:\n' + background +
        '\nlist 2:\nbeauty.jpg, bliss.jpg, calm.jpg, computer.jpg, difficult.jpg, lost.webp, party.jpg, scary.jpg, university.jpg, work.webp'
        'for this third input, write a meme caption that is somewhat to the phrase provided.\n'
        'input 3:\n' + text +
        '\nformat it in this way: output1|output2|output3'
    )
    print(response)

    outputs = response.text.split('|')
    subject = outputs[0]
    background = outputs[1]
    text = outputs[2]
     #TODO: Create gif from inputs (ImageMagick??)
    with image.Image(filename='static/meme_background/'+background) as bg:
        bg.resize(IMG_SIZE, IMG_SIZE)

        with image.Image(width=IMG_SIZE, height=100, background=None) as caption_img:
            caption_img.font = font.Font("static/impact.ttf", color='white', stroke_color='black', stroke_width=1)
            caption_img.caption(
                text,
                width=IMG_SIZE,
                height=100,
                gravity="center"
            )

            with image.Image(filename='static/meme_subject/'+subject) as guy:
                guy.coalesce()

                for frame in guy.sequence:
                    with image.Image(image=frame) as frame_img:  # match size if needed
                        # Start with background copy
                        with bg.clone() as canvas:

                            # Composite overlay (respects transparency)
                            canvas.composite(frame_img, left=0, top=0, gravity='center')

                            # Composite caption at bottom
                            y = IMG_SIZE - caption_img.height
                            canvas.composite(caption_img, 0, y)

                            # Match frame delay
                            canvas.delay = frame_img.delay
                            frames.append(canvas.clone())
    with image.Image() as result:
        for f in frames:
            result.sequence.append(f)
        result.optimize_layers()
        result.format = "gif"
        result.save(file=blob)
    
    blob.seek(0)
    return send_file(blob, mimetype="image/gif")

if __name__ == "__main__":
    app.run(debug=True)