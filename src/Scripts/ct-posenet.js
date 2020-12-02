//STATUS: DETECTS HI-CONFIDENCE SINGLE POSES, CURRENTLY IN USE
let video;
let poseNet;
let pose;
let skeleton;

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

  var posenetOpts = {
    architecture: "ResNet50",
    // imageScaleFactor: 0.3,
    outputStride: 32,
    // flipHorizontal: false,
    minConfidence: 0.5,
    maxPoseDetections: 1,
    minPartConfidence:0.5,
    scoreThreshold: 0.5,
    nmsRadius: 20,
    detectionType: "single",
    inputResolution: 256,
    multiplier: 0.75,
    quantBytes: 2,
    

    // // imageScaleFactor: 0.3,
    // // minConfidence: 0.5,
  };
  poseNet = ml5.poseNet(video, posenetOpts,modelLoaded);
  poseNet.on("pose", gotResults);
  video.hide();

  //LOAD ANY OR ALL THE OTHER MODELS TO BE LOADED Like pushups? or squats here?
}

function modelLoaded() {
  console.log("Model Loaded");
}

function draw() {
  translate(video.width, 0);
  scale(-1, 1);
  image(video, 0, 0, width, height);

  // We can call both functions to draw all keypoints and the skeletons
  if (pose) {
    drawKeypoints();
    drawSkeleton();
  }
}

function gotResults(results) {
  console.log(results);

  if (results.length > 0) {
    // console.log("result.length > than 0");
  
        pose = results[0].pose;
        skeleton = results[0].skeleton;
      
    
  }
  console.log(pose);
}

// A function to draw ellipses over the detected keypoints
function drawKeypoints() {
  if (pose) {
    for (let j = 0; j < pose.keypoints.length; j++) {
      // A keypoint is an object describing a body part (like rightArm or leftShoulder)
      let keypoint = pose.keypoints[j];
      // Only draw an ellipse is the pose probability is bigger than 0.2
      if (keypoint.score > 0.2) {
        fill(255,0,0);
        noStroke();
        ellipse(keypoint.position.x, keypoint.position.y, 15, 15);
      }
    }
  }
}
// A function to draw the skeletons
function drawSkeleton() {
  if (skeleton) {
    for (let j = 0; j < skeleton.length; j++) {
      let partA = skeleton[j][0];
      let partB = skeleton[j][1];
      strokeWeight(2);
      stroke(0,255,0);
      line(
        partA.position.x,
        partA.position.y,
        partB.position.x,
        partB.position.y
      );
    }
  }
}
