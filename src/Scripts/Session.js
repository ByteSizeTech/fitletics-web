function startTimer(duration, display) {
  var timer = duration,
    minutes,
    seconds,
    milliseconds;

  setInterval(function () {
    minutes = parseInt(timer / 60, 10);
    seconds = parseInt(timer % 60, 10);
    milliseconds = parseInt(seconds / 1000);

    minutes = minutes < 10 ? "0" + minutes : minutes;
    seconds = seconds < 10 ? "0" + seconds : seconds;
    milliseconds = milliseconds < 10 ? "0" + milliseconds : milliseconds;

    display.textContent = minutes + ":" + seconds + "." + milliseconds;

    if (--timer < 0) {
      timer = duration;
    }
  }, 1000);
}

var firebaseAuth;
var firebaseFirestore;
var uid;

window.onload = function () {
  firebaseAuth = firebase.auth();
  firebaseFirestore = firebase.firestore();

  getSessionUID();
};

function getSessionUID() {
  firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
      uid = firebase.auth().currentUser.uid;
      console.log(uid);
      getAppUserUID();
      // setupStartSessionListener();
      // setupCancelListeners();
    }
  });
}

var appUserUID;
var workout = new Workout();
function getAppUserUID() {
  firebaseFirestore
    .collection("Sessions")
    .doc(uid)
    .get()
    .then((doc) => {
      if (doc.exists) {
        appUserUID = doc.data()["uid"];
        var dbWorkoutObj = doc.data()["task_message"]["workout_obj"];
        var dbExList = dbWorkoutObj["exlist"];
        var exlistSize = dbWorkoutObj["exlist_size"];
        //workout details
        workout.name = dbWorkoutObj["name"];
        workout.difficulty = dbWorkoutObj["difficulty"];
        workout.time = dbWorkoutObj["time"];
        //exercise details
        var exlist = [];
        for (var i = 0; i < exlistSize; i++) {
          var exerciseObj = new Exercise();
          exerciseObj.name = dbExList[`ex${i}`]["name"];
          exerciseObj.difficulty = dbExList[`ex${i}`]["difficulty"];
          exerciseObj.description = dbExList[`ex${i}`]["difficulty"];
          exlist.push(exerciseObj);
        }
        console.log(
          `Document data from Session: 
            uid: ${appUserUID}, 
            workoutObj: 
            name: ${workout.name},
            difficulty: ${workout.difficulty},
            time: ${workout.time} 
            ex_size: ${exlist.length}
            ex_list[0]: ${exlist[0].name}`
        );
        initializeActiveSession();
      } else {
        console.log("No document found from Session uid");
      }
    })
    .catch((err) => {
      console.log("There was an error", err);
    });
}

function initializeActiveSession() {
  if (uid) {
    firebaseFirestore
      .collection("Sessions")
      .doc(uid)
      .update({
        task_state: "ongoing",
      })
      .then(() => {
        document.getElementById("page-load").style.visibility = "hidden";
        console.log(`Active Sesh ongoing value updated in DB`);
      })
      .catch((err) => {
        console.log(`Active Sesh ongoing update failed`);
      });
  } else {
    console.log("uid not there :C (from startActive Sesh)");
  }
}
