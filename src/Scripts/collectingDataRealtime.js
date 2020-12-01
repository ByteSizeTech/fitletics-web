//STATUS: Rep Algo to be done
let video;
let poseNet;
let pose;
let skeleton;

let PWClassifier;

let state = "waiting";
let targetLabel = "none";

function keyPressed() {
  if (key == "p") {
    console.log("p pressed, 10 seconds to get in position, PLANK");
    targetLabel = "plank";
  } else if (key == "s") {
    console.log("s pressed, 10 seconds to get in position, STAND ");
    targetLabel = "stand";
  } else if (key == "w") {
    console.log("w pressed, 10 seconds to get in position, WALLSIT");
    targetLabel = "wallsit";
  } else if (key == "f") {
    console.log("f pressed, finishing");
    PWClassifier.saveData();
  } else {
    console.log("RERUN, cuz invalid key pressed");
  }
  setTimeout(function () {
    state = "collecting";
    console.log(state + " : state");
    setTimeout(function () {
      console.log("not collecting");
      state = "waiting";
    }, 10000);
  }, 5000);
}

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
  console.log(
    "When you press the key , it will give you 10 seconds before it starts collecting and it will collect the pose for 10 seconds"
  );

  console.log("Press s to capture pose for stand position");
  console.log("Press p to capture pose for plank position");
  console.log("Press w to capture pose for wallsit position");
  console.log(
    "Press f to finish data collecting and then give that json file to nimra, thanks :P"
  );
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

  var options = {
    inputs: 34,
    outputs: 2,
    task: "classification",
    debug: true,
  };
  PWClassifier = ml5.neuralNetwork(options);

  // const modelInfo = {
  //   model: "model/model.json",
  //   metadata: "model/model_meta.json",
  //   weights: "model/model.weights.bin",
  // };
  // brain.load(modelInfo, brainLoaded);
  poseNet = ml5.poseNet(video, modelLoaded);
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
  // console.log(results);

  if (results.length > 0) {
    // console.log("result.length > than 0");
    for (let index = 0; index < results.length; index++) {
      if (results[index].pose.score > 0.3) {
        // console.log(pose);
        pose = results[index].pose;
        skeleton = results[index].skeleton;
        if ((state = "collecting")) {
          let inputs = [];
          for (let j = 0; j < pose.keypoints.length; j++) {
            // A keypoint is an object describing a body part (like rightArm or leftShoulder)
            let x = pose.keypoints[j].position.x;
            let y = pose.keypoints[j].position.y;
            inputs.push(x);
            inputs.push(y);
          }
          let target = [targetLabel];
          PWClassifier.addData(inputs, target);
        }
      }
    }
    // console.log(pose);
  }
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
