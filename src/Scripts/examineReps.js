//PREDEFINES WORKOUT INFORMATION
let squatSequence = ["SQUATUP", "SQUATDOWN", "SQUATUP"];
let pushupSequence = ["PUSHUP", "PUSHDOWN", "PUSHUP"];

let currentSequence;
let History = [];
let currentReps = 0;
let currPose;
let prevPose = "null";

function examineReps() {
  //TODO @Nimra we cneed to check for the 10 seconds countdown

  //TODO @Nimra : time start and time end
  //START TIMER END TIMER HAVE TO MAKE SURE THATS THERE

  //this condtition may increase with the addition rep-based of exercises
  if (currentExercise == "Bodyweight Squat") {
    currentSequence = squatSequence;
  } else {
    currentSequence = pushupSequence;
  }
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
          alert("Exercise Completed! Moving on to the next one.");
          //TODO @Nimra end the timer
          //TODO #Nimra feed in the data in the CompletedStats object
          nextExercise(exerciseIndex);
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
