//we use the currentExercise variable
let prevState = "";
let state;

function examineTime() {
  //TODO we cneed to check for the 10 seconds countdown

  currentReps = 1;
  let s = getSeconds();
  if (s != currentExerciseGoal) {
    if (poseLabel == currentExercise.toUpperCase()) {
      state = "inpose";
      // console.log("poselabel: ", poseLabel, "state", state);
      if (timeStarted == false) {
        startTimer();
        timeStarted = true;
      }
      updateProgress();
    } else {
      state = "notinpose";
      stopTimer();
      timeStarted = false;
    }
  } else {
    stopTimer();
    // console.log("Exercise Completed! Moving on to the next one.");
    updateProgress();
    console.log("seconds from last", getSeconds());

    // timeTaken = getSeconds();
    // console.log("timeTaken: " + timeTaken);
    //TODO @Vishal takeTaken should be sent to the database
    //TODO #Nimra feed in the data in the CompletedStats object
    // reset();
    nextExercise();
  }
  //only updates the db if the state is changed

  prevState = state;
}
