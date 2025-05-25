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

def BicepCurl(landmarks, stage, rep_count, side):
    # Helper function to check visibility
    def visible(landmark):
        return landmark.visibility if hasattr(landmark, 'visibility') else 1.0

    # Thresholds
    curl_down_thresh = 160  # Arm extended
    curl_up_thresh = 50     # Arm fully curled

    def process_arm(shoulder, elbow, wrist, arm_stage, arm_count):
        if min(visible(shoulder), visible(elbow), visible(wrist)) < 0.5:
            return arm_stage, arm_count, 0

        elbow_angle = calculate_angle(shoulder, elbow, wrist)

        if arm_stage is None:
            if elbow_angle > curl_down_thresh:
                arm_stage = "down"
            elif elbow_angle < curl_up_thresh:
                arm_stage = "up"

        if arm_stage == "down" and elbow_angle < curl_up_thresh:
            arm_stage = "up"
            arm_count += 1
            print(f"Bicep Curl rep count: {arm_count}")

        elif arm_stage == "up" and elbow_angle > curl_down_thresh:
            arm_stage = "down"

        return arm_stage, arm_count, elbow_angle

    # Handle both arms
    if side.lower() == "both":
        # stage and rep_count are expected as dictionaries: {"left": ..., "right": ...}
        l_shoulder = landmarks[mp_pose.PoseLandmark.LEFT_SHOULDER.value]
        l_elbow = landmarks[mp_pose.PoseLandmark.LEFT_ELBOW.value]
        l_wrist = landmarks[mp_pose.PoseLandmark.LEFT_WRIST.value]

        r_shoulder = landmarks[mp_pose.PoseLandmark.RIGHT_SHOULDER.value]
        r_elbow = landmarks[mp_pose.PoseLandmark.RIGHT_ELBOW.value]
        r_wrist = landmarks[mp_pose.PoseLandmark.RIGHT_WRIST.value]

        stage['left'], rep_count['left'], l_angle = process_arm(l_shoulder, l_elbow, l_wrist, stage.get('left'), rep_count.get('left'))
        stage['right'], rep_count['right'], r_angle = process_arm(r_shoulder, r_elbow, r_wrist, stage.get('right'), rep_count.get('right'))

        print(f"Left Angle: {l_angle:.2f}, Right Angle: {r_angle:.2f}")
        return stage, rep_count, l_angle, r_angle

    # Handle single arm
    elif side.lower() in ["left", "right"]:
        if side.lower() == "left":
            shoulder = landmarks[mp_pose.PoseLandmark.LEFT_SHOULDER.value]
            elbow = landmarks[mp_pose.PoseLandmark.LEFT_ELBOW.value]
            wrist = landmarks[mp_pose.PoseLandmark.LEFT_WRIST.value]
        else:
            shoulder = landmarks[mp_pose.PoseLandmark.RIGHT_SHOULDER.value]
            elbow = landmarks[mp_pose.PoseLandmark.RIGHT_ELBOW.value]
            wrist = landmarks[mp_pose.PoseLandmark.RIGHT_WRIST.value]

        stage, rep_count, angle = process_arm(shoulder, elbow, wrist, stage, rep_count)
        return stage, rep_count, angle
    
def GluteBridge(landmarks, stage, rep_count, view="side"):
    # Helper function to check visibility
    def visible(landmark):
        return landmark.visibility if hasattr(landmark, 'visibility') else 1.0

    # Extract key landmarks
    l_shoulder = landmarks[mp_pose.PoseLandmark.LEFT_SHOULDER.value]
    l_hip = landmarks[mp_pose.PoseLandmark.LEFT_HIP.value]
    l_knee = landmarks[mp_pose.PoseLandmark.LEFT_KNEE.value]

    r_shoulder = landmarks[mp_pose.PoseLandmark.RIGHT_SHOULDER.value]
    r_hip = landmarks[mp_pose.PoseLandmark.RIGHT_HIP.value]
    r_knee = landmarks[mp_pose.PoseLandmark.RIGHT_KNEE.value]

    # Check visibility
    if min(
        visible(l_shoulder), visible(l_hip), visible(l_knee),
        visible(r_shoulder), visible(r_hip), visible(r_knee)
    ) < 0.5:
        return stage, rep_count, 0, 0

    # Calculate hip angle (shoulder–hip–knee)
    left_hip_angle = calculate_angle(l_shoulder, l_hip, l_knee)
    right_hip_angle = calculate_angle(r_shoulder, r_hip, r_knee)
    avg_hip_angle = (left_hip_angle + right_hip_angle) / 2

    # Thresholds (adjust as needed based on test footage)
    down_thresh = 100   # Hips dropped
    up_thresh = 140     # Hips extended

    # Initial stage detection
    if stage is None:
        if avg_hip_angle > up_thresh:
            stage = "up"
        elif avg_hip_angle < down_thresh:
            stage = "down"

    # Rep counting logic
    if stage == "down" and avg_hip_angle > up_thresh:
        stage = "up"
        rep_count += 1
        print(f"Glute Bridge rep count: {rep_count}")

    elif stage == "up" and avg_hip_angle < down_thresh:
        stage = "down"

    print(f"Hip Angle: {avg_hip_angle:.2f}, Stage: {stage}")
    return stage, rep_count, avg_hip_angle, 0  # "0" is a placeholder for symmetry with others

def Crunches(landmarks, stage, rep_count):
    # Helper to check visibility
    def visible(landmark):
        return landmark.visibility if hasattr(landmark, 'visibility') else 1.0

    # Use shoulder, hip, and knee to track crunch motion
    r_shoulder = landmarks[mp_pose.PoseLandmark.RIGHT_SHOULDER.value]
    r_hip = landmarks[mp_pose.PoseLandmark.RIGHT_HIP.value]
    r_knee = landmarks[mp_pose.PoseLandmark.RIGHT_KNEE.value]

    l_shoulder = landmarks[mp_pose.PoseLandmark.LEFT_SHOULDER.value]
    l_hip = landmarks[mp_pose.PoseLandmark.LEFT_HIP.value]
    l_knee = landmarks[mp_pose.PoseLandmark.LEFT_KNEE.value]

    # Visibility check
    min_visibility = 0.5
    if min(
        visible(r_shoulder), visible(r_hip), visible(r_knee),
        visible(l_shoulder), visible(l_hip), visible(l_knee)
    ) < min_visibility:
        return stage, rep_count, 0

    # Calculate torso angle relative to hip and knee
    angle_r = calculate_angle(r_shoulder, r_hip, r_knee)
    angle_l = calculate_angle(l_shoulder, l_hip, l_knee)
    avg_crunch_angle = (angle_r + angle_l) / 2

    # Thresholds
    crunch_down_thresh = 150  # lying down (angle open)
    crunch_up_thresh = 100    # curled (angle closed)

    # Initial stage detection
    if stage is None:
        if avg_crunch_angle > crunch_down_thresh:
            stage = "down"
        elif avg_crunch_angle < crunch_up_thresh:
            stage = "up"

    # Rep counting logic
    if stage == "down" and avg_crunch_angle < crunch_up_thresh:
        stage = "up"
        rep_count += 1
        print(f"Crunch rep count: {rep_count}")

    elif stage == "up" and avg_crunch_angle > crunch_down_thresh:
        stage = "down"

    print(f"Curl Angle: {avg_crunch_angle:.2f}, Stage: {stage}")
    return stage, rep_count, avg_crunch_angle

def Rows(landmarks, stage, rep_count, side):
    # Helper to check visibility
    def visible(landmark):
        return landmark.visibility if hasattr(landmark, 'visibility') else 1.0

    if side.lower() == "right":
        shoulder = landmarks[mp_pose.PoseLandmark.RIGHT_SHOULDER.value]
        elbow = landmarks[mp_pose.PoseLandmark.RIGHT_ELBOW.value]
        wrist = landmarks[mp_pose.PoseLandmark.RIGHT_WRIST.value]
    elif side.lower() == "left":
        shoulder = landmarks[mp_pose.PoseLandmark.LEFT_SHOULDER.value]
        elbow = landmarks[mp_pose.PoseLandmark.LEFT_ELBOW.value]
        wrist = landmarks[mp_pose.PoseLandmark.LEFT_WRIST.value]
    else:
        return stage, rep_count, 0

    # Check visibility
    min_visibility = 0.5
    if min(visible(shoulder), visible(elbow), visible(wrist)) < min_visibility:
        return stage, rep_count, 0

    # Calculate elbow pulling angle
    elbow_angle = calculate_angle(shoulder, elbow, wrist)

    # Define thresholds for rowing motion
    row_extended_thresh = 160  # Arm extended
    row_pulled_thresh = 70     # Arm pulled in

    # Initial stage detection
    if stage is None:
        if elbow_angle > row_extended_thresh:
            stage = "forward"
        elif elbow_angle < row_pulled_thresh:
            stage = "pulled"

    # Rep counting logic
    if stage == "forward" and elbow_angle < row_pulled_thresh:
        stage = "pulled"
        rep_count += 1
        print(f"Row rep count: {rep_count}")

    elif stage == "pulled" and elbow_angle > row_extended_thresh:
        stage = "forward"

    print(f"Row Arm Angle: {elbow_angle:.2f}, Stage: {stage}")
    return stage, rep_count, elbow_angle

def ChestPress(landmarks, stage, rep_count, side):
    # Helper for visibility
    def visible(landmark):
        return landmark.visibility if hasattr(landmark, 'visibility') else 1.0

    if side.lower() == "right":
        shoulder = landmarks[mp_pose.PoseLandmark.RIGHT_SHOULDER.value]
        elbow = landmarks[mp_pose.PoseLandmark.RIGHT_ELBOW.value]
        wrist = landmarks[mp_pose.PoseLandmark.RIGHT_WRIST.value]
    elif side.lower() == "left":
        shoulder = landmarks[mp_pose.PoseLandmark.LEFT_SHOULDER.value]
        elbow = landmarks[mp_pose.PoseLandmark.LEFT_ELBOW.value]
        wrist = landmarks[mp_pose.PoseLandmark.LEFT_WRIST.value]
    else:
        return stage, rep_count, 0

    # Visibility check
    min_visibility = 0.5
    if min(visible(shoulder), visible(elbow), visible(wrist)) < min_visibility:
        return stage, rep_count, 0

    # Elbow angle represents push vs lowered arms
    elbow_angle = calculate_angle(shoulder, elbow, wrist)

    # Thresholds
    press_down_thresh = 90     # arms lowered
    press_up_thresh = 160      # arms extended

    # Initial stage
    if stage is None:
        if elbow_angle < press_down_thresh:
            stage = "down"
        elif elbow_angle > press_up_thresh:
            stage = "up"

    # Rep logic
    if stage == "down" and elbow_angle > press_up_thresh:
        stage = "up"
        rep_count += 1
        print(f"Chest Press rep count: {rep_count}")
    elif stage == "up" and elbow_angle < press_down_thresh:
        stage = "down"

    print(f"Chest Press Arm Angle: {elbow_angle:.2f}, Stage: {stage}")
    return stage, rep_count, elbow_angle

def LegRaises(landmarks, stage, rep_count):
    # Helper for visibility
    def visible(landmark):
        return landmark.visibility if hasattr(landmark, 'visibility') else 1.0

    # Get relevant landmarks for both legs
    left_hip = landmarks[mp_pose.PoseLandmark.LEFT_HIP.value]
    left_knee = landmarks[mp_pose.PoseLandmark.LEFT_KNEE.value]
    left_ankle = landmarks[mp_pose.PoseLandmark.LEFT_ANKLE.value]

    right_hip = landmarks[mp_pose.PoseLandmark.RIGHT_HIP.value]
    right_knee = landmarks[mp_pose.PoseLandmark.RIGHT_KNEE.value]
    right_ankle = landmarks[mp_pose.PoseLandmark.RIGHT_ANKLE.value]

    # Visibility check
    min_visibility = 0.5
    if min(visible(left_hip), visible(left_knee), visible(left_ankle),
           visible(right_hip), visible(right_knee), visible(right_ankle)) < min_visibility:
        return stage, rep_count, 0

    # Calculate hip angles for both legs
    left_leg_angle = calculate_angle(left_shoulder:=landmarks[mp_pose.PoseLandmark.LEFT_SHOULDER.value],
                                     left_hip, left_knee)
    right_leg_angle = calculate_angle(right_shoulder:=landmarks[mp_pose.PoseLandmark.RIGHT_SHOULDER.value],
                                      right_hip, right_knee)
    
    avg_leg_angle = (left_leg_angle + right_leg_angle) / 2

    # Thresholds: low (legs near ground), high (legs vertical)
    down_thresh = 100
    up_thresh = 160

    # Initial stage detection
    if stage is None:
        if avg_leg_angle < down_thresh:
            stage = "down"
        elif avg_leg_angle > up_thresh:
            stage = "up"

    # Rep counting logic
    if stage == "down" and avg_leg_angle > up_thresh:
        stage = "up"
        rep_count += 1
        print(f"Leg Raise rep count: {rep_count}")
    elif stage == "up" and avg_leg_angle < down_thresh:
        stage = "down"

    print(f"Leg Raise Angle: {avg_leg_angle:.2f}, Stage: {stage}")
    return stage, rep_count, avg_leg_angle

# ----------------------------- Main Code -----------------------------
mp_drawing = mp.solutions.drawing_utils
mp_pose = mp.solutions.pose

# Load video file
cap = cv2.VideoCapture(r"C:\Users\harsh\OneDrive\Desktop\Self-Care-Chatbot\Data\pushup_data\allex\deadlift.webm")

rep_count = 0
stage = None
exercise_mode = "Deadlift"

#Bicep Curl input and initialisation
if(exercise_mode=='BicepCurl'):
    side=input('Enter side:') 
stage = {"left": None, "right": None}
rep_count = {"left": 0, "right": 0} 

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
            elif exercise_mode == "Bicep Curl":
                stage, rep_count, left_angle, right_angle = BicepCurl(landmarks, stage, rep_count, side="both")
                cv2.putText(frame, f'Left Elbow: {int(left_angle)}', (30, 150),
                            cv2.FONT_HERSHEY_SIMPLEX, 1.0, (255, 0, 255), 2)
                cv2.putText(frame, f'Right Elbow: {int(right_angle)}', (30, 190),
                            cv2.FONT_HERSHEY_SIMPLEX, 1.0, (255, 0, 255), 2)
            elif exercise_mode == "Glute Bridge":
                stage, rep_count, hip_angle, _ = GluteBridge(landmarks, stage, rep_count)
                cv2.putText(frame, f'Hip Angle: {int(hip_angle)}', (30, 150),
                            cv2.FONT_HERSHEY_SIMPLEX, 1.2, (0, 255, 180), 2)
            elif exercise_mode == "Crunches":
                stage, rep_count, avg_crunch_angle = Crunches(landmarks, stage, rep_count)
                cv2.putText(frame, f'Crunch Angle: {int(avg_crunch_angle)}', (30, 150),
                            cv2.FONT_HERSHEY_SIMPLEX, 1.2, (0, 255, 255), 2)
            elif exercise_mode == "Rows":
                stage, rep_count, elbow_angle = Rows(landmarks, stage, rep_count, side)
                cv2.putText(frame, f'Row Arm Angle: {int(elbow_angle)}', (30, 150),
                            cv2.FONT_HERSHEY_SIMPLEX, 1.2, (255, 200, 0), 2)
            elif exercise_mode == "Chest Press":
                stage, rep_count, elbow_angle = ChestPress(landmarks, stage, rep_count, side)
                cv2.putText(frame, f'Chest Press Angle: {int(elbow_angle)}', (30, 150),
                            cv2.FONT_HERSHEY_SIMPLEX, 1.2, (255, 100, 255), 2)
            elif exercise_mode == "Leg Raises":
                stage, rep_count, leg_angle = LegRaises(landmarks, stage, rep_count)
                cv2.putText(frame, f'Leg Raise Angle: {int(leg_angle)}', (30, 150),
                            cv2.FONT_HERSHEY_SIMPLEX, 1.2, (100, 255, 200), 2)

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
