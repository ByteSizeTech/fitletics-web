//STATUS: COLLECTING THE DATA

// 1) get the Image
// 2) run posenet to get the points
// 3) Make nose the origin
// 4) add the dataa to the neural network
// 5) save the data

let PWCLassifier; //neural network model to classify the wallsit and pushups
let poseNet; // pre trained model
let img; //hold the image in the dataset from which we will extract the pose
let newImg;
let pose; //holds the pose extracted from the image
let finished = false;
let targetLabel = "plank"; //will change according to the data being collected
let datasetSize = 50; //depends on the size

async function keyPressed() {
  if (key == "s") {
    console.log("Saving the data");
    brain.saveData();
  }
}
function delay(time) {
  return new Promise((resolve, reject) => {
    setTimeout(resolve, time);
  });
}

function setup() {
  let NNOpts = {
    inputs: 34,
    outputs: 1,
    task: "classification",
    debug: true,
  };
  PWClassifier = ml5.neuralNetwork(NNOpts);
  for (let index = 0; index < datasetSize; index++) {
    newImg = "plank(" + index + ").jpg";
    path = "Dataset/Plank/" + newImg;
    img = loadImage(path, imageLoaded);
    console.log("loaded " + path);
  }

  // console.log("Finished all the images, saving the data...");
  // PWClassifier.saveData();
}

function imageLoaded() {
  console.log("image Loaded function");
  let poseNetOpts = {
    minConfidence: 0.5,
    imageScaleFactor: 0.3,
  };
  poseNet = ml5.poseNet(modelReady, poseNetOpts);
  // This sets up an event that listens to 'pose' events
  poseNet.on("pose", gotPoses);
}
function modelReady() {
  console.log("PoseNet model is ready");

  // When the model is ready, run the singlePose() function...
  // If/When a pose is detected, poseNet.on('pose', ...) will be listening for the detection results
  // in the draw() loop, if there are any poses, then carry out the draw commands
  poseNet.singlePose(img);
}

function gotPoses(results) {
  if (results.length > 0) {
    //Dealing with >= 1 valid pose
    for (let index = 0; index < results.length; index++) {
      if (results[index].pose.score > 0.2) {
        pose = results[index].pose;
        skeleton = results[index].skeleton;
      }
    }

    let inputs = [];
    for (let i = 0; i < pose.keypoints.length; i++) {
      let noseX = pose.nose.x;
      let noseY = pose.nose.y;
      let x = pose.keypoints[i].position.x - noseX;
      let y = pose.keypoints[i].position.y - noseY;
      inputs.push(x);
      inputs.push(y);
    }

    let target = [targetLabel];
    // console.log(inputs, target)
    PWClassifier.addData(inputs, target);
    console.log("Added");
  } else {
    console.log("Didn't find pose, moving next");
  }
}
