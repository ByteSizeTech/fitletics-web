//STATUS: DETECTS HI-CONFIDENCE SINGLE POSES, CURRENTLY IN USE
let video;
let poseNet;
let pose;
let skeleton;
let sessionComplete = false;
// let currentReps = 0;

//WE GET THE CURRENT EXWECISE FROM THE WORKOUT OBJECT -> workout object will be gotten by vishal sending in the parameter
// let currentWorkout;
// let currentExercise;
// let currentExerciseUNIT;
// let currentGoal;
let poseLabel = "none";

//for looping through the exercises
let exerciseIndex = 0;

function setup() {
  //Create a canvas where the video will show
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
    minPartConfidence: 0.5,
    scoreThreshold: 0.5,
    nmsRadius: 20,
    detectionType: "single",
    inputResolution: 256,
    multiplier: 0.75,
    quantBytes: 2,

    // // imageScaleFactor: 0.3,
    // // minConfidence: 0.5,
  };
  poseNet = ml5.poseNet(video, posenetOpts, modelLoaded);
  poseNet.on("pose", gotResults);
  video.hide();

  // this function takes in a workout object and initialises currentWorkout to that object and all the variables related to it
  initializeWorkout(w);
  updateSessionInfo();
  updateExerciseInfo(exercises[exerciseIndex]);

  //TODO @Nimra INITIALIZATION OF THE SESSION OBJECT AS WE MOVE ON IN THE
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
    if (currentExercise == "Bodyweight Squat") {
      sClassifier.classify(inputs, gotClassificationResult);
    } else if (currentExercise == "Push Up") {
      pClassifier.classify(inputs, gotClassificationResult);
    } else if (currentExercise == "Plank") {
      pwClassifier.classify(inputs, gotClassificationResult);
    } else if (currentExercise == "Wallsit") {
      pwClassifier.classify(inputs, gotClassificationResult);
    } else {
      console.log(
        currentExercise +
          "is not supported by Fitletics yet, moving on to the next exercise: "
      );
      nextExercise(exerciseIndex);
    }
  }
  //  else {
  //   setTimeout(classifyPose, 100);
  // }
}

function gotClassificationResult(error, results) {
  if (error) {
    console.log(error);
  }
  if (results[0].confidence > 0.75) {
    //TODO @Nimra check the touppercase thingie
    poseLabel = results[0].label.toUpperCase();
  }
  // console.log(results[0].confidence);

  if (currentExerciseUNIT == "REPS") {
    examineReps();
  } else {
    examineTime();
  }
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
    if (!sessionComplete) {
      classifyPose();
    }
  }
  pop();

  fill(255, 0, 255);
  noStroke();
  textSize(70);
  textAlign(CENTER, TOP);
  text(poseLabel, width / 2, height / 2);
  fill(0, 255, 255);
  noStroke();
  textSize(70);
  textAlign(CENTER, BOTTOM);
  text(currentReps, width / 2, height / 2);
}

function gotResults(results) {
  // console.log(results);

  if (results.length > 0) {
    // console.log("result.length > than 0");
    pose = results[0].pose;
    skeleton = results[0].skeleton;
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
        fill(255, 117, 26);
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
      strokeWeight(3);
      stroke(255, 153, 153);
      line(
        partA.position.x,
        partA.position.y,
        partB.position.x,
        partB.position.y
      );
    }
  }
}
