import cv2
import mediapipe as mp
import math

# ----------------------------- Function to calculate angle -----------------------------
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


# ----------------------------- Exercise Logic Functions -----------------------------
def Pushup(landmarks, stage, rep_count):
    r_shoulder = landmarks[mp_pose.PoseLandmark.RIGHT_SHOULDER.value]
    r_elbow = landmarks[mp_pose.PoseLandmark.RIGHT_ELBOW.value]
    r_wrist = landmarks[mp_pose.PoseLandmark.RIGHT_WRIST.value]

    l_shoulder = landmarks[mp_pose.PoseLandmark.LEFT_SHOULDER.value]
    l_elbow = landmarks[mp_pose.PoseLandmark.LEFT_ELBOW.value]
    l_wrist = landmarks[mp_pose.PoseLandmark.LEFT_WRIST.value]

    angle_r = calculate_angle(r_shoulder, r_elbow, r_wrist)
    angle_l = calculate_angle(l_shoulder, l_elbow, l_wrist)
    avg_angle = (angle_r + angle_l) / 2

    if avg_angle > 160:
        stage = "up"
    if avg_angle < 90 and stage == "up":
        stage = "down"
        rep_count += 1
        print(f"Push-up rep count: {rep_count}")

    return stage, rep_count, avg_angle

def Squat(landmarks, stage, rep_count, view="frontal"):
    r_hip = landmarks[mp_pose.PoseLandmark.RIGHT_HIP.value]
    r_knee = landmarks[mp_pose.PoseLandmark.RIGHT_KNEE.value]
    r_ankle = landmarks[mp_pose.PoseLandmark.RIGHT_ANKLE.value]

    l_hip = landmarks[mp_pose.PoseLandmark.LEFT_HIP.value]
    l_knee = landmarks[mp_pose.PoseLandmark.LEFT_KNEE.value]
    l_ankle = landmarks[mp_pose.PoseLandmark.LEFT_ANKLE.value]

    # Calculate average knee angle
    angle_r = calculate_angle(r_hip, r_knee, r_ankle)
    angle_l = calculate_angle(l_hip, l_knee, l_ankle)
    avg_angle = (angle_r + angle_l) / 2

    # Average hip Y for frontal view
    avg_hip_y = (l_hip.y + r_hip.y) / 2

    # Thresholds - tune these based on your camera setup
    down_angle_thresh = 90
    up_angle_thresh = 160

    down_hip_y_thresh = 0.55
    up_hip_y_thresh = 0.50

    # Initialize stage if None
    if stage is None:
        if view == "frontal":
            if avg_hip_y < up_hip_y_thresh:
                stage = "up"
            elif avg_hip_y > down_hip_y_thresh:
                stage = "down"
        else:  # side view
            if avg_angle > up_angle_thresh:
                stage = "up"
            elif avg_angle < down_angle_thresh:
                stage = "down"

    # Transition logic based on view
    if view == "frontal":
        if stage == "down" and avg_hip_y < up_hip_y_thresh:
            stage = "up"
        elif stage == "up" and avg_hip_y > down_hip_y_thresh:
            stage = "down"
            rep_count += 1
            print(f"Squat rep count: {rep_count}")

    else:  # side view
        if stage == "down" and avg_angle > up_angle_thresh:
            stage = "up"
        elif stage == "up" and avg_angle < down_angle_thresh:
            stage = "down"
            rep_count += 1
            print(f"Squat rep count: {rep_count}")

    print(f"Hip Y: {avg_hip_y:.2f}, Avg Angle: {avg_angle:.2f}, Stage: {stage}")
    return stage, rep_count, avg_angle

def Deadlift(landmarks, stage, rep_count, view="side"):
    # Helper function to check visibility
    def visible(landmark):
        return landmark.visibility if hasattr(landmark, 'visibility') else 1.0

   
    r_hip = landmarks[mp_pose.PoseLandmark.RIGHT_HIP.value]
    r_knee = landmarks[mp_pose.PoseLandmark.RIGHT_KNEE.value]
    r_ankle = landmarks[mp_pose.PoseLandmark.RIGHT_ANKLE.value]

    l_hip = landmarks[mp_pose.PoseLandmark.LEFT_HIP.value]
    l_knee = landmarks[mp_pose.PoseLandmark.LEFT_KNEE.value]
    l_ankle = landmarks[mp_pose.PoseLandmark.LEFT_ANKLE.value]

    r_shoulder = landmarks[mp_pose.PoseLandmark.RIGHT_SHOULDER.value]
    l_shoulder = landmarks[mp_pose.PoseLandmark.LEFT_SHOULDER.value]

    
    min_visibility = 0.5
    if min(visible(r_hip), visible(r_knee), visible(r_ankle),
           visible(l_hip), visible(l_knee), visible(l_ankle),
           visible(r_shoulder), visible(l_shoulder)) < min_visibility:
        return stage, rep_count, 0, 0

    
    angle_r = calculate_angle(r_hip, r_knee, r_ankle)
    angle_l = calculate_angle(l_hip, l_knee, l_ankle)
    avg_knee_angle = (angle_r + angle_l) / 2

    
    back_angle_r = calculate_angle(r_shoulder, r_hip, r_ankle)
    back_angle_l = calculate_angle(l_shoulder, l_hip, l_ankle)
    avg_back_angle = (back_angle_r + back_angle_l) / 2

    
    down_knee_thresh = 120  #
    up_knee_thresh = 160
    down_back_thresh = 110  
    up_back_thresh = 160

    # Initial stage detection
    if stage is None:
        if avg_knee_angle > up_knee_thresh and avg_back_angle > up_back_thresh:
            stage = "up"
        elif avg_knee_angle < down_knee_thresh and avg_back_angle < down_back_thresh:
            stage = "down"

    # Rep counting logic
    if stage == "down" and avg_knee_angle > up_knee_thresh and avg_back_angle > up_back_thresh:
        stage = "up"
        rep_count += 1
        print(f"Deadlift rep count: {rep_count}")

    elif stage == "up" and avg_knee_angle < down_knee_thresh and avg_back_angle < down_back_thresh:
        stage = "down"

    print(f"Knee Angle: {avg_knee_angle:.2f}, Back Angle: {avg_back_angle:.2f}, Stage: {stage}")
    return stage, rep_count, avg_knee_angle, avg_back_angle




# ----------------------------- Main Code -----------------------------
mp_drawing = mp.solutions.drawing_utils
mp_pose = mp.solutions.pose

# Load video file
cap = cv2.VideoCapture(r"C:\Users\harsh\OneDrive\Desktop\Self-Care-Chatbot\Data\pushup_data\allex\deadlift.webm")

rep_count = 0
stage = None
exercise_mode = "Deadlift"  

with mp_pose.Pose(min_detection_confidence=0.5, min_tracking_confidence=0.5) as pose:
    while cap.isOpened():
        ret, frame = cap.read()
        if not ret:
            break

        frame = cv2.flip(frame, 1)
        image_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
     

        results = pose.process(image_rgb)
        frame = cv2.cvtColor(image_rgb, cv2.COLOR_RGB2BGR)

        if results.pose_landmarks:
            landmarks = results.pose_landmarks.landmark

            if exercise_mode == "pushup":
                stage, rep_count, avg_angle = Pushup(landmarks, stage, rep_count)
                cv2.putText(frame, f'Push-up Angle: {int(avg_angle)}', (30, 150),
                            cv2.FONT_HERSHEY_SIMPLEX, 1.2, (0, 255, 255), 2)

            elif exercise_mode == "squat":
                stage, rep_count, avg_angle = Squat(landmarks, stage, rep_count)
                cv2.putText(frame, f'Squat Angle: {int(avg_angle)}', (30, 150),
                            cv2.FONT_HERSHEY_SIMPLEX, 1.2, (0, 255, 255), 2)
            elif exercise_mode== "Deadlift":
                stage, rep_count, avg_knee_angle, avg_back_angle = Deadlift(landmarks, stage, rep_count)
                cv2.putText(frame, f'Deadlift Angle: {int(avg_knee_angle)}',(30, 150),
                            cv2.FONT_HERSHEY_SIMPLEX, 1.2, (0, 255, 255), 2)

            # Draw landmarks
            mp_drawing.draw_landmarks(frame, results.pose_landmarks, mp_pose.POSE_CONNECTIONS)

        # Show Reps and Stage
        cv2.putText(frame, f"Reps: {rep_count}", (30, 50),
                    cv2.FONT_HERSHEY_SIMPLEX, 1.5, (0, 255, 0), 2)
        cv2.putText(frame, f"Stage: {stage}", (30, 100),
                    cv2.FONT_HERSHEY_SIMPLEX, 1.5, (255, 255, 0), 2)

        frame = cv2.resize(frame, (640, 480))
        cv2.imshow("Exercise Counter", frame)

        # Press ESC to exit
        if cv2.waitKey(10) & 0xFF == 27:
            break

cap.release()
cv2.destroyAllWindows()
