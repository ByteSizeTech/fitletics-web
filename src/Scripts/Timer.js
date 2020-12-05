//manipulating the div with id timer
var hours = 0;
var mins = 0;
var seconds = 0;
// let timex;
//RESET TIMER
function reset() {
  hours = 0;
  mins = 0;
  seconds = 0;
  $("#hours", "#mins").html("00:");
  $("#seconds").html("00");
}

//stop timer
function stopTimer() {
  clearTimeout(timex);
}

//startTimer()
function startTimer() {
  timex = setTimeout(function () {
    seconds++;
    if (seconds > 59) {
      seconds = 0;
      mins++;
      if (mins > 59) {
        mins = 0;
        hours++;
        if (hours < 10) {
          $("#hours").text("0" + hours + ":");
        } else $("#hours").text(hours + ":");
      }

      if (mins < 10) {
        $("#mins").text("0" + mins + ":");
      } else $("#mins").text(mins + ":");
    }

    if (seconds < 10) {
      $("#seconds").text("0" + seconds);
    } else {
      $("#seconds").text(seconds);
    }

    startTimer();
  }, 1000);
}

//countdown

function countdown(duration, display) {
  var timer = duration,
    minutes,
    seconds;
  setInterval(function () {
    minutes = parseInt(timer / 60, 10);
    seconds = parseInt(timer % 60, 10);

    minutes = minutes < 10 ? "0" + minutes : minutes;
    seconds = seconds < 10 ? "0" + seconds : seconds;

    display.textContent = seconds;

    if (--timer < 0) {
      timer = 0;
      display.textContent = 00;
    }
  }, 1000);
}

// function startTimer(duration, display) {
//   var timer = duration,
//     minutes,
//     seconds;
//   setInterval(function () {
//     minutes = parseInt(timer / 60, 10);
//     seconds = parseInt(timer % 60, 10);

//     minutes = minutes < 10 ? "0" + minutes : minutes;
//     seconds = seconds < 10 ? "0" + seconds : seconds;

//     display.textContent = minutes + ":" + seconds;

//     if (--timer < 0) {
//       timer = duration;
//     }
//   }, 1000);
// }

// window.onload = function () {
//   var fiveMinutes = 60 * 5,
//     display = document.querySelector("#time");
//   startTimer(fiveMinutes, display);
// };
// var myTimer;
// //c=10
// function clock(c) {
//   myTimer = setInterval(myClock, 1000);

//   function myClock() {
//     document.getElementById("time").innerHTML = --c;
//     // if (c == 0) {
//     //   clearInterval(myTimer);
//     //   alert("Reached zero");
//     // }
//   }
// }
