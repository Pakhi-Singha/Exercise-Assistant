import cv2
import mediapipe as mp
import math
import time  # Required for PlankHold timer

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

    angle_r = calculate_angle(r_hip, r_knee, r_ankle)
    angle_l = calculate_angle(l_hip, l_knee, l_ankle)
    avg_angle = (angle_r + angle_l) / 2

    avg_hip_y = (l_hip.y + r_hip.y) / 2

    down_angle_thresh = 90
    up_angle_thresh = 160

    down_hip_y_thresh = 0.55
    up_hip_y_thresh = 0.50

    if stage is None:
        if view == "frontal":
            if avg_hip_y < up_hip_y_thresh:
                stage = "up"
            elif avg_hip_y > down_hip_y_thresh:
                stage = "down"
        else:
            if avg_angle > up_angle_thresh:
                stage = "up"
            elif avg_angle < down_angle_thresh:
                stage = "down"

    if view == "frontal":
        if stage == "down" and avg_hip_y < up_hip_y_thresh:
            stage = "up"
        elif stage == "up" and avg_hip_y > down_hip_y_thresh:
            stage = "down"
            rep_count += 1
            print(f"Squat rep count: {rep_count}")
    else:
        if stage == "down" and avg_angle > up_angle_thresh:
            stage = "up"
        elif stage == "up" and avg_angle < down_angle_thresh:
            stage = "down"
            rep_count += 1
            print(f"Squat rep count: {rep_count}")

    print(f"Hip Y: {avg_hip_y:.2f}, Avg Angle: {avg_angle:.2f}, Stage: {stage}")
    return stage, rep_count, avg_angle

def Deadlift(landmarks, stage, rep_count, view="side"):
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

    down_knee_thresh = 120
    up_knee_thresh = 160
    down_back_thresh = 110
    up_back_thresh = 160

    if stage is None:
        if avg_knee_angle > up_knee_thresh and avg_back_angle > up_back_thresh:
            stage = "up"
        elif avg_knee_angle < down_knee_thresh and avg_back_angle < down_back_thresh:
            stage = "down"

    if stage == "down" and avg_knee_angle > up_knee_thresh and avg_back_angle > up_back_thresh:
        stage = "up"
        rep_count += 1
        print(f"Deadlift rep count: {rep_count}")
    elif stage == "up" and avg_knee_angle < down_knee_thresh and avg_back_angle < down_back_thresh:
        stage = "down"

    print(f"Knee Angle: {avg_knee_angle:.2f}, Back Angle: {avg_back_angle:.2f}, Stage: {stage}")
    return stage, rep_count, avg_knee_angle, avg_back_angle

def GluteBridge(landmarks, stage, rep_count):
    def visible(landmark):
        return landmark.visibility if hasattr(landmark, 'visibility') else 1.0

    lh = landmarks[mp_pose.PoseLandmark.LEFT_HIP.value]
    lk = landmarks[mp_pose.PoseLandmark.LEFT_KNEE.value]
    ls = landmarks[mp_pose.PoseLandmark.LEFT_SHOULDER.value]

    min_vis = 0.6
    if visible(lh) < min_vis or visible(lk) < min_vis or visible(ls) < min_vis:
        return stage, rep_count, 0

    hip_angle = calculate_angle(ls, lh, lk)

    up_thresh = 170
    down_thresh = 130

    if stage is None:
        if hip_angle < up_thresh:
            stage = "down"
        elif hip_angle > down_thresh:
            stage = "up"

    if stage == "down" and hip_angle < down_thresh:
        stage = "up"
    elif stage == "up" and hip_angle > up_thresh:
        stage = "down"
        rep_count += 1
        print(f"Glute Bridge rep count: {rep_count}")

    return stage, rep_count, hip_angle

def LyingLegRaise(landmarks, stage, rep_count):
    def visible(landmark):
        return landmark.visibility if hasattr(landmark, 'visibility') else 1.0

    ls = landmarks[mp_pose.PoseLandmark.LEFT_SHOULDER.value]
    lh = landmarks[mp_pose.PoseLandmark.LEFT_HIP.value]
    la = landmarks[mp_pose.PoseLandmark.LEFT_ANKLE.value]

    min_vis = 0.6
    if visible(ls) < min_vis or visible(lh) < min_vis or visible(la) < min_vis:
        return stage, rep_count, 0

    hip_angle = calculate_angle(ls, lh, la)
    print(f"Lying Leg Raise Hip Angle: {hip_angle:.2f}, Stage: {stage}, Reps: {rep_count}")

    down_thresh = 160
    up_thresh = 100

    if stage is None:
        if hip_angle < up_thresh:
            stage = "up"
        elif hip_angle > down_thresh:
            stage = "down"

    if stage == "down" and hip_angle < up_thresh:
        stage = "up"
        rep_count += 1
        print(f"Lying Leg Raise rep counted! Total: {rep_count}")
    elif stage == "up" and hip_angle > down_thresh:
        stage = "down"

    return stage, rep_count, hip_angle

def ChestPress(landmarks, stage, rep_count):
    def visible(landmark):
        return landmark.visibility if hasattr(landmark, 'visibility') else 1.0

    r_shoulder = landmarks[mp_pose.PoseLandmark.RIGHT_SHOULDER.value]
    r_elbow = landmarks[mp_pose.PoseLandmark.RIGHT_ELBOW.value]
    r_wrist = landmarks[mp_pose.PoseLandmark.RIGHT_WRIST.value]

    min_vis = 0.6
    if visible(r_shoulder) < min_vis or visible(r_elbow) < min_vis or visible(r_wrist) < min_vis:
        return stage, rep_count, 0

    elbow_angle = calculate_angle(r_shoulder, r_elbow, r_wrist)
    print(f"Chest Press Elbow Angle: {elbow_angle:.2f}, Stage: {stage}, Reps: {rep_count}")

    down_thresh = 90
    up_thresh = 160

    if stage is None:
        if elbow_angle > up_thresh:
            stage = "up"
        elif elbow_angle < down_thresh:
            stage = "down"

    if stage == "down" and elbow_angle > up_thresh:
        stage = "up"
        rep_count += 1
        print(f"Chest Press rep counted! Total: {rep_count}")
    elif stage == "up" and elbow_angle < down_thresh:
        stage = "down"

    return stage, rep_count, elbow_angle

def BicepCurl(landmarks, stage, rep_count):
    def visible(landmark):
        return landmark.visibility if hasattr(landmark, 'visibility') else 1.0

    r_shoulder = landmarks[mp_pose.PoseLandmark.RIGHT_SHOULDER.value]
    r_elbow = landmarks[mp_pose.PoseLandmark.RIGHT_ELBOW.value]
    r_wrist = landmarks[mp_pose.PoseLandmark.RIGHT_WRIST.value]

    min_vis = 0.6
    if min(visible(r_shoulder), visible(r_elbow), visible(r_wrist)) < min_vis:
        return stage, rep_count, 0

    angle = calculate_angle(r_shoulder, r_elbow, r_wrist)
    print(f"Bicep Curl Angle: {angle:.2f}, Stage: {stage}, Reps: {rep_count}")

    down_thresh = 160
    up_thresh = 50

    if stage is None:
        if angle > down_thresh:
            stage = "down"
        elif angle < up_thresh:
            stage = "up"

    if stage == "down" and angle < up_thresh:
        stage = "up"
        rep_count += 1
        print(f"Bicep Curl rep counted! Total: {rep_count}")
    elif stage == "up" and angle > down_thresh:
        stage = "down"

    return stage, rep_count, angle

def Row(landmarks, stage, rep_count):
    def visible(landmark):
        return landmark.visibility if hasattr(landmark, 'visibility') else 1.0

    ls = landmarks[mp_pose.PoseLandmark.LEFT_SHOULDER.value]
    le = landmarks[mp_pose.PoseLandmark.LEFT_ELBOW.value]
    lw = landmarks[mp_pose.PoseLandmark.LEFT_WRIST.value]

    elbow_angle = calculate_angle(ls, le, lw)

    print(f"Row Elbow Angle: {elbow_angle:.2f}, Stage: {stage}, Reps: {rep_count}")

    if min(visible(ls), visible(le), visible(lw)) < 0.6:
        return stage, rep_count, elbow_angle

    if elbow_angle > 120:
        stage = "down"
    if elbow_angle < 70 and stage == "down":
        stage = "up"
        rep_count += 1
        print(f"Row rep counted! Total: {rep_count}")

    return stage, rep_count, elbow_angle

def Crunch(landmarks, stage, rep_count):
    def visible(landmark):
        return landmark.visibility if hasattr(landmark, 'visibility') else 1.0

    lh = landmarks[mp_pose.PoseLandmark.LEFT_HIP.value]
    ls = landmarks[mp_pose.PoseLandmark.LEFT_SHOULDER.value]
    le = landmarks[mp_pose.PoseLandmark.LEFT_EAR.value]

    crunch_angle = calculate_angle(lh, ls, le)

    print(f"Crunch Angle: {crunch_angle:.2f}, Stage: {stage}, Reps: {rep_count}")

    if min(visible(lh), visible(ls), visible(le)) < 0.6:
        return stage, rep_count, crunch_angle

    if crunch_angle > 122:
        stage = "down"
    if crunch_angle < 110 and stage == "down":
        stage = "up"
        rep_count += 1
        print(f"Crunch rep counted! Total: {rep_count}")

    return stage, rep_count, crunch_angle

# ----------------------------- Shoulder Shrug -----------------------------
def ShoulderShrug(landmarks, stage, rep_count):
    ls = landmarks[mp_pose.PoseLandmark.LEFT_SHOULDER.value]
    rs = landmarks[mp_pose.PoseLandmark.RIGHT_SHOULDER.value]
    le = landmarks[mp_pose.PoseLandmark.LEFT_EAR.value]
    re = landmarks[mp_pose.PoseLandmark.RIGHT_EAR.value]

    avg_shoulder_y = (ls.y + rs.y) / 2
    avg_ear_y = (le.y + re.y) / 2

    diff = avg_shoulder_y - avg_ear_y

    up_thresh = 0.05
    down_thresh = 0.12

    if stage is None:
        if diff > down_thresh:
            stage = "down"
        elif diff < up_thresh:
            stage = "up"

    if stage == "down" and diff < up_thresh:
        stage = "up"
        rep_count += 1
        print(f"Shoulder Shrug rep count: {rep_count}")
    elif stage == "up" and diff > down_thresh:
        stage = "down"

    return stage, rep_count, diff

# ----------------------------- Plank Hold (Timer-based) -----------------------------
def PlankHold(landmarks, hold_start_time, holding):
    ls = landmarks[mp_pose.PoseLandmark.LEFT_SHOULDER.value]
    lh = landmarks[mp_pose.PoseLandmark.LEFT_HIP.value]
    la = landmarks[mp_pose.PoseLandmark.LEFT_ANKLE.value]

    hip_angle = calculate_angle(ls, lh, la)

    plank_angle_thresh = 160

    if hip_angle > plank_angle_thresh:
        if not holding:
            hold_start_time = time.time()
            holding = True
        hold_duration = int(time.time() - hold_start_time)
    else:
        hold_start_time = None
        hold_duration = 0
        holding = False

    print(f"Plank Hold duration: {hold_duration} sec")
    return hold_start_time, holding, hold_duration

# ----------------------------- Lateral Raise -----------------------------
def LateralRaise(landmarks, stage, rep_count):
    ls = landmarks[mp_pose.PoseLandmark.LEFT_SHOULDER.value]
    le = landmarks[mp_pose.PoseLandmark.LEFT_ELBOW.value]
    lw = landmarks[mp_pose.PoseLandmark.LEFT_WRIST.value]

    angle_l = calculate_angle(ls, le, lw)

    up_thresh = 80
    down_thresh = 30

    if stage is None:
        if angle_l < down_thresh:
            stage = "down"
        elif angle_l > up_thresh:
            stage = "up"

    if stage == "down" and angle_l > up_thresh:
        stage = "up"
        rep_count += 1
        print(f"Lateral Raise rep count: {rep_count}")
    elif stage == "up" and angle_l < down_thresh:
        stage = "down"

    return stage, rep_count, angle_l

# ----------------------------- Lunges -----------------------------
def Lunges(landmarks, stage, rep_count):
    lh = landmarks[mp_pose.PoseLandmark.LEFT_HIP.value]
    lk = landmarks[mp_pose.PoseLandmark.LEFT_KNEE.value]
    la = landmarks[mp_pose.PoseLandmark.LEFT_ANKLE.value]

    hip_angle = calculate_angle(lh, lk, la)

    down_thresh = 100
    up_thresh = 160

    if stage is None:
        if hip_angle > up_thresh:
            stage = "up"
        elif hip_angle < down_thresh:
            stage = "down"

    if stage == "down" and hip_angle > up_thresh:
        stage = "up"
        rep_count += 1
        print(f"Lunges rep count: {rep_count}")
    elif stage == "up" and hip_angle < down_thresh:
        stage = "down"

    return stage, rep_count, hip_angle

# ----------------------------- Jumping Jacks -----------------------------
def JumpingJacks(landmarks, stage, rep_count):
    la = landmarks[mp_pose.PoseLandmark.LEFT_ANKLE.value]
    ra = landmarks[mp_pose.PoseLandmark.RIGHT_ANKLE.value]
    lw = landmarks[mp_pose.PoseLandmark.LEFT_WRIST.value]
    rw = landmarks[mp_pose.PoseLandmark.RIGHT_WRIST.value]

    foot_distance = abs(la.x - ra.x)
    hand_y = (lw.y + rw.y) / 2

    open_thresh = 0.4
    hand_up_thresh = 0.4

    if stage is None:
        if foot_distance < 0.2 and hand_y > 0.6:
            stage = "closed"
        elif foot_distance > open_thresh and hand_y < hand_up_thresh:
            stage = "open"

    if stage == "closed" and foot_distance > open_thresh and hand_y < hand_up_thresh:
        stage = "open"
        rep_count += 1
        print(f"Jumping Jack rep count: {rep_count}")
    elif stage == "open" and foot_distance < 0.2 and hand_y > 0.6:
        stage = "closed"

    return stage, rep_count, foot_distance, hand_y

# ----------------------------- Main Code -----------------------------
mp_drawing = mp.solutions.drawing_utils
mp_pose = mp.solutions.pose

# Load video file
cap = cv2.VideoCapture(r"C:\Users\harsh\OneDrive\Desktop\Self-Care-Chatbot\Data\test_data\crunch_data\crunch_1.webm")

rep_count = 0
stage = None
exercise_mode = "crunch"
hold_start_time = None
holding = False

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
            elif exercise_mode == "Deadlift":
                stage, rep_count, avg_knee_angle, avg_back_angle = Deadlift(landmarks, stage, rep_count)
                cv2.putText(frame, f'Deadlift Angle: {int(avg_knee_angle)}', (30, 150),
                            cv2.FONT_HERSHEY_SIMPLEX, 1.2, (0, 255, 255), 2)
            elif exercise_mode == "Glute Bridge":
                stage, rep_count, hip_angle = GluteBridge(landmarks, stage, rep_count)
                cv2.putText(frame, f'Hip Angle: {int(hip_angle)}', (30, 150),
                            cv2.FONT_HERSHEY_SIMPLEX, 1.2, (0, 255, 180), 2)
            elif exercise_mode == "LyingLegRaise":
                stage, rep_count, hip_angle = LyingLegRaise(landmarks, stage, rep_count)
                cv2.putText(frame, f'Lying Leg Raise Angle: {int(hip_angle)}', (30, 150),
                            cv2.FONT_HERSHEY_SIMPLEX, 1.2, (0, 255, 255), 2)
            elif exercise_mode == "ChestPress":
                stage, rep_count, elbow_angle = ChestPress(landmarks, stage, rep_count)
                cv2.putText(frame, f'Chest Press Angle: {int(elbow_angle)}', (30, 150),
                            cv2.FONT_HERSHEY_SIMPLEX, 1.2, (0, 255, 255), 2)
            elif exercise_mode == "BicepCurl":
                stage, rep_count, curl_angle = BicepCurl(landmarks, stage, rep_count)
                cv2.putText(frame, f'Bicep Curl Angle: {int(curl_angle)}', (30, 150),
                            cv2.FONT_HERSHEY_SIMPLEX, 1.2, (0, 255, 255), 2)
            elif exercise_mode == "Rows":
                stage, rep_count, elbow_angle = Row(landmarks, stage, rep_count)
                cv2.putText(frame, f'Row Angle: {int(elbow_angle)}', (30, 150),
                            cv2.FONT_HERSHEY_SIMPLEX, 1.2, (255, 255, 0), 2)
            elif exercise_mode == "crunch":
                stage, rep_count, avg_angle = Crunch(landmarks, stage, rep_count)
                cv2.putText(frame, f'Crunch Angle: {int(avg_angle)}', (30, 150),
                            cv2.FONT_HERSHEY_SIMPLEX, 1.2, (0, 255, 255), 2)
            elif exercise_mode == "ShoulderShrug":
                stage, rep_count, diff = ShoulderShrug(landmarks, stage, rep_count)
                cv2.putText(frame, f'Shoulder Shrug Diff: {diff:.2f}', (30, 150),
                            cv2.FONT_HERSHEY_SIMPLEX, 1.2, (0, 255, 255), 2)
            elif exercise_mode == "PlankHold":
                hold_start_time, holding, hold_duration = PlankHold(landmarks, hold_start_time, holding)
                cv2.putText(frame, f'Plank Hold Duration: {hold_duration} sec', (30, 150),
                            cv2.FONT_HERSHEY_SIMPLEX, 1.2, (0, 255, 255), 2)
            elif exercise_mode == "LateralRaise":
                stage, rep_count, angle_l = LateralRaise(landmarks, stage, rep_count)
                cv2.putText(frame, f'Lateral Raise Angle: {int(angle_l)}', (30, 150),
                            cv2.FONT_HERSHEY_SIMPLEX, 1.2, (0, 255, 255), 2)
            elif exercise_mode == "Lunges":
                stage, rep_count, hip_angle = Lunges(landmarks, stage, rep_count)
                cv2.putText(frame, f'Lunges Angle: {int(hip_angle)}', (30, 150),
                            cv2.FONT_HERSHEY_SIMPLEX, 1.2, (0, 255, 255), 2)
            elif exercise_mode == "JumpingJacks":
                stage, rep_count, foot_distance, hand_y = JumpingJacks(landmarks, stage, rep_count)
                cv2.putText(frame, f'Jumping Jacks Foot Distance: {foot_distance:.2f}', (30, 150),
                            cv2.FONT_HERSHEY_SIMPLEX, 1.2, (0, 255, 255), 2)

            mp_drawing.draw_landmarks(frame, results.pose_landmarks, mp_pose.POSE_CONNECTIONS)

        cv2.putText(frame, f"Reps: {rep_count}", (30, 50),
                    cv2.FONT_HERSHEY_SIMPLEX, 1.5, (0, 255, 0), 2)
        cv2.putText(frame, f"Stage: {stage}", (30, 100),
                    cv2.FONT_HERSHEY_SIMPLEX, 1.5, (255, 255, 0), 2)

        frame = cv2.resize(frame, (640, 480))
        cv2.imshow("Exercise Counter", frame)

        if cv2.waitKey(10) & 0xFF == 27:
            break

cap.release()
cv2.destroyAllWindows()
