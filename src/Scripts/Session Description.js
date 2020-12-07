var firebaseAuth;
var firebaseFirestore;
var uid;

// window.onload = function () {
//   firebaseAuth = firebase.auth();
//   firebaseFirestore = firebase.firestore();

//   getSessionUID();

//   loadWorkout(w);
// };

// function getSessionUID() {
//   firebase.auth().onAuthStateChanged(function (user) {
//     if (user) {
//       uid = firebase.auth().currentUser.uid;
//       console.log(uid);
//       getAppUserUID();
//       setupStartSessionListener();
//       setupCancelListeners();
//     }
//   });
// }

// function setupStartSessionListener() {
//   document
//     .getElementById("start_session_button")
//     .addEventListener("click", () => {
//       console.log("going to Active Session..");
//       startSession();
//     });

//   if (uid) {
//     firebase
//       .firestore()
//       .collection("Sessions")
//       .doc(firebase.auth().currentUser.uid)
//       .onSnapshot(function (doc) {
//         let task = doc.data()["active_task"];
//         switch (task) {
//           case "AS":
//             console.log("going to Active Session..");
//             console.log(`Active sesssion request value updated in DB`);
//             window.location.replace("../build/Session.html");
//             break;
//         }
//       });
//   }
// }

// function startSession() {
//   console.log("called Active sesssion request update");
//   if (uid) {
//     firebaseFirestore
//       .collection("Sessions")
//       .doc(uid)
//       .update({
//         active_task: "AS",
//         task_state: "requested",
//       })
//       .then(() => {
//         console.log(`Active sesssion request value updated in DB`);
//         window.location.replace("../build/Session.html");
//       })
//       .catch((err) => {
//         console.log(`Active sesssion request ongoing update failed`);
//       });
//   } else {
//     console.log("uid not there :C (from activeSeshReq)");
//   }
// }

// var appUserUID;
// var workout = new Workout();
// function getAppUserUID() {
//   firebaseFirestore
//     .collection("Sessions")
//     .doc(uid)
//     .get()
//     .then((doc) => {
//       if (doc.exists) {
//         appUserUID = doc.data()["uid"];
//         var dbExList = doc.data()["task_message"]["workout_obj"]["exlist"];
//         var exlistSize = doc.data()["task_message"]["workout_obj"][
//           "exlist_size"
//         ];

//         var exlist = [];
//         for (var i = 0; i < exlistSize; i++) {
//           var exerciseObj = new Exercise();
//           exerciseObj.name = dbExList[`ex${i}`]["name"];
//           exerciseObj.difficulty = dbExList[`ex${i}`]["difficulty"];
//           exerciseObj.description = dbExList[`ex${i}`]["difficulty"];
//           exlist.push(exerciseObj);
//         }
//         workout.name = doc.data()["task_message"]["workout_obj"]["name"];
//         workout.difficulty = doc.data()["task_message"]["workout_obj"][
//           "difficulty"
//         ];
//         workout.time = doc.data()["task_message"]["workout_obj"]["time"];

//         console.log(
//           `Document data from Session: 
//             uid: ${appUserUID}, 
//             workoutObj: 
//             name: ${workout.name},
//             difficulty: ${workout.difficulty},
//             time: ${workout.time} 
//             ex_size: ${exlist.length}
//             ex_list[0]: ${exlist[0].name}`
//         );
//         initializeSessionDescription();
//         //calls function to tell user populate user's acc
//       } else {
//         console.log("No document found from Session uid");
//       }
//     })
//     .catch((err) => {
//       console.log("There was an error", err);
//     });
// }

// // }

// function initializeSessionDescription() {
//   console.log("called SessionDesc ongoing");
//   if (uid) {
//     firebaseFirestore
//       .collection("Sessions")
//       .doc(uid)
//       .update({
//         task_state: "waiting",
//       })
//       .then(() => {
//         document.getElementById("page-load").style.visibility = "hidden";
//         console.log(`SessionDesc ongoing value updated in DB`);
//       })
//       .catch((err) => {
//         console.log(`SessionDesc ongoing update failed`);
//       });
//   } else {
//     console.log("uid not there :C (from startSessionDesc)");
//   }
// }

// function setupCancelListeners() {
//   if (uid) {
//     firebase
//       .firestore()
//       .collection("Sessions")
//       .doc(firebase.auth().currentUser.uid)
//       .onSnapshot(function (doc) {
//         let task = doc.data()["task_message"];
//         switch (task) {
//           case "cancel":
//             document.getElementById("page-load").style.visibility = "visible";
//             console.log("canceling SessionDesc..");
//             cancelSessionDesc();
//             break;
//         }
//       });
//   }
// }

// function cancelSessionDesc() {
//   firebaseFirestore
//     .collection("Sessions")
//     .doc(uid)
//     .update({
//       active_task: "DB",
//       task_state: "cancelled",
//       task_message: "none",
//     })
//     .then(() => {
//       console.log(`SessionDesc cancelled!. Going to Db..`);
//       window.location.replace("../build/Dashboard.html");
//     })
//     .catch((err) => {
//       console.log(`SessionDesc task cancelled update failed`);
//     });
// }

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

// function createExerciseDOMElement(){
//   return `
//         <div class="exercise-item">
//         <div class="exercise-value">50s</div>
//         <div class="exercise-name">
//           Exercise 1 very long name that takes space
//         </div>
//         <div class="exercise-info-icon">
//           <img
//             src="../build/Images/information.png"
//             alt=""
//             class="info-icon"
//           />
//         </div>
//       </div>`
// }


function loadWorkout(){

  document.getElementById("workout-category").innerHTML = workout.name;

  document.getElementById("duration").innerHTML = workout.time;
  document.getElementById("difficulty").innerHTML = workout.difficulty;

  for (var i = 0; i < workout.exerciseList.length; i++) {
    const exercise = workout.exerciseList[i];

    var exItemDiv = document.createElement('div');
    exItemDiv.className = 'exercise-item';
    exItemDiv.id = `ex${i}`;

    var exValueDiv = document.createElement('div');
    exValueDiv.className = 'exercise-value';
    exValueDiv.id = `ex-value${i}`;

    var exNameDiv = document.createElement('div');
    exNameDiv.className = 'exercise-name';
    exNameDiv.id = `ex-name${i}`;

    var exInfoIconDiv = document.createElement('div');
    exInfoIconDiv.className = 'exercise-info-icon';
    exInfoIconDiv.id = `ex-info-icon${i}`;
    
    var exInfoIcon = document.createElement("img");
    exInfoIcon.className = 'info-icon';
    exInfoIcon.id = `info-icon${i}`;
    exInfoIcon.src="../build/Images/information.png";
    exInfoIcon.onClick="clickInfoIcon(this.id)"
    
    document.getElementsByClassName('exercise-list')[0].appendChild(exItemDiv);
    document.getElementById(`ex${i}`).appendChild(exValueDiv);
    document.getElementById(`ex${i}`).appendChild(exNameDiv);
    document.getElementById(`ex${i}`).appendChild(exInfoIconDiv);
    document.getElementById(`ex-info-icon${i}`).appendChild(exInfoIcon);

    if (exercise.unit == 'SECS') exValueDiv.innerHTML = `${exercise.value}s`;
    else exValueDiv.innerHTML = `${exercise.value}x`;

    document.getElementById(`ex-name${i}`).innerHTML=exercise.name;

  }

  var modal = document.getElementsByClassName("modal")[0];
  var infoIcons = document.getElementsByClassName("info-icon");

  // console.log(infoIcons.length);

  for (var k = 0; k < infoIcons.length; k++) {
    infoIcons[k].onclick = function () 
    {
      
      modal.style.display = "block";
      var exID = this.id.split("info-icon")[1];
      
      document.getElementsByClassName("modal-heading")[0].innerHTML = `${workout.exerciseList[exID].name}`;
      document.getElementsByClassName("modal-body")[0].innerHTML = `${workout.exerciseList[exID].description}`;
      document.getElementById("watch-vid").setAttribute('href', `${workout.exerciseList[exID].link}`);
    };
  }

}

// function clickInfoIcon(clickedItem){
//   console.log(clickedItem);
// }

c1 = new Muscle('Core', 10, 10)
u1 = new Muscle('Upper', 15, 10)
l1 = new Muscle('Lower', 20, 10)
c2 = new Muscle('Core', 35, 10)
u2 = new Muscle('Upper', 30, 10)
l2 = new Muscle('Lower', 25, 10)
c3 = new Muscle('Core', 35, 10)
u3 = new Muscle('Upper', 40, 10)
l3 = new Muscle('Lower', 10, 10)

e1 = new Exercise('exercise 1', 'SECS', 10, 'Easy', 'https://www.apple.com', [c1, u1, l1], null, null, null, 'description for exercise 1');
e2 = new Exercise('exercise 2', 'REPS', 10, 'Easy', 'https://www.youtube.com', [c2, u2, l2], e1, e1, null, 'description for exercise 2');
e3 = new Exercise('exercise 3', 'SECS', 20, 'Easy', 'https://www.oneplus.com', [c3, u3, l3], e1, e2, null, 'description for exercise 3');
e4 = new Exercise('exercise 4', 'REPS', 10, 'Easy', 'https://www.google.com', [c2, u1, l3], e2, e3, 2, 'long description for exercise 1 stuff stuff vjdxvkdjfbkdjfmbsdkjxvbkxjvbkj');
e5 = new Exercise('exercise 5', 'SECS', 30, 'Easy', 'https://www.canon.com', [c1, u2, l3], e3, e1, null, 'desc');
e6 = new Exercise('exercise 6', 'REPS', 10, 'Easy', 'https://www.gmail.com', [c3, u2, l3], e4, e2, 3, 'desc');

eList = [e1,e2,e3,e4,e5,e6]

workout = new Workout('Core', eList, 'Beginner', 'Medium', '30m 45s')

loadWorkout();
