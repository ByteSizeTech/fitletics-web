//REP COUNTING
let squatSequence = ["SQUATUP", "SQUATDOWN", "SQUATUP"];
let History = [];
let currentReps = 0;
let userGoal;
let currPose;
let prevPose = "null";

//testing data
userGoal = 7;

function examineReps() {
  //START TIMER END TIMER HAVE TO MAKE SURE THATS THERE
  currPose = poseLabel;
  var count = 0;
  if (currPose != prevPose) {
    console.log(History);
    History.push(poseLabel);
    prevPose = currPose;
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

    console.log("hist length: " + History.length);
    console.log("squat length: " + squatSequence.length);
    if (History.length >= squatSequence.length) {
      var historyIndex = History.length - squatSequence.length;
      console.log("history" + historyIndex);

      //now we will go over the last three in history matching with the squat sequence
      for (var index = 0; index < squatSequence.length; index++) {
        console.log("squat Index" + index);
        console.log("squat[index] : " + squatSequence[index]);
        console.log("History[histind] : " + History[historyIndex]);

        if (squatSequence[index] == History[historyIndex]) {
          console.log(count);
          count++;
        } else {
          return;
        }
        historyIndex++;
      }
      if (count == 3) {
        currentReps++;
      }
    }
  }
  console.log(currentReps);
}
