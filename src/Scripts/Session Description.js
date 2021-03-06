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
      setupStartSessionListener();
      setupCancelListeners();
    }
  });
}
var request_task = {
  active_task: "AS",
  task_state: "requested",
};

function setupStartSessionListener() {
  document
    .getElementById("start_session_button")
    .addEventListener("click", () => {
      console.log("going to Active Session..");
      startSession();
    });

  if (uid) {
    firebase
      .firestore()
      .collection("Sessions")
      .doc(firebase.auth().currentUser.uid)
      .onSnapshot(function (doc) {
        let state = doc.data()["task_state"];
        let task = doc.data()["active_task"];
        if ((task == "BLT" || task == "SD") && state == "ongoing") {
          if (task == "BLT") {
            request_task.active_task = "BLT";
          }
          console.log("going to Active Session..");
          console.log(`Active sesssion request value updated in DB`);
          window.location.replace("../build/Session.html");
        }
      });
  }
}

function startSession() {
  console.log("called Active sesssion request update");
  if (uid) {
    firebaseFirestore
      .collection("Sessions")
      .doc(uid)
      .update({
        active_task: "AS",
        task_state: "requested",
      })
      .then(() => {
        console.log(`Active sesssion request value updated in DB`);
        window.location.replace("../build/Session.html");
      })
      .catch((err) => {
        console.log(`Active sesssion request ongoing update failed`);
      });
  } else {
    console.log("uid not there :C (from activeSeshReq)");
  }
}

var appUserUID;
var workoutClassObject = new Workout();
workoutJSON = {};
function getAppUserUID() {
  firebaseFirestore
    .collection("Sessions")
    .doc(uid)
    .get()
    .then((doc) => {
      if (doc.exists) {
        appUserUID = doc.data()["uid"];
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

        console.log(
          `Document data from Session: 
            uid: ${appUserUID}, 
            workoutObj: 
            name: ${workoutClassObject.name},
            difficulty: ${workoutClassObject.difficulty},
            time: ${workoutClassObject.time} 
            ex_size: ${exlist.length}
            ex_list[0]: ${exlist[0].name}`
        );

        loadWorkout(workoutClassObject);
        initializeSessionDescription();
        //calls function to tell user populate user's acc
      } else {
        console.log("No document found from Session uid");
      }
    })
    .catch((err) => {
      console.log("There was an error", err);
    });
}

// }

function initializeSessionDescription() {
  console.log("called SessionDesc ongoing");
  if (uid) {
    firebaseFirestore
      .collection("Sessions")
      .doc(uid)
      .update({
        task_state: "waiting",
      })
      .then(() => {
        document.getElementById("page-load").style.visibility = "hidden";
        console.log(`SessionDesc ongoing value updated in DB`);
      })
      .catch((err) => {
        console.log(`SessionDesc ongoing update failed`);
      });
  } else {
    console.log("uid not there :C (from startSessionDesc)");
  }
}

function setupCancelListeners() {
  if (uid) {
    firebase
      .firestore()
      .collection("Sessions")
      .doc(firebase.auth().currentUser.uid)
      .onSnapshot(function (doc) {
        let task = doc.data()["task_message"];
        switch (task) {
          case "cancel":
            document.getElementById("page-load").style.visibility = "visible";
            console.log("canceling SessionDesc..");
            cancelSessionDesc();
            break;
        }
      });
  }
}

function cancelSessionDesc() {
  firebaseFirestore
    .collection("Sessions")
    .doc(uid)
    .update({
      active_task: "DB",
      task_state: "cancelled",
      task_message: "none",
    })
    .then(() => {
      console.log(`SessionDesc cancelled!. Going to Db..`);
      window.location.replace("../build/Dashboard.html");
    })
    .catch((err) => {
      console.log(`SessionDesc task cancelled update failed`);
    });
}

// Functions to open and close the exercise info modal

var modal = document.getElementsByClassName("modal")[0];
var cancelButton = document.getElementById("modal-cancel");

cancelButton.onclick = function () {
  modal.style.display = "none";
};

window.onclick = function (event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
};

cancelButton.onclick = function () {
  modal.style.display = "none";
};

function loadWorkout(workout) {
  console.log(workout);

  document.getElementById("workout-category").innerHTML = workout.name;

  document.getElementById("duration").innerHTML = workout.time;
  document.getElementById("difficulty").innerHTML = workout.difficulty;

  for (var i = 0; i < workout.exerciseList.length; i++) {
    const exercise = workout.exerciseList[i];

    var exItemDiv = document.createElement("div");
    exItemDiv.className = "exercise-item";
    exItemDiv.id = `ex${i}`;

    var exValueDiv = document.createElement("div");
    exValueDiv.className = "exercise-value";
    exValueDiv.id = `ex-value${i}`;

    var exNameDiv = document.createElement("div");
    exNameDiv.className = "exercise-name";
    exNameDiv.id = `ex-name${i}`;

    var exInfoIconDiv = document.createElement("div");
    exInfoIconDiv.className = "exercise-info-icon";
    exInfoIconDiv.id = `ex-info-icon${i}`;

    var exInfoIcon = document.createElement("img");
    exInfoIcon.className = "info-icon";
    exInfoIcon.id = `info-icon${i}`;
    exInfoIcon.src = "../build/Images/information.png";
    exInfoIcon.onClick = "clickInfoIcon(this.id)";

    document.getElementsByClassName("exercise-list")[0].appendChild(exItemDiv);
    document.getElementById(`ex${i}`).appendChild(exValueDiv);
    document.getElementById(`ex${i}`).appendChild(exNameDiv);
    document.getElementById(`ex${i}`).appendChild(exInfoIconDiv);
    document.getElementById(`ex-info-icon${i}`).appendChild(exInfoIcon);

    if (exercise.unit == "SECS") exValueDiv.innerHTML = `${exercise.value}s`;
    else exValueDiv.innerHTML = `${exercise.value}x`;

    document.getElementById(`ex-name${i}`).innerHTML = exercise.name;
  }

  var modal = document.getElementsByClassName("modal")[0];
  var infoIcons = document.getElementsByClassName("info-icon");

  // console.log(infoIcons.length);

  for (var k = 0; k < infoIcons.length; k++) {
    infoIcons[k].onclick = function () {
      modal.style.display = "block";
      var exID = this.id.split("info-icon")[1];

      document.getElementsByClassName(
        "modal-heading"
      )[0].innerHTML = `${workout.exerciseList[exID].name}`;
      document.getElementsByClassName(
        "modal-body"
      )[0].innerHTML = `${workout.exerciseList[exID].description}`;
      document
        .getElementById("watch-vid")
        .setAttribute("href", `${workout.exerciseList[exID].link}`);
      console.log("exerc link:", workout.exerciseList[exID].link);
    };
  }
}
