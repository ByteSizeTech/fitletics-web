var firebaseAuth;
var firebaseFirestore;
var uid;

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
};
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
        workoutClassObject.name = dbWorkoutObj["name"];
        workoutJSON.name = dbWorkoutObj["name"];

        workoutClassObject.difficulty = dbWorkoutObj["difficulty"];
        workoutJSON.difficulty = dbWorkoutObj["difficulty"];

        workoutClassObject.time = dbWorkoutObj["time"];
        workoutJSON.time = dbWorkoutObj["time"];
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
  // endSessionButton.addEventListener("click", () => {
  //   console.log("End session clicked");
  //   createSessionObject();
  // });

  firebaseFirestore
    .collection("Sessions")
    .doc(uid)
    .onSnapshot((doc) => {
      let task = doc.data()["task_state"];
      if (task == "endrequest") {
        createSessionObject();
      }
    });
}

function setupSkipListener() {
  // endSessionButton.addEventListener("click", () => {
  //   console.log("End session clicked");
  //   createSessionObject();
  // });

  firebaseFirestore
    .collection("Sessions")
    .doc(uid)
    .onSnapshot((doc) => {
      let task = doc.data()["task_message"]["active_session_listeners"][
        "skip_request"
      ];
      if (task == "requested") {
        console.log("task", task);
        handleSkip();
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

function createSessionObject() {}

function populateSessioninUser(sessionObject) {
  firebaseFirestore
    .collection("Users")
    .doc(appUserUID)
    .collection("WorkoutSession")
    .doc()
    .set(sessionObject)
    .then(() => {
      console.log("Something happened ");
      endSessionInDB();
    })
    .catch((err) => {
      console.log(`error: ${err}`);
    });
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
      window.location.replace("../build/Dashboard.html");
    })
    .catch((err) => {
      console.log(`Active Task complete update failed`);
    });
}
