import cv2
import mediapipe as mp
import math

# Function to calculate the exercise angle
def calculate_angle(a, b, c):
    a = [a.x, a.y]
    b = [b.x, b.y]
    c = [c.x, c.y]

    ab = [a[0] - b[0], a[1] - b[1]]
    cb = [c[0] - b[0], c[1] - b[1]]

    dot = ab[0]*cb[0] + ab[1]*cb[1]
    mag_ab = math.sqrt(ab[0]**2 + ab[1]**2)
    mag_cb = math.sqrt(cb[0]**2 + cb[1]**2)

    if mag_ab * mag_cb == 0:
        return 0

    angle = math.acos(dot / (mag_ab * mag_cb))
    return math.degrees(angle)

mp_drawing = mp.solutions.drawing_utils
mp_pose = mp.solutions.pose

# Load the video and initialise pose model
cap = cv2.VideoCapture(r"C:\Users\harsh\OneDrive\Desktop\Self-Care-Chatbot\Data\pushup_data\pushup_5.mp4")
rep_count = 0
stage = None

# Set a pose detection loop
with mp_pose.Pose(min_detection_confidence=0.5, min_tracking_confidence=0.5) as pose:
    while cap.isOpened():
        ret, frame = cap.read()
        if not ret:
            break

        frame = cv2.flip(frame, 1)
        image_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        image_rgb.flags.writeable = False

        results = pose.process(image_rgb)
        image_rgb.flags.writeable = True
        frame = cv2.cvtColor(image_rgb, cv2.COLOR_RGB2BGR)

        if results.pose_landmarks:
            landmarks = results.pose_landmarks.landmark

            # Get right arm landmarks
            r_shoulder = landmarks[mp_pose.PoseLandmark.RIGHT_SHOULDER.value]
            r_elbow = landmarks[mp_pose.PoseLandmark.RIGHT_ELBOW.value]
            r_wrist = landmarks[mp_pose.PoseLandmark.RIGHT_WRIST.value]

            # Get left arm landmarks
            l_shoulder = landmarks[mp_pose.PoseLandmark.LEFT_SHOULDER.value]
            l_elbow = landmarks[mp_pose.PoseLandmark.LEFT_ELBOW.value]
            l_wrist = landmarks[mp_pose.PoseLandmark.LEFT_WRIST.value]

            # Calculate angles for both arms
            angle_r = calculate_angle(r_shoulder, r_elbow, r_wrist)
            angle_l = calculate_angle(l_shoulder, l_elbow, l_wrist)

            # Average angle (optional)
            avg_angle = (angle_r + angle_l) / 2

            # Visualize angles on elbows
            cv2.putText(frame, f'R:{int(angle_r)}', 
                        (int(r_elbow.x * frame.shape[1]), int(r_elbow.y * frame.shape[0])),
                        cv2.FONT_HERSHEY_SIMPLEX, 0.8, (0, 255, 255), 2)

            cv2.putText(frame, f'L:{int(angle_l)}', 
                        (int(l_elbow.x * frame.shape[1]), int(l_elbow.y * frame.shape[0])),
                        cv2.FONT_HERSHEY_SIMPLEX, 0.8, (0, 255, 255), 2)

            # Push-up logic: based on average angle or both arms
            if avg_angle > 160:
                stage = "up"
            if avg_angle < 90 and stage == "up":
                stage = "down"
                rep_count += 1
                print(f"Push-up rep count: {rep_count}")

            # Draw landmarks
            mp_drawing.draw_landmarks(frame, results.pose_landmarks, mp_pose.POSE_CONNECTIONS)

        # Display info
        cv2.putText(frame, f"Reps: {rep_count}", (30, 50),
                    cv2.FONT_HERSHEY_SIMPLEX, 1.5, (0, 255, 0), 2)
        cv2.putText(frame, f"Stage: {stage}", (30, 100),
                    cv2.FONT_HERSHEY_SIMPLEX, 1.5, (255, 255, 0), 2)

        frame = cv2.resize(frame, (640, 480))
        cv2.imshow("Push-up Counter (Both Arms)", frame)

        if cv2.waitKey(10) & 0xFF == 27:  # ESC key
            break

cap.release()
cv2.destroyAllWindows()
