//we use the currentExercise variable
let state;

function examineTime() {
  //TODO we cneed to check for the 10 seconds countdown

  currentReps = 1;
  let s = getSeconds();
  if (s != currentExerciseGoal) {
    if (poseLabel == currentExercise.toUpperCase()) {
      state = "inpose";
      if (timeStarted == false) {
        startTimer();
        timeStarted = true;
      }
      updateProgress();
    } else {
      state = "notinpose";
      stopTimer();
      timeStarted = false;
      //TODO @Vishal send the state to the database RT.
    }
  } else {
    console.log("Exercise Completed! Moving on to the next one.");
    stopTimer();
    timeTaken = getSeconds();
    console.log("timeTaken: " + timeTaken);
    //TODO @Vishal takeTaken should be sent to the database
    //TODO #Nimra feed in the data in the CompletedStats object
    reset();
    countdownTimerStarted = false;

    nextExercise();
  }
}
