//STATUS: DETECTS HI-CONFIDENCE SINGLE POSES, CURRENTLY IN USE
let video;
let poseNet;
let pose;
let skeleton;
let exercise;
let poseLabel = "none";
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
    imageScaleFactor: 0.3,
    outputStride: 16,
    flipHorizontal: false,
    minConfidence: 0.5,
    maxPoseDetections: 1,
    scoreThreshold: 0.5,
    nmsRadius: 20,
    detectionType: "single",
    inputResolution: 513,
    multiplier: 0.75,
    quantBytes: 2,

    // imageScaleFactor: 0.3,
    // minConfidence: 0.5,
  };
  poseNet = ml5.poseNet(video, modelLoaded);
  poseNet.on("pose", gotResults);
  video.hide();

  let PWoptions = {
    inputs: 34,
    outputs: 3,
    task: "classification",
    debug: true,
  };
  PWCLassifier = ml5.neuralNetwork(PWoptions);
  const modelInfo = {
    model: "model/model.json",
    metadata: "model/model_meta.json",
    weights: "model/model.weights.bin",
  };

  PWCLassifier.load(modelInfo, PWLoaded);

  //LOAD ANY OR ALL THE OTHER MODELS TO BE LOADED Like pushups? or squats here?
}

function PWLoaded() {
  console.log("Pose classification ready!");
  classifyPose();
}

function classifyPose() {
  if (pose) {
    let inputs = [];
    for (let i = 0; i < pose.keypoints.length; i++) {
      let x = pose.keypoints[i].position.x;
      let y = pose.keypoints[i].position.y;
      inputs.push(x);
      inputs.push(y);
    }
    PWCLassifier.classify(inputs, gotClassificationResult);
  } else {
    setTimeout(classifyPose, 100);
  }
}

function gotClassificationResult(error, results) {
  if (results[0].confidence > 0.75) {
    poseLabel = results[0].label.toUpperCase();
  }
  //console.log(results[0].confidence);
  classifyPose();
}

function modelLoaded() {
  console.log("Model Loaded");
}

function draw() {
  push();

  translate(video.width, 0);
  scale(-1, 1);
  image(video, 0, 0, width, height);

  // We can call both functions to draw all keypoints and the skeletons
  if (pose) {
    drawKeypoints();
    drawSkeleton();
  }
  pop();

  fill(255, 0, 255);
  noStroke();
  textSize(512);
  textAlign(CENTER, CENTER);
  text(poseLabel, width / 2, height / 2);
}

function gotResults(results) {
  console.log(results);

  if (results.length > 0) {
    // console.log("result.length > than 0");
    for (let index = 0; index < results.length; index++) {
      if (results[index].pose.score > 0.2) {
        // console.log(pose);
        pose = results[index].pose;
        skeleton = results[index].skeleton;
      }
    }
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
        fill(255, 0, 0);
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
      stroke(255, 0, 0);
      line(
        partA.position.x,
        partA.position.y,
        partB.position.x,
        partB.position.y
      );
    }
  }
}
