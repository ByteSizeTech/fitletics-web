//we use the currentExercise variable
let prevState = "";
let state;

function examineTime() {
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
    nextExercise();
  }
  //only updates the db if the state is changed

  prevState = state;
}
