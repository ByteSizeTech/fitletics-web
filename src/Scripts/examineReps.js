//PREDEFINES WORKOUT INFORMATION
let squatSequence = ["SQUATUP", "SQUATDOWN", "SQUATUP"];
let pushupSequence = ["PUSHUP", "PUSHDOWN", "PUSHUP"];

let currentSequence;
let History = [];
let currPose;
let prevPose = "null";

function examineReps() {
  if (timeStarted == false) {
    startTimer();
    timeStarted = true;
  }

  if (currentExercise == "Bodyweight Squat") {
    currentSequence = squatSequence;
  } else {
    currentSequence = pushupSequence;
  } //we can add more sequences depending on the increase in exercise

  currPose = poseLabel;
  var count = 0;
  if (currPose != prevPose) {
    History.push(poseLabel);
    prevPose = currPose;

    if (History.length >= currentSequence.length) {
      var historyIndex = History.length - currentSequence.length;

      //now we will go over the last three in history matching with the squat sequence
      for (var index = 0; index < currentSequence.length; index++) {
        if (currentSequence[index] == History[historyIndex]) {
          // console.log(count);
          count++;
        } else {
          return;
        }
        historyIndex++;
      }
      if (count == 3) {
        currentReps++;
        historyIndex = History.length - currentSequence.length;
        // History = [];
        // History.push(currentSequence[currentSequence.length - 1]);
        updateProgress();
        if (currentReps == currentExerciseGoal) {
          //it changes the exercise and the variables associated with it
          console.log(
            currentExercise + " Completed! Moving on to the next one."
          );
          stopTimer();
          nextExercise();
        }
      }
    }
  }
}
