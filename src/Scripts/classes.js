class Muscle {
  constructor(name) {
    this.name = name;
    this.maleIntensity = null;
    this.femaleIntensity = null;
  }
}

class Exercise {
  constructor(
    name,
    unit,
    value,
    difficulty,
    description,
    link,
    targetMuscles,
    harderExercise,
    easierExercise,
    timePerRep
  ) {
    this.name = name;
    this.unit = unit;
    this.value = value;
    this.difficulty = difficulty;
    this.description = description;
    this.link = link;
    this.targetMuscles = targetMuscles;
    this.harderExercise = harderExercise;
    this.easierExercise = easierExercise;
    this.timePerRep = timePerRep;
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
  constructor(exerciseName, timeTaken, repsDone) {
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
    this.caloriesBurned = 1;
  }
}
