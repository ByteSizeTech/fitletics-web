var canvas;
var ctx;
var video;
var canvasWidth;
var canvasHeight;

var scale = {},
  isInitial = true;

window.onload = () => {
  console.log("called onload");

  canvas = document.getElementById("canvas");
  ctx = canvas.getContext("2d");
  video = document.getElementById("video");
  setupCamera();

  console.log("loading model..");
  loadModel();
  
};

function loadModel(){
    model = undefined; 
    model = await tf.loadLayersModel("../model/model.json");
}

function setupCamera() {
  //   var vendorURL = window.URL || window.webkitURL;

  canvasWidth = canvas.offsetWidth;
  canvasHeight = canvasWidth * (11 / 15);

  //   canvas.style.width = canvasWidth;
  //   canvas.style.height = canvasHeight;

  ctx.canvas.width = canvas.offsetWidth;
  ctx.canvas.height = ctx.canvas.width * (4 / 2);

  navigator.getMedia =
    navigator.getUserMedia ||
    navigator.webkitGetUserMedia ||
    navigator.mozGetUserMedia ||
    navigator.msGetUserMedia;

  navigator.mediaDevices.getUserMedia({ video: true }).then((stream) => {
    video.srcObject = stream;
    video.play();
  });

  console.log("going to video event listener");

  video.addEventListener(
    "play",
    function () {
      console.log("calling scale listener..");

      setScaleListener();
      drawCanvas(this, ctx);
    },
    false
  );

  document.getElementById("capture").addEventListener("click", () => {
    preProcessImage();
  });

  //   getSliders();
}

function preprocessCanvas() {
  let tensor = tf.browser
    .fromPixels(image)
    .resizeNearestNeighbor([128, 64])
    .mean(2)
    .expandDims(2)
    .expandDims()
    .toFloat();
  return tensor.div(255.0);
}

function preProcessImage() {
  src = cv.imread("canvas");
  cv.cvtColor(src, src, cv.COLOR_RGBA2GRAY, 0);
  cv.imshow("canvas2", src);
}

var one = 200;
var two = 0;
var three = 200;
var four = 400;

function getSliders() {
  s1 = document.getElementById("1st");
  s2 = document.getElementById("2nd");
  s3 = document.getElementById("3rd");
  s4 = document.getElementById("4th");

  s1.oninput = function () {
    one = this.value;
  };
  s2.oninput = function () {
    two = this.value;
  };
  s3.oninput = function () {
    three = this.value;
  };
  s4.oninput = function () {
    four = this.value;
  };
}

function drawCanvas(video, ctx) {
  //   console.log(`1: ${one}, 2: ${two}, 3: ${three}, 4: ${four}`);
  ctx.drawImage(
    video,
    200,
    50,
    200,
    400,
    0,
    0,
    ctx.canvas.width,
    ctx.canvas.height
  );
  setTimeout(drawCanvas, 10, video, ctx);
}

function setScaleListener() {
  window.addEventListener("resize", function () {
    console.log("called resize");
    // make sure the ctx variable is global or visible in current scope in your code
    // (scale.x = window.innerWidth / scale.width),
    //   (scale.y = window.innerWidth / scale.height);
    // ctx.scale(scale.x, scale.y);
  });
}
