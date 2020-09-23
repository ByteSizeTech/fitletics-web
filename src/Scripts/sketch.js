let video;
let poseNet;

function setup() {
  var canvas = createCanvas(740, 680);
  canvas.parent("videoElement");
  background(200);
  video = createCapture(VIDEO);
  video.hide();
}

function draw() {
  image(video, 0, 0);
}
