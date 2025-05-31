from flask import Flask, render_template, Response, request, jsonify
import cv2
import numpy as np
import mediapipe as mp
from exercise_logic import Pushup  # import other functions as needed
import base64

app = Flask(__name__)
mp_pose = mp.solutions.pose
pose = mp_pose.Pose()

stage = None
rep_count = 0

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/protein')
def protein():
    return render_template('protein.html')

@app.route('/process_frame', methods=['POST'])
def process_frame():
    global stage, rep_count
    data = request.json['image']
    encoded_data = data.split(',')[1]
    frame_data = base64.b64decode(encoded_data)
    np_img = np.frombuffer(frame_data, np.uint8)
    frame = cv2.imdecode(np_img, cv2.IMREAD_COLOR)

    rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
    results = pose.process(rgb)

    if results.pose_landmarks:
        landmarks = results.pose_landmarks.landmark
        stage, rep_count, _ = Pushup(landmarks, stage, rep_count)  # example

    return jsonify({'reps': rep_count, 'stage': stage})

if __name__ == '__main__':
    app.run(debug=True)
