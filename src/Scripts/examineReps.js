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
    // console.log(History);
    History.push(poseLabel);
    prevPose = currPose;

    // console.log("hist length: " + History.length);
    // console.log("squat length: " + squatSequence.length);
    if (History.length >= currentSequence.length) {
      var historyIndex = History.length - currentSequence.length;
      // console.log("history" + historyIndex);

      //now we will go over the last three in history matching with the squat sequence
      for (var index = 0; index < currentSequence.length; index++) {
        // console.log("squat Index" + index);
        // console.log("squat[index] : " + squatSequence[index]);
        // console.log("History[histind] : " + History[historyIndex]);

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
          // console.log("timeTaken: " + timeTaken);
          //TODO @Vishal takeTaken should be sent to the database
          //TODO #Nimra feed in the data in the CompletedStats object
          nextExercise();
        }
      }
    }
  }
  // console.log(currentReps);
}

//TESTING HISTORY
// history= [0,1,2]
//squat seq = {a,b,a}
// historyIndex= history length - squatlength
//              =  3            -  3
//              = 0
// History[histIndex] -> History[0]

//if history = [1,2,3,4,5,6]
//jistory index - 6 - 3
// index = 3
// history[historyIndex] would be History[3] = HIstory[1,2,3,[[[[4]]]],5,6]
// hence the last three if you subtract -3