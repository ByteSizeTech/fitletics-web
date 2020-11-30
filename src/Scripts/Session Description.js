function startTimer(duration, display) {
  var timer = duration,
    minutes,
    seconds,
    milliseconds;
  setInterval(function () {
    minutes = parseInt(timer / 60, 10);
    seconds = parseInt(timer % 60, 10);
    milliseconds = parseInt(seconds / 1000);

    minutes = minutes < 10 ? "0" + minutes : minutes;
    seconds = seconds < 10 ? "0" + seconds : seconds;
    milliseconds = milliseconds < 10 ? "0" + milliseconds : milliseconds;

    display.textContent = minutes + ":" + seconds + "." + milliseconds;

    if (--timer < 0) {
      timer = duration;
    }
  }, 1000);
}

window.onload = function () {
  var thirtyMinutes = 60 * 30,
    display = document.querySelector("#time");
  startTimer(thirtyMinutes, display);
};
