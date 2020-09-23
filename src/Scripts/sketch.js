const video2 = document.getElementById("session-video");

// Create a new poseNet method
const poseNet = ml5.poseNet(video2, modelLoaded);

// When the model is loaded
function modelLoaded() {
  console.log("Model Loaded!");
}
// Listen to new 'pose' events
poseNet.on("pose", gotPoses);

function gotPoses(poses) {
  console.log(poses);
}
