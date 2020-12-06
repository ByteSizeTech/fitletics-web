let img;
let poseNet;
let poses = [];

function setup() {
  // create an image using the p5 dom library
  // call modelReady() when it is loaded

  let path = "../build/Dataset/Stand/stand(47).jpg";
  img = createImg(path, imageReady);
  // set the image size to the size of the canvas
  // img.size(width, height);
  createCanvas(img.width, img.height);

  img.hide(); // hide the image in the browser
  frameRate(1); // set the frameRate to 1 since we don't need it to be running quickly in this case
}

// when the image is ready, then load up poseNet
function imageReady() {
  // set some options
  let options = {
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
  };

  // assign poseNet
  poseNet = ml5.poseNet(modelReady, options);
  // This sets up an event that listens to 'pose' events
  poseNet.on("pose", onPoses);
}

function onPoses(results) {
  poses = results;
  let pose = poses[0].pose;

  for (let i = 0; i < pose.keypoints.length; i++) {
    console.log(pose.keypoints[i].part);

    let x = pose.keypoints[i].position.x;
    let y = pose.keypoints[i].position.y;
    console.log(i + " x: " + x + " / y: " + y);
  }
}

// when poseNet is ready, do the detection
function modelReady() {
  console.log("Model Ready");
  // When the model is ready, run the singlePose() function...
  // If/When a pose is detected, poseNet.on('pose', ...) will be listening for the detection results
  // in the draw() loop, if there are any poses, then carry out the draw commands
  poseNet.singlePose(img);
}

// draw() will not show anything until poses are found
function draw() {
  if (pose) {
    image(img, 0, 0, width, height);
    drawSkeleton(poses);
    drawKeypoints(poses);
  }
}

// The following comes from https://ml5js.org/docs/posenet-webcam
// A function to draw ellipses over the detected keypoints
function drawKeypoints() {
  // Loop through all the poses detected
  for (let i = 0; i < poses.length; i++) {
    // For each pose detected, loop through all the keypoints
    let pose = poses[i].pose;
    for (let j = 0; j < pose.keypoints.length; j++) {
      // A keypoint is an object describing a body part (like rightArm or leftShoulder)
      let keypoint = pose.keypoints[j];
      // Only draw an ellipse is the pose probability is bigger than 0.2
      if (keypoint.score > 0.2) {
        fill(255);
        stroke(20);
        strokeWeight(4);
        ellipse(round(keypoint.position.x), round(keypoint.position.y), 8, 8);
      }
    }
  }
}

// A function to draw the skeletons
function drawSkeleton() {
  // Loop through all the skeletons detected
  for (let i = 0; i < poses.length; i++) {
    let skeleton = poses[i].skeleton;
    // For every skeleton, loop through all body connections
    for (let j = 0; j < skeleton.length; j++) {
      let partA = skeleton[j][0];
      let partB = skeleton[j][1];
      stroke(255);
      strokeWeight(1);
      line(
        partA.position.x,
        partA.position.y,
        partB.position.x,
        partB.position.y
      );
    }
  }
}