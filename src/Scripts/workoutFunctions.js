//WE GET THE CURRENT EXWECISE FROM THE WORKOUT OBJECT -> workout object will be gotten by vishal sending in the parameter
let exercises;

let currentExercise;
let currentExerciseUNIT;
let currentExerciseGoal;

// let currentExerciseStat = null;
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

function initializeCompletedStat() {
  for (let index = 0; index < exercises.length; index++) {
    let name = exercises[index].name;
    //TODO Add check for time based exercise. Init as repsdone = 1
    completedStats[index] = new ExerciseStat(name, 0, 0);

    //Initializing currentExcrciseStatJSON objects for database
    currentExerciseStatJSON = {};
    currentExerciseStatJSON.exerciseName = name;
    currentExerciseStatJSON.timeTaken = 0;
    currentExerciseStatJSON.repsDone = 0;
    completedStatsJSON[`ex${index}`] = currentExerciseStatJSON;
  }
  console.log("Completed stats initialized as", completedStatsJSON);
}

function endSession() {
  // sessionComplete = true;
  reset();
  session.workout = currentWorkout;
  sessionJSON.workout = workoutJSON;

  session.timeTaken = totalSessionTime;
  sessionJSON.timeTaken = totalSessionTime;
  //TODO DATE COMPLETED FUNCTION?
  var today = new Date();
  var date =
    today.getDate() + "/" + (today.getMonth() + 1) + "/" + today.getFullYear();
  session.dateCompleted = date;
  sessionJSON.dateCompleted = date;

  session.completedStats = completedStats;
  sessionJSON.completedStats = completedStatsJSON;

  session.caloriesBurned = session.calculateCaloriesBurned();
  sessionJSON.caloriesBurned = session.calculateCaloriesBurned();

  console.log(session);
  console.log(sessionJSON);

  populateSessioninUser(sessionJSON);
}
//happens only at the start
function updateSessionInfo() {
  document.getElementById("workout-name").innerHTML = currentWorkout.name;
}

//happens when the user moves from one exercise to another: takes in the parameter of exercise object that comes next in line
//this func wont be called if all the exercises are completed, in that case endSession would be triggered
function updateExerciseInfo(ExerciseParam) {
  //CREATING a new EXERCISE STAT FOR EACH Exercise
  // currentExerciseStat = null;
  // currentExerciseStatJSON = {};
  // currentExerciseStat = new ExerciseStat();
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

let prevSecond = null;
//happens during the workout after every rep is counted or every second is passed
function updateProgress() {
  //TODO @Vishal send the var 'currentReps' to the database
  if (currentExerciseUNIT == "REPS") {
    updatecurrExerciseNameProgress(currentReps);
    document.getElementById("currentRep").innerHTML = currentReps;
  } else {
    let s = getSeconds();
    document.getElementById("currentRep").innerHTML = s;
    if (prevSecond != s) {
      updatecurrExerciseNameProgress(s.toString());
    }
    prevSecond = s;
  }
}

function nextExercise() {
  //TODO BEFORE MOVING ON TO THE NEXT EXERCISE
  //we may need to add things here like initialising teh completed stat for the prev exercise
  timeTaken = getSeconds();
  console.log("Completed stat:", completedStats[exerciseIndex]);
  console.log("exercise index:", exerciseIndex);

  completedStats[exerciseIndex].time = timeTaken;
  completedStats[exerciseIndex].repsDone = currentReps;
  // currentExerciseStatJSON.exerciseName = currentExercise;
  // currentExerciseStatJSON.timeTaken = timeTaken;
  // currentExerciseStatJSON.repsDone = currentReps;

  // completedStats.push(currentExerciseStat);
  console.log(
    "in next: before ex",
    exerciseIndex,
    "csj=",
    completedStatsJSON[`ex${exerciseIndex}`]
  );

  completedStatsJSON[`ex${exerciseIndex}`].timeTaken = timeTaken;
  completedStatsJSON[`ex${exerciseIndex}`].repsDone = currentReps;

  console.log(
    "in next: after ex",
    exerciseIndex,
    "csj=",
    completedStatsJSON[`ex${exerciseIndex}`]
  );

  //1) push currentExerciseStat to completed stat
  //2) totalSessionTime+=timeTaken;
  totalSessionTime += timeTaken;

  console.log("NEXTING THE EXERCISE");
  // console.log(exerciseIndex);

  // ex.length = 2
  //
  // if (exerciseIndex < exercises.length - 1) {
  // exerciseIndex++;
  // }

  //ex index=0

  exerciseIndex++;
  //exindes=1
  //1!=2
  if (exerciseIndex != exercises.length) {
    updateExerciseInfo(exercises[exerciseIndex]);
  } else {
    sessionComplete = true;
    endSession();
  }
}
