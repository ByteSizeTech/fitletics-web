//make sure workout Duration is in seconds
function updateUserXP(workoutDuration){
    var XPgained = workoutDuration
    // console.log(XPgained)
    //TODO: @Vishal add a database call that updates the XP in the DB
}

// updateUserXP(100)

function calcMinAndMaxXP(level){
    var max = ((100*(Math.pow(level,2)))/2)-1;
    var min = ((100*(Math.pow(level-1,2)))/2);
    var output = [min, max]
    // console.log(output)

    return output
}

// for(i=1;i<=10;i++){
//     calcMinAndMaxXP(i)
// }

function calcLevel(xp){
    var level = Math.floor(((Math.sqrt((xp*2.0)/100.0)))+1);
    // console.log(xp, level)

    return level
}

// for(i=1;i<=10;i++){
//     xp = i*200
//     calcLevel(xp)
// }

function returnExperienceProgress(){
    //TODO: @Vishal get the user's XP from the database here
    var xp = 100
    
    var output = new Map()
    
    var level = calcLevel(xp)
    output.set("Level", level)

    var min = calcMinAndMaxXP(level)[0];
    var max = calcMinAndMaxXP(level)[1];

    var difference = max-min;
    var percentageComplete = Math.floor(((xp-min)/difference)*100);
    output.set("Percentage", percentageComplete)

    var xpDisplay = xp + "/" + (max+1) + " XP";
    output.set("XP", xpDisplay)

    // console.log(output)

    return output
}

// for(i=1;i<=10;i++){
//     xp = i*200
//     returnExperienceProgress(xp)
// }