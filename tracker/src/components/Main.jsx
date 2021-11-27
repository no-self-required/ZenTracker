import React, { useState, useEffect } from "react";

//add rendering logic to only show the right amount of time. ex: if there are 0hours, dont display
// add logic for finished timer (0seconds)
function splitInput(initialTime) {
  const parsedTimer = parseInt(initialTime);
  const arr = Array.from(parsedTimer.toString()).map(Number);
  if (arr.length <= 5) {
    const padAmount = 6 - arr.length;
    const arr2 = [...Array(padAmount).fill(0), ...arr];
    return arr2;
  }
  return arr;
}

function calculateSeconds(initialTime) {
  const splitArr = splitInput(initialTime);
  const seconds = [];
  const minutes = [];
  const hours = [];
  hours.push(splitArr[0], splitArr[1]);
  minutes.push(splitArr[2], splitArr[3]);
  seconds.push(splitArr[4], splitArr[5]);
  const totSec = seconds[0] * 10 + seconds[1];
  const totMin = minutes[0] * 600 + minutes[1] * 60;
  const totHours = hours[0] * 36000 + hours[1] * 3600;
  const calculatedTotalSeconds = totSec + totMin + totHours;
  return calculatedTotalSeconds;
}

function Main() {
  const TIMER_STATES = {
    INITIAL: 0,
    STARTED: 1,
    STOPPED: 2,
    FINISHED: 3,
  };

  const [totalSeconds, setTotalSeconds] = useState();
  const [initialTime, setInitialTime] = useState(500);
  const [intervalID, setIntervalID] = useState();
  const [timerState, setTimerState] = useState(TIMER_STATES["INITIAL"]);

  useEffect(() => {
    if (timerState === TIMER_STATES["STARTED"] && !intervalID) {
      console.log("Internal started.");
      const intervalID = setInterval(decrementTotalSeconds, 1000);
      setIntervalID(intervalID);
    }
  }, [timerState, intervalID]);

  function startTimer() {
    console.log("[startTimer] timer started");
    const calculated = calculateSeconds(initialTime);
    //if tot seconds != init time in seconds > timer has been already run
    if (timerState === TIMER_STATES["STOPPED"]) {
      setTimerState(TIMER_STATES["STARTED"]);
      return;
    }
    setTimerState(TIMER_STATES["STARTED"]);
    setTotalSeconds(calculated);
  }

  function stopTimer() {
    setTimerState(TIMER_STATES["STOPPED"]);
    clearInterval(intervalID);
    setIntervalID(undefined);
  }

  function decrementTotalSeconds() {
    setTotalSeconds((prevSeconds) => {
      console.log({ prevSeconds });
      return prevSeconds - 1;
    });
  }

  function resetTimer() {
    console.log("[resetTimer] initial time", initialTime);
    setTimerState(TIMER_STATES["STOPPED"]);
    clearInterval(intervalID);
    setIntervalID(undefined);
    const initialTimeInSeconds = calculateSeconds(initialTime);
    setTotalSeconds(initialTimeInSeconds);
  }

  function handleChange(event) {
    setInitialTime(event.target.value);
  }

  function displayTime() {
    let formatTime = totalSeconds;
    let showHours = 0;
    let showMin = 0;
    let showSec = 0;
    let formatted = [];
    while (formatTime >= 3600) {
      showHours += 1;
      formatTime -= 3600;
    }

    while (formatTime >= 60) {
      showMin += 1;
      formatTime -= 60;
    }

    if (formatTime < 60) {
      showSec = formatTime;
    }
    formatted.push(showHours);
    formatted.push(showMin);
    formatted.push(showSec);
    console.log("formatted time", formatted);
    return formatted;
  }
  
  //add rendering logic: show initial timer, on click: edit timer
  //disable reset button if timer is not running
  //if timer is running, clicking timer will enter edit timer state
  
  const formattedTime = displayTime();
  return (
    <div>
      <input
        type="text"
        id="timer"
        name="timer"
        maxLength="6"
        onChange={handleChange}
      ></input>
      {totalSeconds && <div>{formattedTime}</div>}
      {(timerState === TIMER_STATES["INITIAL"] ||
        timerState === TIMER_STATES["STOPPED"]) && (
        <button onClick={startTimer}>Start</button>
      )}
      {timerState === TIMER_STATES["STARTED"] && (
        <button onClick={stopTimer}>Stop</button>
      )}
      <button onClick={resetTimer}>Reset</button>
    </div>
  );
}

export default Main;
