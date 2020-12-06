function findMainTargetMuscle(exercise){
    var affectedMuscles = exercise.targetMuscles
    var mainTargetMuscle;
    var topIntensity = 0;
    for (i=0; i<affectedMuscles.length; i++){
        if (affectedMuscles[i].maleIntensity > topIntensity) {
            mainTargetMuscle = affectedMuscles[i].name
            topIntensity = affectedMuscles[i].maleIntensity
        }
    }
    return mainTargetMuscle
}

//calculates the fitness score for each muscle group after a session
function calculateFitnessScore (session){
    var upperScore = 0, coreScore = 0, lowerScore = 0
    var upperCount = 0, lowerCount = 0, coreCount = 0

    for (let i = 0; i < session.workout.exerciseList.length; i++) {
        var exercise = session.workout.exerciseList[i]
        var completedStat = session.completedStats[i]
        var targetMuscle = findMainTargetMuscle(exercise)
        console.log(targetMuscle)
        var difficulty = exercise.difficulty

        var difference;
        
        switch (targetMuscle){
            case 'Upper':
                upperCount++
                switch (difficulty){
                    case 'Easy':
                        if (exercise.unit == 'SECS'){
                            difference = exercise.value - completedStat.timeTaken
                            if (difference >= 0) upperScore += 3/10
                            else {
                                upperScore += ((difference * 3)/exercise.value)/10
                            }
                        }
                        else {
                            difference = exercise.value - completedStat.repsDone
                            if (difference == 0) upperScore += 3/10
                            else {
                                upperScore += ((difference * 3)/exercise.value)/10
                            }
                        }
                        break
                    case 'Medium':
                        if (exercise.unit == 'SECS'){
                            difference = exercise.value - completedStat.timeTaken
                            if (difference >= 0) upperScore += 7/10
                            else {
                                upperScore += (3+((difference * 4)/exercise.value))/10
                            }
                        }
                        else {
                            difference = exercise.value - completedStat.repsDone
                            if (difference == 0) upperScore += 7/10
                            else {
                                upperScore += (3+((difference * 4)/exercise.value))/10
                            }
                        }
                        break
                    case 'Hard':
                        if (exercise.unit == 'SECS'){
                            difference = exercise.value - completedStat.timeTaken
                            if (difference >= 0) upperScore += 10/10
                            else {
                                upperScore += (7+((difference * 3)/exercise.value))/10
                            }
                        }
                        else {
                            difference = exercise.value - completedStat.repsDone
                            if (difference == 0) upperScore += 10/10
                            else {
                                upperScore += (7+((difference * 3)/exercise.value))/10
                            }
                        }
                        break   
                }
                break
            case 'Core':
                coreCount++
                switch (difficulty){
                    case 'Easy':
                        if (exercise.unit == 'SECS'){
                            difference = exercise.value - completedStat.timeTaken
                            if (difference >= 0) coreScore += 3/10
                            else {
                                coreScore += ((difference * 3)/exercise.value)/10
                            }
                        }
                        else {
                            difference = exercise.value - completedStat.repsDone
                            if (difference == 0) coreScore += 3/10
                            else {
                                coreScore += ((difference * 3)/exercise.value)/10
                            }
                        }
                        break
                    case 'Medium':
                        if (exercise.unit == 'SECS'){
                            difference = exercise.value - completedStat.timeTaken
                            if (difference >= 0) coreScore += 7/10
                            else {
                                coreScore += (3+((difference * 4)/exercise.value))/10
                            }
                        }
                        else {
                            difference = exercise.value - completedStat.repsDone
                            if (difference == 0) coreScore += 7/10
                            else {
                                coreScore += (3+((difference * 4)/exercise.value))/10
                            }
                        }
                        break
                    case 'Hard':
                        if (exercise.unit == 'SECS'){
                            difference = exercise.value - completedStat.timeTaken
                            if (difference >= 0) coreScore += 10/10
                            else {
                                coreScore += (7+((difference * 3)/exercise.value))/10
                            }
                        }
                        else {
                            difference = exercise.value - completedStat.repsDone
                            if (difference == 0) {
                                coreScore += 10/10
                                console.log('perf')
                            }
                            else {
                                coreScore += (7+((difference * 3)/exercise.value))/10
                            }
                        }
                        break 
                }
                break
            case 'Lower':
                lowerCount++
                switch (difficulty){
                    case 'Easy':
                        if (exercise.unit == 'SECS'){
                            difference = exercise.value - completedStat.timeTaken
                            if (difference >= 0) lowerScore += 3/10
                            else {
                                lowerScore += ((difference * 3)/exercise.value)/10
                            }
                        }
                        else {
                            difference = exercise.value - completedStat.repsDone
                            if (difference == 0) lowerScore += 3/10
                            else {
                                lowerScore += ((difference * 3)/exercise.value)/10
                            }
                        }
                        break
                    case 'Medium':
                        if (exercise.unit == 'SECS'){
                            difference = exercise.value - completedStat.timeTaken
                            if (difference >= 0) lowerScore += 7/10
                            else {
                                lowerScore += (3+((difference * 4)/exercise.value))/10
                            }
                        }
                        else {
                            difference = exercise.value - completedStat.repsDone
                            if (difference == 0) lowerScore += 7/10
                            else {
                                lowerScore += (3+((difference * 4)/exercise.value))/10
                            }
                        }
                        break
                    case 'Hard':
                        if (exercise.unit == 'SECS'){
                            difference = exercise.value - completedStat.timeTaken
                            if (difference >= 0) lowerScore += 10/10
                            else {
                                lowerScore += (7+((difference * 3)/exercise.value))/10
                            }
                        }
                        else {
                            difference = exercise.value - completedStat.repsDone
                            if (difference == 0) lowerScore += 10/10
                            else {
                                lowerScore += (7+((difference * 3)/exercise.value))/10
                            }
                        }
                        break 
                }
                break
        }
    }

    upperScore /= upperCount
    lowerScore /= lowerCount
    coreScore /= coreCount

    //TODO: @Vishal replace the zeroes with DB calls for the scores for each user
    var currentUpperScore = scores[0], currentCoreScore = scores[1], currentLowerScore = scores[2]

    upperScore = (currentUpperScore+upperScore)/2
    coreScore = (currentCoreScore+coreScore)/2
    lowerScore = (currentLowerScore+lowerScore)/2

    return [upperScore, coreScore, lowerScore]
}

//FOR TESTING

// c1 = new Muscle('Core', 10, 10)
// u1 = new Muscle('Upper', 15, 10)
// l1 = new Muscle('Lower', 20, 10)
// c2 = new Muscle('Core', 35, 10)
// u2 = new Muscle('Upper', 30, 10)
// l2 = new Muscle('Lower', 25, 10)
// c3 = new Muscle('Core', 35, 10)
// u3 = new Muscle('Upper', 40, 10)
// l3 = new Muscle('Lower', 10, 10)

// e1 = new Exercise('e1', 'SECS', 10, 'Easy', 'www.youtube.com', [c1, u1, l1], null, null, null, 'desc');
// e2 = new Exercise('e2', 'REPS', 10, 'Easy', 'www.youtube.com', [c2, u2, l2], e1, e1, null, 'desc');
// e3 = new Exercise('e3', 'SECS', 20, 'Easy', 'www.youtube.com', [c3, u3, l3], e1, e2, null, 'desc');
// e4 = new Exercise('e4', 'REPS', 10, 'Easy', 'www.youtube.com', [c2, u1, l3], e2, e3, 2, 'desc');
// e5 = new Exercise('e5', 'SECS', 30, 'Easy', 'www.youtube.com', [c1, u2, l3], e3, e1, null, 'desc');
// e6 = new Exercise('e6', 'REPS', 10, 'Easy', 'www.youtube.com', [c3, u2, l3], e4, e2, 3, 'desc');

// eList = [e1,e2,e3,e4,e5,e6]


// w = new Workout('w', eList, 'Beginner', 'Medium', '3000')

// c1 = new ExerciseStat('e1', 10, 1)
// c2 = new ExerciseStat('e2', 10, 10)
// c3 = new ExerciseStat('e3', 20, 1)
// c4 = new ExerciseStat('e4', 20, 10)
// c5 = new ExerciseStat('e5', 30, 1)
// c6 = new ExerciseStat('e6', 30, 10)

// stats = [c1,c2,c3,c4,c5,c6]

// s = new Session(w, 120, new Date(2020,12,1), stats)

// scores = [0,0,0]

// console.log(calculateFitnessScore(s))

// console.log(s.calculateCaloriesBurned())