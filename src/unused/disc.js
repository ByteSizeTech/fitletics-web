// STATUS: Using this to work on poseClassifier neural network, getting the data for the nn, works well. is able to loop thru the folder

let img;
let poseNet;
let pose1;
let skeleton1;
// let pose2;
// let skeleton2; //uncomment for multi pose
let brain;
let targetLabel = "H"; //change when changing the folder
let poses;
let finished = false;
let TOTAL_IMAGE = 50; //Change accordingly

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

//Preload Neural network and Posenet
function preload() {
  //nn options
  let options1 = {
    inputs: 34, //17 pairs, single pose
    outputs: 1, //since the target label is 1
    task: "classification",
    debug: true,
  };
  brain = ml5.neuralNetwork(options1);
}

async function setup() {
  for (var i = 0; i < TOTAL_IMAGE; i++) {
    //iterate through all the images in the folder
    await new Promise((next) => {
      //LOADING THE IMAGE
      newImg = "plank(" + i + ").jpg";
      path = "Dataset/Plank/" + newImg;
      img = loadImage(path);
      console.log("loaded " + path);

      //poseNet options
      let options2 = {
        imageScaleFactor: 0.3,
        minConfidence: 0.5,
      };

      poseNet = ml5.poseNet(loaded, options2);
      //GET KEYPOINT FOR THE LOADED IMAGE
      poseNet.on("pose", gotPoses);

      async function finish() {
        await delay(750);
        if (finished) {
          finished = false;
          // console.log('Done with ' + newImg);
          next();
        } else {
          finish(); //wait
        }
      }

      finish();
    });
  }

  console.log("Finished all the images, saving the data...");
  brain.saveData();
}

function loaded() {
  poseNet.singlePose(img);
}

function gotPoses(poses) {
  if (poses.length > 0) {
    //Dealing with >= 1 valid pose
    pose1 = poses[0].pose;
    skeleton1 = poses[0].skeleton;
    // pose2 = poses[1].pose;
    // skeleton2 = poses[1].skeleton;

    let inputs = [];
    for (let i = 0; i < pose1.keypoints.length; i++) {
      let x1 = pose1.keypoints[i].position.x;
      let y1 = pose1.keypoints[i].position.y;
      inputs.push(x1);
      inputs.push(y1);
    }
    // for (let i = 0; i < pose2.keypoints.length; i++) {
    //   let x2 = pose2.keypoints[i].position.x;
    //   let y2 = pose2.keypoints[i].position.y;
    //   inputs.push(x2);
    //   inputs.push(y2);
    // }

    let target = [targetLabel];
    // console.log(inputs, target)
    brain.addData(inputs, target);
    console.log("Added");
    finished = true;
  } else {
    console.log("Didn't find pose, moving next");
    finished = true;
  }
}
