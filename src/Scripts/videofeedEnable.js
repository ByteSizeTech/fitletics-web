//STATUS: DETECTS HI-CONFIDENCE SINGLE POSES, CURRENTLY IN USE
let video;

function setup() {
  var canvasDiv = document.getElementById("videoElement");
  console.log(canvasDiv.offsetWidth + " and height " + canvasDiv.offsetHeight);
  var canvasWidth = canvasDiv.offsetWidth;
  var canvasHeight = canvasDiv.offsetHeight;
  const canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent(canvasDiv);

  // Video capture
  video = createCapture(VIDEO);
  video.size(canvasWidth, canvasHeight);

  video.hide();
}

function draw() {
  translate(video.width, 0);
  scale(-1, 1);
  image(video, 0, 0, width, height);
}
