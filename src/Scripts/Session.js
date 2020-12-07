var firebaseAuth;
var firebaseFirestore;
var uid;

var isBLT = false;

var endSessionButton;

function getSessionUID() {
  console.log("entered getSessionUID");

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
var workoutClassObject = new Workout();
var workoutJSON = {
  name: null,
  exerciseList: null,
  difficulty: null,
  time: null,
  level: null,
  link: null,
  description: null,
};
function getAppUserUID() {
  firebaseFirestore
    .collection("Sessions")
    .doc(uid)
    .get()
    .then((doc) => {
      if (doc.exists) {
        if (doc.data()["active_task"] == "BLT") {
          isBLT = true;
        }
        appUserUID = doc.data()["uid"];
        var dbWorkoutObj = doc.data()["task_message"]["workout_obj"];
        var dbExList = dbWorkoutObj["exlist"];
        var exlistSize = dbWorkoutObj["exlist_size"];
        //workout details
        workoutClassObject.name = dbWorkoutObj["name"];
        workoutJSON.name = dbWorkoutObj["name"];

        workoutClassObject.difficulty = dbWorkoutObj["difficulty"];
        workoutJSON.difficulty = dbWorkoutObj["difficulty"];

        workoutClassObject.time = dbWorkoutObj["time"];
        workoutJSON.time = dbWorkoutObj["time"];

        workoutClassObject.level = dbWorkoutObj["level"];
        workoutJSON.level = dbWorkoutObj["level"];

        //exercise details
        var exlist = [];
        var exJSONlist = {};
        for (var i = 0; i < exlistSize; i++) {
          var exerciseObj = new Exercise();
          var exerciseJSON = {};

          exerciseObj.name = dbExList[`ex${i}`]["name"];
          exerciseJSON.name = dbExList[`ex${i}`]["name"];

          exerciseObj.difficulty = dbExList[`ex${i}`]["difficulty"];
          exerciseJSON.difficulty = dbExList[`ex${i}`]["difficulty"];

          exerciseObj.description = dbExList[`ex${i}`]["description"];
          exerciseJSON.description = dbExList[`ex${i}`]["description"];

          exerciseObj.value = dbExList[`ex${i}`]["value"];
          exerciseJSON.value = dbExList[`ex${i}`]["value"];

          exerciseObj.timePerRep = dbExList[`ex${i}`]["timePerRep"];
          exerciseJSON.timePerRep = dbExList[`ex${i}`]["timePerRep"];

          exerciseObj.unit = dbExList[`ex${i}`]["unit"];
          exerciseJSON.unit = dbExList[`ex${i}`]["unit"];

          exerciseObj.link = dbExList[`ex${i}`]["link"];
          exerciseJSON.link = dbExList[`ex${i}`]["link"];

          exerciseObj.description = dbExList[`ex${i}`]["description"];
          exerciseJSON.description = dbExList[`ex${i}`]["description"];

          var muscleList = [];
          var muscleJSONlist = {};
          for (var j = 0; j < 3; j++) {
            var muscleObj = new Muscle();
            var muscleJSON = {};
            muscleObj.name =
              dbExList[`ex${i}`]["targetMuscles"][`m${j}`]["name"];
            muscleJSON.name =
              dbExList[`ex${i}`]["targetMuscles"][`m${j}`]["name"];

            muscleObj.maleIntensity =
              dbExList[`ex${i}`]["targetMuscles"][`m${j}`]["maleIntensity"];
            muscleJSON.maleIntensity =
              dbExList[`ex${i}`]["targetMuscles"][`m${j}`]["maleIntensity"];

            muscleObj.femaleIntensity =
              dbExList[`ex${i}`]["targetMuscles"][`m${j}`]["femaleIntensity"];
            muscleJSON.femaleIntensity =
              dbExList[`ex${i}`]["targetMuscles"][`m${j}`]["femaleIntensity"];

            muscleList.push(muscleObj);
            var muscleIndex = "m" + j;
            muscleJSONlist[muscleIndex] = muscleJSON;
          }
          exerciseObj.targetMuscles = muscleList;
          exerciseJSON.targetMuscles = muscleJSONlist;

          var exerciseIndex = "ex" + i;
          exJSONlist[exerciseIndex] = exerciseJSON;
          exlist.push(exerciseObj);
        }
        workoutClassObject.exerciseList = exlist;
        workoutJSON.exerciseList = exJSONlist;

        // console.log(`workout Class:`, workoutClassObject);
        // console.log(`workout OBJ:`, workoutJSON);

        getAppUserDetails();
        // initializeActiveSession();
      } else {
        console.log("No document found from Session uid");
      }
    })
    .catch((err) => {
      console.log("There was an error", err);
    });
}

var appUser = {
  upper: null,
  core: null,
  lower: null,
  xp: null,
};
function getAppUserDetails() {
  firebaseFirestore
    .collection("Users")
    .doc(appUserUID)
    .onSnapshot(
      (doc) => {
        if (doc.exists) {
          appUser.name = doc.data()["name"];
          let upperScore = doc.data()["upperScore"];
          let coreScore = doc.data()["coreScore"];
          let lowerScore = doc.data()["lowerScore"];
          let xp = doc.data()["xp"];
          if (upperScore != null && coreScore != null && lowerScore != null) {
            appUser.upper = upperScore;
            appUser.core = coreScore;
            appUser.lower = lowerScore;
            appUser.xp = xp;
          }
          console.log("CALC_FITNESS_FUNC: appUser initialized with()", appUser);
          initializeActiveSession();
        } else {
          console.log("Document did not exist!");
        }
      },
      function (err) {
        console.log("Error in getting user details");
      }
    );
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
        setupCancelListeners();
        setupSkipListener();
        canStart = true;

        initializeWorkout(workoutClassObject);
        initializeCompletedStat();

        console.log("exercList", exercises);
        console.log("workout after func", currentWorkout);

        updateSessionInfo();
        console.log("Initial exercise index", exerciseIndex);

        updateExerciseInfo(workoutClassObject.exerciseList[0]);
      })
      .catch((err) => {
        console.log(`Active Sesh ongoing update failed`);
      });
  } else {
    console.log("uid not there :C (from startActive Sesh)");
  }
}

function setupCancelListeners() {
  firebaseFirestore
    .collection("Sessions")
    .doc(uid)
    .onSnapshot((doc) => {
      let task = doc.data()["task_state"];
      if (task == "endrequest") {
        document.getElementById("page-load").style.visibility = "visible";
        endSession();
      }
    });
}

function setupSkipListener() {
  firebaseFirestore
    .collection("Sessions")
    .doc(uid)
    .onSnapshot((doc) => {
      if (
        doc.data()["active_task"] == "AS" ||
        (doc.data()["active_task"] == "BLT" &&
          doc.data()["task_state"]["ongoing"])
      ) {
        let task = doc.data()["task_message"]["active_session_listeners"][
          "skip_request"
        ];
        if (task == "requested") {
          console.log("task", task);
          handleSkip();
        }
      }
    });
}

function handleSkip() {
  firebaseFirestore
    .collection("Sessions")
    .doc(uid)
    .update({
      "task_message.active_session_listeners.skip_request": "skipped",
    })
    .then(nextExercise);
}

function updatecurrExerciseNameListener(exName) {
  firebaseFirestore
    .collection("Sessions")
    .doc(uid)
    .update({ "task_message.active_session_listeners.curr_ex_name": exName });
}

function updatecurrExerciseNameGoal(exGoal) {
  firebaseFirestore
    .collection("Sessions")
    .doc(uid)
    .update({ "task_message.active_session_listeners.curr_ex_goal": exGoal });
}

function updatecurrExerciseNameUnit(exUnit) {
  firebaseFirestore
    .collection("Sessions")
    .doc(uid)
    .update({ "task_message.active_session_listeners.curr_ex_unit": exUnit });
}

function updatecurrExerciseNameProgress(exProgress) {
  firebaseFirestore.collection("Sessions").doc(uid).update({
    "task_message.active_session_listeners.curr_ex_progress": exProgress,
  });
}

var userNewScoreObject = {};
function populateSessioninUser(sessionObject) {
  let userNewScore = calculateFitnessScore(
    session,
    appUser.upper,
    appUser.core,
    appUser.lower
  );
  userNewScoreObject.upperScore = userNewScore[0];
  userNewScoreObject.coreScore = userNewScore[1];
  userNewScoreObject.lowerScore = userNewScore[2];
  console.log(
    "CALC_FITNESS_FUNC: userNewScoreObject before being passed to populatUserNewScore()",
    userNewScoreObject
  );
  if (!isBLT) {
    firebaseFirestore
      .collection("Users")
      .doc(appUserUID)
      .collection("WorkoutSession")
      .doc()
      .set(sessionObject)
      .then(() => {
        console.log("Something happened ");
        let userNewXP = appUser.xp + sessionObject.timeTaken;
        userNewScoreObject.xp = userNewXP;
        populatUserNewScore();
        // endSessionInDB();
      })
      .catch((err) => {
        console.log(`error: ${err}`);
      });
  } else {
    populatUserNewScore();
  }
}

function populatUserNewScore() {
  firebaseFirestore
    .collection("Users")
    .doc(appUserUID)
    .set(userNewScoreObject, { merge: true })
    .then(endSessionInDB);
}

function endSessionInDB() {
  firebaseFirestore
    .collection("Sessions")
    .doc(uid)
    .update({
      active_task: "DB",
      task_state: "complete",
      task_message: null,
    })
    .then(() => {
      console.log(`Active Task complete! Going to Db..`);
      // window.location.replace("../build/Dashboard.html");
    })
    .catch((err) => {
      console.log(`Active Task complete update failed`);
    });
}


var informationIcon = document.getElementsByClassName('information')[0]
var modal = document.getElementsByClassName("modal")[0];

informationIcon.onclick = function(){
  modal.style.display = "block";
  document.getElementsByClassName("modal-heading")[0].innerHTML = `${workoutClassObject.exerciseList[exerciseIndex].name}`;
  document.getElementsByClassName("modal-body")[0].innerHTML = `${workoutClassObject.exerciseList[exerciseIndex].description}`;
  document.getElementsByClassName("modal-CTA")[0].setAttribute('action', `${workoutClassObject.exerciseList[exerciseIndex].link}`);
} 

var cancelButton = document.getElementById("modal-cancel");
cancelButton.onclick = function () {
  modal.style.display = "none";
};

window.onclick = function (event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
};