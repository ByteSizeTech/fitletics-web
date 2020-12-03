var canvas;
var ctx;
var video;
var canvasWidth;
var canvasHeight;
var globalModel;

var firebaseAuth;
var firebaseFirestore;
var uid;

var scale = {},
  isInitial = true;

window.onload = () => {
  //load model & getSessionUID & setupCamera & setupCaptureListeners & setupCancelListeners
  //startBodyAnalysis
  //preProcessImage
  //getPrediction & preProcessCanvas
  //*********************************/
  //getAppUserUID
  //updateUserBodyTypeinDB & finishBodyAnalysis

  console.log("called onload");
  firebaseAuth = firebase.auth();
  firebaseFirestore = firebase.firestore();

  canvas = document.getElementById("canvas");
  ctx = canvas.getContext("2d");
  video = document.getElementById("video");
  getSessionUID();
  console.log("loading model..");
  loadModel();
};

async function loadModel() {
  model = undefined;
  model = await tf.loadLayersModel("../src/Models/BodyAnalysis/model.json");
  console.log("Model loaded!");
}

function getSessionUID() {
  firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
      uid = firebase.auth().currentUser.uid;
      console.log(uid);
      setupCamera();
    }
  });
}

function startBodyAnalysis() {
  console.log("called startBA");
  if (uid) {
    firebaseFirestore
      .collection("Sessions")
      .doc(uid)
      .update({
        task_state: "ongoing",
      })
      .then(() => {
        document.getElementById("page-load").style.visibility = "hidden";
        console.log(`Body analysis ongoing value updated in DB`);
      })
      .catch((err) => {
        console.log(`Body analysis ongoing update failed`);
      });
  } else {
    console.log("uid not there :C (from startBA)");
  }
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
      drawCanvas(this, ctx);
      startBodyAnalysis();
    },
    false
  );

  setupCaptureListeners();
  setupCancelListeners();
  //   getSliders();
}

function setupCaptureListeners() {
  if (uid) {
    firebase
      .firestore()
      .collection("Sessions")
      .doc(firebase.auth().currentUser.uid)
      .onSnapshot(function (doc) {
        let task = doc.data()["task_message"];
        switch (task) {
          case "capture":
            document.getElementById("page-load").style.visibility = "visible";
            console.log("capturing image..");
            preProcessImage();
            break;
        }
      });
  }
}

function setupCancelListeners() {
  document.getElementById("cancel").addEventListener("click", () => {
    cancelBodyAnalysis();
  });

  if (uid) {
    firebase
      .firestore()
      .collection("Sessions")
      .doc(firebase.auth().currentUser.uid)
      .onSnapshot(function (doc) {
        let task = doc.data()["task_message"];
        switch (task) {
          case "cancelled":
            console.log("canceling body analysis..");
            cancelBodyAnalysis();
            break;
        }
      });
  }
}

function cancelBodyAnalysis() {
  firebaseFirestore
    .collection("Sessions")
    .doc(uid)
    .update({
      active_task: "DB",
      task_state: "cancelled",
      task_message: "none",
    })
    .then(() => {
      document.getElementById("page-load").style.visibility = "visible";
      console.log(`Body analysis cancelled!. Going to Db..`);
      window.location.replace("../build/Dashboard.html");
    })
    .catch((err) => {
      console.log(`Body analysis task cancelled update failed`);
    });
}

function preprocessCanvas(image) {
  let tensor = tf.browser
    .fromPixels(image)
    .resizeNearestNeighbor([64, 128])
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
  getPrediction();
}

var bodyType;
async function getPrediction() {
  let tensor = preprocessCanvas(document.getElementById("canvas2"));
  let predictions = await model.predict(tensor).data();
  let results = Array.from(predictions);

  switch (indexOfMax(results)) {
    case 0:
      bodyType = "ECTOMORPHIC";
      break;
    case 1:
      bodyType = "ENDOMORPHIC";
      break;
    case 2:
      bodyType = "MESOMORPHIC";
      break;
  }

  console.log("results: ", results, indexOfMax(results), bodyType);

  //calls function to get user's id
  getAppUserUID();
}

var appUserUID;
function getAppUserUID() {
  firebaseFirestore
    .collection("Sessions")
    .doc(uid)
    .get("uid")
    .then((doc) => {
      if (doc.exists) {
        console.log(`Document data from Session uid: ${doc.data()["uid"]}`);
        appUserUID = doc.data()["uid"];
        //calls function to tell user populate user's acc
        updateUserBodyTypeinDB();
      } else {
        console.log("No document found from Session uid");
      }
    })
    .catch((err) => {
      console.log("There was an error", err);
    });
}

function updateUserBodyTypeinDB() {
  firebaseFirestore
    .collection("Users")
    .doc(appUserUID)
    .update({
      bodyType: bodyType,
    })
    .then(() => {
      console.log(`Body type successfully updated for app user as ${bodyType}`);
      finishBodyAnalysis();
    })
    .catch((err) => {
      console.log(`Failed to update body type for app user`);
    });
}

function finishBodyAnalysis() {
  //calls function to flag task as over
  firebaseFirestore
    .collection("Sessions")
    .doc(uid)
    .update({
      active_task: "DB",
      task_state: "complete",
      task_message: "none",
    })
    .then(() => {
      console.log(`Body analysis complete and values updated. Going to Db..`);
      window.location.replace("../build/Dashboard.html");
    })
    .catch((err) => {
      console.log(`Body analysis task complete update failed`);
    });
}

function indexOfMax(arr) {
  if (arr.length === 0) {
    return -1;
  }

  var max = arr[0];
  var maxIndex = 0;

  for (var i = 1; i < arr.length; i++) {
    if (arr[i] > max) {
      maxIndex = i;
      max = arr[i];
    }
  }

  return maxIndex;
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
  });
}
