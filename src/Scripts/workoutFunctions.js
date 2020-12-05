//WE GET THE CURRENT EXWECISE FROM THE WORKOUT OBJECT -> workout object will be gotten by vishal sending in the parameter
let currentWorkout;
let exercises;
let currentExercise;
let currentExerciseUNIT;
let currentExerciseGoal;
let restInterval = 10;

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
  //countdown is going to come here

  reset();
  document.getElementById("currentExercise").innerHTML = Exercise.name;
  document.getElementById("totalRep").innerHTML = Exercise.value;
  currentExercise = Exercise.name;
  //TODO @Vishal send the var 'currentName' to the database

  currentReps = 0;
  currentExerciseGoal = Exercise.value;
  //TODO @Vishal send the var 'currentExerciseGoal' to the database

  currentExerciseUNIT = Exercise.unit;
  updateProgress();
}
//happens during the workout after every rep is counted or every second is passed
function updateProgress() {
  //TODO @Vishal send the var 'currentReps' to the database
  if (currentExerciseUNIT == "REPS") {
    document.getElementById("currentRep").innerHTML = currentReps;
  } else {
    let s = getsecond();
    document.getElementById("currentRep").innerHTML = s;
  }
}

function nextExercise(exerciseIndex) {
  exerciseIndex++;
  if (exerciseIndex != exercises.length) {
    updateExerciseInfo(exercises[exerciseIndex]);
    reset();
    timeStarted = false;
    timeTaken = 0;
  } else {
    sessionComplete = true;
    endSession();
  }
}
