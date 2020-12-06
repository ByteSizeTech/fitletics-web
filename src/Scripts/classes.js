class Muscle {
  constructor(name, maleIntensity, femaleIntensity) {
    this.name = name;
    this.maleIntensity = maleIntensity;
    this.femaleIntensity = femaleIntensity;
  }
  // constructor(name) {
  //   this.name = name;
  //   this.maleIntensity = maleIntensity;
  //   this.femaleIntensity = femaleIntensity;
  // }
}

class Exercise {
  constructor(
    name,
    unit,
    value,
    difficulty,
    link,
    targetMuscles,
    harderExercise,
    easierExercise,
    timePerRep,
    description
  ) {
    this.name = name;
    this.unit = unit;
    this.value = value;
    this.difficulty = difficulty;
    this.link = link;
    this.targetMuscles = targetMuscles;
    this.harderExercise = harderExercise;
    this.easierExercise = easierExercise;
    this.timePerRep = timePerRep;
    this.description = description;
  }
}

class Workout {
  constructor(name, exerciseList, level, difficulty, time) {
    this.name = name;
    this.exerciseList = exerciseList;
    this.difficulty = difficulty;
    this.time = time;
    this.level = level;
  }
}

class ExerciseStat {
  constructor(exerciseName, timeTaken = 0, repsDone = 0) {
    this.exerciseName = exerciseName;
    this.timeTaken = timeTaken;
    this.repsDone = repsDone;
  }
}

class Session {
  constructor(workout, timeTaken, dateCompleted, completedStats) {
    this.workout = workout;
    this.timeTaken = timeTaken;
    this.dateCompleted = dateCompleted;
    this.completedStats = completedStats;
    this.caloriesBurned = null;
  }

  calculateCaloriesBurned() {
    //TODO: @Aadi test this once workouts are added in the DB

    var userWeight = 69; //TODO: @Vishal replace this with DB call
    this.caloriesBurned = 0;

    for (var i = 0; i < this.workout.exerciseList.length; i++) {
      var exerciseDuration = 0;
      var MET;

      switch (this.workout.exerciseList[i].difficulty) {
        case "Easy":
          MET = 5;
          break;
        case "Medium":
          MET = 8;
          break;
        case "Hard":
          MET = 10;
          break;
        default:
          MET = 6;
          break;
      }

      if (this.workout.exerciseList[i].unit === "SECS") {
        exerciseDuration = this.completedStats[i].timeTaken;
      } else {
        exerciseDuration =
          this.completedStats[i].repsDone *
          this.workout.exerciseList[i].timePerRep;
      }

      this.caloriesBurned += Math.floor(
        ((exerciseDuration / 60) * (MET * 3.5 * userWeight)) / 200
      );
    }

    return this.caloriesBurned;
  }
}
