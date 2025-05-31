const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const exerciseSelect = document.getElementById('exercise'); // Get the dropdown

navigator.mediaDevices.getUserMedia({ video: true })
  .then(stream => {
    video.srcObject = stream;
    setInterval(captureFrame, 500);  // every 0.5s
  });

function captureFrame() {
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
  const dataUrl = canvas.toDataURL('image/jpeg');

  // Include selected exercise in the request
  fetch('/process_frame', {
    method: 'POST',
    body: JSON.stringify({
      image: dataUrl,
      exercise: exerciseSelect.value
    }),
    headers: { 'Content-Type': 'application/json' }
  })
  .then(res => res.json())
  .then(data => {
    document.getElementById('reps').textContent = data.reps;
    document.getElementById('stage').textContent = data.stage;
  });
}
