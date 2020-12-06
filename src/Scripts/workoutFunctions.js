//WE GET THE CURRENT EXWECISE FROM THE WORKOUT OBJECT -> workout object will be gotten by vishal sending in the parameter
let exercises;

let currentExercise;
let currentExerciseUNIT;
let currentExerciseGoal;

let currentExerciseStat = null;
let currentExerciseStatJSON = {};
//for each exercise
let timeTaken = 0;
let currentReps = 0;
let timeStarted = false; //used to see if the time has already started for a given exercise
let restInterval = 10;

// function initializeWorkout(workout) {
//   currentWorkout = workout;
//   exercises = currentWorkout.exerciseList;
// }

function initializeWorkout(workout) {
  currentWorkout = workout;
  exercises = currentWorkout.exerciseList;
}

function endSession() {
  session.workout = currentWorkout;
  sessionJSON.workout = workoutJSON;

  session.timeTaken = totalSessionTime;
  sessionJSON.timeTaken = totalSessionTime;
  //TODO DATE COMPLETED FUNCTION?
  session.dateCompleted = "dd/mm/yy";
  sessionJSON.dateCompleted = "dd/mm/yy";

  session.completedStats = completedStats;
  sessionJSON.completedStats = completedStatsJSON;

  session.caloriesBurned = session.calculateCaloriesBurned();
  sessionJSON.caloriesBurned = session.calculateCaloriesBurned();

  console.log(session);
  console.log(sessionJSON);
  sessionComplete = true;
}
//happens only at the start
function updateSessionInfo() {
  document.getElementById("workout-name").innerHTML = currentWorkout.name;
}

//happens when the user moves from one exercise to another: takes in the parameter of exercise object that comes next in line
//this func wont be called if all the exercises are completed, in that case endSession would be triggered
function updateExerciseInfo(ExerciseParam) {
  //CREATING a new EXERCISE STAT FOR EACH Exercise
  currentExerciseStat = null;
  currentExerciseStatJSON = {};
  currentExerciseStat = new ExerciseStat();
  console.log(ExerciseParam);

  //RESETTING THINGS FOR A NEW EXERCISE
  reset();
  currentReps = 0;
  timeTaken = 0;
  timeStarted = false;

  //UPDATING THE PAGE
  document.getElementById("currentExercise").innerHTML = ExerciseParam.name;
  document.getElementById("totalRep").innerHTML = ExerciseParam.value;

  currentExercise = ExerciseParam.name;
  updatecurrExerciseNameListener(currentExercise);

  //TODO @Vishal send the var 'currentName' to the database

  currentExerciseGoal = ExerciseParam.value;
  updatecurrExerciseNameGoal(currentExerciseGoal);
  //TODO @Vishal send the var 'currentExerciseGoal' to the database

  currentExerciseUNIT = ExerciseParam.unit;
  updatecurrExerciseNameUnit(currentExerciseUNIT);

  updateProgress();
}

//happens during the workout after every rep is counted or every second is passed
function updateProgress() {
  //TODO @Vishal send the var 'currentReps' to the database
  if (currentExerciseUNIT == "REPS") {
    updatecurrExerciseNameProgress(currentReps);
    document.getElementById("currentRep").innerHTML = currentReps;
  } else {
    let s = getSeconds();
    document.getElementById("currentRep").innerHTML = s;
    //TODO @vishal if you want secs then this can be done here by sending s
  }
}

function nextExercise() {
  //TODO BEFORE MOVING ON TO THE NEXT EXERCISE
  //we may need to add things here like initialising teh completed stat for the prev exercise
  timeTaken = getSeconds();
  currentExerciseStat = new ExerciseStat(
    currentExercise,
    timeTaken,
    currentReps
  );
  currentExerciseStatJSON.exerciseName = currentExercise;
  currentExerciseStatJSON.timeTaken = timeTaken;
  currentExerciseStatJSON.repsDone = currentReps;

  completedStats.push(currentExerciseStat);
  completedStatsJSON[`ex${exerciseIndex}`] = currentExerciseStatJSON;

  //1) push currentExerciseStat to completed stat
  //2) totalSessionTime+=timeTaken;
  totalSessionTime += timeTaken;

  console.log("NEXTING THE EXERCISE");
  exerciseIndex++;
  // console.log(exerciseIndex);
  if (exerciseIndex != exercises.length) {
    updateExerciseInfo(exercises[exerciseIndex]);
  } else {
    sessionComplete = true;
    endSession();
  }
}
