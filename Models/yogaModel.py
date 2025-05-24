import cv2
import mediapipe as mp
import numpy as np
import time

# Initialize MediaPipe
mp_drawing = mp.solutions.drawing_utils
mp_pose = mp.solutions.pose

# Angle calculation function
def calculate_angle(a, b, c):
    a, b, c = np.array(a), np.array(b), np.array(c)
    radians = np.arctan2(c[1] - b[1], c[0] - b[0]) - np.arctan2(a[1] - b[1], a[0] - b[0])
    angle = np.abs(radians * 180.0 / np.pi)
    return 360 - angle if angle > 180.0 else angle

# Tadasana pose checking function
def check_tadasana_pose(landmarks):
    # Left and right arms
    l_sh = [landmarks[mp_pose.PoseLandmark.LEFT_SHOULDER.value].x,
            landmarks[mp_pose.PoseLandmark.LEFT_SHOULDER.value].y]
    l_el = [landmarks[mp_pose.PoseLandmark.LEFT_ELBOW.value].x,
            landmarks[mp_pose.PoseLandmark.LEFT_ELBOW.value].y]
    l_wr = [landmarks[mp_pose.PoseLandmark.LEFT_WRIST.value].x,
            landmarks[mp_pose.PoseLandmark.LEFT_WRIST.value].y]

    r_sh = [landmarks[mp_pose.PoseLandmark.RIGHT_SHOULDER.value].x,
            landmarks[mp_pose.PoseLandmark.RIGHT_SHOULDER.value].y]
    r_el = [landmarks[mp_pose.PoseLandmark.RIGHT_ELBOW.value].x,
            landmarks[mp_pose.PoseLandmark.RIGHT_ELBOW.value].y]
    r_wr = [landmarks[mp_pose.PoseLandmark.RIGHT_WRIST.value].x,
            landmarks[mp_pose.PoseLandmark.RIGHT_WRIST.value].y]

    # Arm angles
    left_arm_angle = calculate_angle(l_sh, l_el, l_wr)
    right_arm_angle = calculate_angle(r_sh, r_el, r_wr)
    arms_straight = 150 <= left_arm_angle <= 180 and 150 <= right_arm_angle <= 180

    # Foot keypoints
    l_ank = [landmarks[mp_pose.PoseLandmark.LEFT_ANKLE.value].x,
             landmarks[mp_pose.PoseLandmark.LEFT_ANKLE.value].y]
    l_heel = [landmarks[mp_pose.PoseLandmark.LEFT_HEEL.value].x,
              landmarks[mp_pose.PoseLandmark.LEFT_HEEL.value].y]
    l_toe = [landmarks[mp_pose.PoseLandmark.LEFT_FOOT_INDEX.value].x,
             landmarks[mp_pose.PoseLandmark.LEFT_FOOT_INDEX.value].y]

    r_ank = [landmarks[mp_pose.PoseLandmark.RIGHT_ANKLE.value].x,
             landmarks[mp_pose.PoseLandmark.RIGHT_ANKLE.value].y]
    r_heel = [landmarks[mp_pose.PoseLandmark.RIGHT_HEEL.value].x,
              landmarks[mp_pose.PoseLandmark.RIGHT_HEEL.value].y]
    r_toe = [landmarks[mp_pose.PoseLandmark.RIGHT_FOOT_INDEX.value].x,
             landmarks[mp_pose.PoseLandmark.RIGHT_FOOT_INDEX.value].y]

    # Toe lift angles
    left_toe_angle = calculate_angle(l_ank, l_heel, l_toe)
    right_toe_angle = calculate_angle(r_ank, r_heel, r_toe)

    # Toes must be lifted (angle > threshold)
    toe_lift_ok = left_toe_angle > 30 and right_toe_angle > 30

    return arms_straight and toe_lift_ok

# Initialize video
cap = cv2.VideoCapture(r"C:\Users\harsh\OneDrive\Desktop\Self-Care-Chatbot\Data\pushup_data\tadasana.webm")

# Tracking variables
reps = 0
pose_held = False
start_time = None
min_pose_duration = 5  # seconds

# Pose detection
with mp_pose.Pose(min_detection_confidence=0.5, min_tracking_confidence=0.5) as pose:
    while cap.isOpened():
        ret, frame = cap.read()
        if not ret:
            break

        frame = cv2.flip(frame, 1)
        image = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        image.flags.writeable = False

        results = pose.process(image)
        image.flags.writeable = True
        image = cv2.cvtColor(image, cv2.COLOR_RGB2BGR)

        try:
            landmarks = results.pose_landmarks.landmark
            is_tadasana = check_tadasana_pose(landmarks)

            if is_tadasana:
                if not pose_held:
                    start_time = time.time()
                    pose_held = True
                elif time.time() - start_time >= min_pose_duration:
                    reps += 1
                    print(f"✅ Tadasana held for {min_pose_duration} seconds | Reps: {reps}")
                    pose_held = False  # Reset for next rep
            else:
                pose_held = False
                start_time = None

            mp_drawing.draw_landmarks(image, results.pose_landmarks, mp_pose.POSE_CONNECTIONS)

        except Exception as e:
            print("Pose detection error:", e)

        # Overlay rep count
        cv2.putText(image, f"Tadasana Reps: {reps}", (20, 40),
                    cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 0), 2)

        image = cv2.resize(image, (640, 480))
        cv2.imshow('Yoga Pose: Tadasana', image)

        if cv2.waitKey(10) & 0xFF == ord('q'):
            break

cap.release()
cv2.destroyAllWindows()
