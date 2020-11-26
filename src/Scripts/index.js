var defaultVals = {
  uid: null,
  task: null,
  task_state: null,
};

window.onload = function init() {
  checkUser();
};

//Auth Functions
function checkUser() {
  //User State Listener
  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      console.log(`Signed in from Auth State as ${user.uid}`);
      goToSession();
      generateQR(user.uid);
    } else {
      console.log("Signing in..");
      signinSession();
    }
  });
}

function signinSession() {
  firebase
    .auth()
    .signInAnonymously()
    .then(() => {
      console.log("Created annonymous login for the 1st time!");
      populateDefaultVals();
    })
    .catch((error) => {
      var errorCode = error.code;
      var errorMessage = error.message;
      console.log("Error signing in!", errorMessage);
    });
}

//FireStore Functions
function populateDefaultVals() {
  uid = firebase.auth().currentUser.uid;
  firebase
    .firestore()
    .collection("Sessions")
    .doc(uid)
    .set(defaultVals)
    .then(() => {
      console.log("Document successfully written!");
    })
    .catch((error) => {
      console.log("Error: ", error);
    });
}

function goToSession() {
  //Users's Task State Listener
  console.log("Going to session");

  let uid = firebase.auth().currentUser;

  if (uid) {
    firebase
      .firestore()
      .collection("Sessions")
      .doc(firebase.auth().currentUser.uid)
      .onSnapshot(function (doc) {
        console.log("Current data: ", doc.data()["task"]);
        let task = doc.data()["task"];
        switch (task) {
          case "BA":
            console.log("going to Body analysis..");
            // window.location.replace("../build/Session.html");
            break;
          case "DB":
            console.log("going to Dashboard..");
            // window.location.replace("../build/Dashboard.html");
            break;
          case "WO":
            console.log("going to Session Description..");
            // window.location.replace("../build/SessionDescription.html");
            break;
        }
      });
  }
}

//Utility function
function generateQR(uid) {
  var qrcode = new QRCode(document.getElementById("qrcode"));
  console.log("Generating QR Code");
  document.getElementById("loading-gif").remove();
  document.getElementById("qrcode").style.backgroundColor = "orange";
  qrcode.makeCode(uid);
  // qrcode.makeCode("16367163584");
}
