//WE GET THE CURRENT EXWECISE FROM THE WORKOUT OBJECT -> workout object will be gotten by vishal sending in the parameter
let currentWorkout;
let exercises;
let currentExercise;
let currentExerciseUNIT;
let currentExerciseGoal;

function initializeWorkout(workout) {
  currentWorkout = workout;
  exercises = currentWorkout.exerciseList;
}

function endSession() {}
//happens only at the start
function updateSessionInfo() {
  document.getElementById("workout-name").innerHTML = currentWorkout.name;
}

//happens when the user moves from one exercise to another: takes in the parameter of exercise object that comes next in line
//this func wont be called if all the exercises are completed, in that case endSession would be triggered
function updateExerciseInfo(Exercise) {
  document.getElementById("currentExercise").innerHTML = Exercise.name;
  document.getElementById("totalRep").innerHTML = Exercise.value;
  currentExercise = Exercise.name;
  //TODO @Vishal send the var 'currentName' to the database

  currentReps = 0;
  currentExerciseGoal = Exercise.value;
  //TODO @Vishal send the var 'currentExerciseGoal' to the database

  currentExerciseUNIT = Exercise.unit;
  updateProgress();

  //TODO @Nimra initialize the timer thing to 10 seconds that will be counted down
}
//happens during the workout after every rep is counted or every second is passed
function updateProgress() {
  //TODO @Vishal send the var 'currentReps' to the database
  if (currentExerciseUNIT == "REPS") {
    document.getElementById("currentRep").innerHTML = currentReps;
  } else {
    //TODO @Nimra if the exercise is for time, how will we increase the timer
  }
}

function nextExercise(exerciseIndex) {
  exerciseIndex++;
  if (exerciseIndex != exercises.length) {
    updateExerciseInfo(exercises[exerciseIndex]);
  } else {
    sessionComplete = true;
    endSession();
  }
}
