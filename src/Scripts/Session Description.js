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
        let task = doc.data()["active_task"];
        switch (task) {
          case "AS":
            console.log("going to Active Session..");
            console.log(`Active sesssion request value updated in DB`);
            window.location.replace("../build/Session.html");
            break;
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
var workout = new Workout();
function getAppUserUID() {
  firebaseFirestore
    .collection("Sessions")
    .doc(uid)
    .get()
    .then((doc) => {
      if (doc.exists) {
        appUserUID = doc.data()["uid"];
        var dbExList = doc.data()["task_message"]["workout_obj"]["exlist"];
        var exlistSize = doc.data()["task_message"]["workout_obj"][
          "exlist_size"
        ];

        var exlist = [];
        for (var i = 0; i < exlistSize; i++) {
          var exerciseObj = new Exercise();
          exerciseObj.name = dbExList[`ex${i}`]["name"];
          exerciseObj.difficulty = dbExList[`ex${i}`]["difficulty"];
          exerciseObj.description = dbExList[`ex${i}`]["difficulty"];
          exlist.push(exerciseObj);
        }
        workout.name = doc.data()["task_message"]["workout_obj"]["name"];
        workout.difficulty = doc.data()["task_message"]["workout_obj"][
          "difficulty"
        ];
        workout.time = doc.data()["task_message"]["workout_obj"]["time"];

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
