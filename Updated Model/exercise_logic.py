import math

def calculate_angle(a, b, c):
    a = [a.x, a.y]
    b = [b.x, b.y]
    c = [c.x, c.y]

    radians = math.atan2(c[1]-b[1], c[0]-b[0]) - math.atan2(a[1]-b[1], a[0]-b[0])
    angle = abs(radians * 180.0 / math.pi)
    if angle > 180.0:
        angle = 360 - angle
    return angle

def Pushup(landmarks, stage, counter):
    shoulder = landmarks[12]
    elbow = landmarks[14]
    wrist = landmarks[16]

    angle = calculate_angle(shoulder, elbow, wrist)

    if angle > 160:
        stage = "down"
    if angle < 90 and stage == "down":
        stage = "up"
        counter += 1

    return stage, counter, angle

def Squats(landmarks, stage, counter):
    hip = landmarks[24]
    knee = landmarks[26]
    ankle = landmarks[28]

    angle = calculate_angle(hip, knee, ankle)

    if angle > 160:
        stage = "up"
    if angle < 90 and stage == "up":
        stage = "down"
        counter += 1

    return stage, counter, angle

def Deadlift(landmarks, stage, counter):
    shoulder = landmarks[12]
    hip = landmarks[24]
    knee = landmarks[26]

    angle = calculate_angle(shoulder, hip, knee)

    if angle > 160:
        stage = "up"
    if angle < 90 and stage == "up":
        stage = "down"
        counter += 1

    return stage, counter, angle

def Crunches(landmarks, stage, counter):
    shoulder = landmarks[12]
    hip = landmarks[24]
    knee = landmarks[26]

    angle = calculate_angle(shoulder, hip, knee)

    if angle > 140:
        stage = "down"
    if angle < 90 and stage == "down":
        stage = "up"
        counter += 1

    return stage, counter, angle

def GluteBridge(landmarks, stage, counter):
    knee = landmarks[26]
    hip = landmarks[24]
    shoulder = landmarks[12]

    angle = calculate_angle(knee, hip, shoulder)

    if angle > 160:
        stage = "down"
    if angle < 140 and stage == "down":
        stage = "up"
        counter += 1

    return stage, counter, angle

def LyingLegRaise(landmarks, stage, counter):
    hip = landmarks[24]
    knee = landmarks[26]
    ankle = landmarks[28]

    angle = calculate_angle(hip, knee, ankle)

    if angle > 160:
        stage = "down"
    if angle < 90 and stage == "down":
        stage = "up"
        counter += 1

    return stage, counter, angle

def ChestPress(landmarks, stage, counter):
    shoulder = landmarks[12]
    elbow = landmarks[14]
    wrist = landmarks[16]

    angle = calculate_angle(shoulder, elbow, wrist)

    if angle > 160:
        stage = "down"
    if angle < 90 and stage == "down":
        stage = "up"
        counter += 1

    return stage
