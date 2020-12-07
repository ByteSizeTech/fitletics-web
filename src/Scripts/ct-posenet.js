//STATUS: DETECTS HI-CONFIDENCE SINGLE POSES, CURRENTLY IN USE
let video;
let poseNet;
let pose;
let skeleton;
let canStart = false;

let session = new Session();
let sessionJSON = {};

let currentWorkout; // initialised in setup as session.work = currWork
let totalSessionTime = 0; //valculated as we move on, after EACH EXERCISE is done
//TODO @nimra date function in setup
let dateCompleted = "dd/mm/yyyy"; // done in setup
let completedStats = []; //updated as we move along
var completedStatsJSON = {};
let sessionComplete = false; //TODO @Nimra think about this CONFUSION?????
let exerciseIndex = 0; //used to loop thru elist in a workout

let poseLabel = "none";

function setup() {
  //firebase setup
  firebaseAuth = firebase.auth();
  firebaseFirestore = firebase.firestore();
  endSessionButton = document.getElementById("end-session-button");
  getSessionUID();

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

  // updateExerciseInfo(exercises[exerciseIndex]);

  //INITIALIZATION OF THE SESSION OBJECT AS WE MOVE ON IN THE
  // session.workout = currentWorkout;
  //TODO DATE of sessionnn
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
      alert(
        currentExercise +
          " is not supported by Fitletics yet, moving on to the next exercise: "
      );
      nextExercise();
    }
  }
}

function gotClassificationResult(error, results) {
  if (error) {
    console.log(error);
  }
  if (results[0].confidence > 0.75) {
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
  if (canStart) {
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
  }

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
