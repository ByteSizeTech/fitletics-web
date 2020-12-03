var firebaseAuth;
var firebaseFirestore;
var uid;

var appUser = {
  name: null,
  xp: null,
};

window.onload = () => {
  firebaseAuth = firebase.auth();
  firebaseFirestore = firebase.firestore();

  checkUser();
};

function checkUser() {
  //User State Listener
  firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
      uid = firebase.auth().currentUser.uid;
      console.log(uid);
      getAppUserUID();
      goToSessionListener();
    }
  });
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
        getAppUserDetails();
      } else {
        console.log("No document found from Session uid");
      }
    })
    .catch((err) => {
      console.log("There was an error", err);
    });
}

function getAppUserDetails() {
  firebaseFirestore
    .collection("Users")
    .doc(appUserUID)
    .onSnapshot(
      (doc) => {
        if (doc.exists) {
          console.log("User's name:", doc.data()["name"]);
          appUser.name = doc.data()["name"];
          let userXP = doc.data()["xp"];
          if (userXP != null) {
            appUser.xp = userXP;
          }
          updateHTMLwithDetails();
        } else {
          console.log("Document did not exist!");
        }
      },
      function (err) {
        console.log("Error in getting user details");
      }
    );
}

function updateHTMLwithDetails() {
  userName = document.getElementById("user_name");
  userName.textContent = appUser.name;
  document.getElementById("page-load").style.visibility = "hidden";
}

function goToSessionListener() {
  //Users's Task State Listener
  console.log("Going to session");

  if (uid) {
    firebase
      .firestore()
      .collection("Sessions")
      .doc(firebase.auth().currentUser.uid)
      .onSnapshot(
        function (doc) {
          console.log("Current data: ", doc.data()["active_task"]);
          let task = doc.data()["active_task"];
          switch (task) {
            case "BA":
              document.getElementById("page-load").style.visibility = "visible";
              console.log("going to Body analysis..");
              window.location.replace("../build/BodyAnalysis.html");
              break;
            case "SD":
              document.getElementById("page-load").style.visibility = "visible";
              console.log("going to Session Description..");
              window.location.replace("../build/SessionDescription.html");
              break;
            case "AS":
              document.getElementById("page-load").style.visibility = "visible";
              console.log("going to Session Description..");
              window.location.replace("../build/SessionDescription.html");
              break;
            case null:
              document.getElementById("page-load").style.visibility = "visible";
              console.log("going to Session Index..");
              window.location.replace("../build/index.html");
              break;
          }
        },
        function (err) {
          console.log("Error in session listener");
        }
      );
  }
}
