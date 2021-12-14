import React, { useState, useEffect } from "react";
import "../styling/main.scss";

//import Hind Madurai font

//add rendering logic to only show the right amount of time. ex: if there are 0hours, dont display
//add logic for finished timer (0seconds)

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

//todo: when timer hits 0, sound alarm, and switch button to "OK" that stops alarm.

function Main() {
  const TIMER_STATES = {
    INITIAL: 0,
    STARTED: 1,
    STOPPED: 2,
    EDIT: 3,
    FINISHED: 4,
  };

  const [totalSeconds, setTotalSeconds] = useState(300);
  const [initialTime, setInitialTime] = useState(500);
  const [prevTime, setPrevTime] = useState();
  const [intervalID, setIntervalID] = useState();
  const [timerState, setTimerState] = useState(TIMER_STATES["INITIAL"]);

  useEffect(() => {
    if (timerState === TIMER_STATES["STARTED"] && !intervalID) {
      const intervalID = setInterval(decrementTotalSeconds, 1000);
      setIntervalID(intervalID);
    }
  }, [timerState, intervalID]);

  function startTimer() {
    const calculated = calculateSeconds(initialTime);
    setPrevTime(initialTime);
    //if initial time has already started
    if (timerState === TIMER_STATES["EDIT"]) {
      console.log("START FROM EDIT STATE");
      // need this logic to run if NO NEW initial input
      if (prevTime === initialTime) {
        setTotalSeconds(totalSeconds); //start from current timer
        setTimerState(TIMER_STATES["STARTED"]);
        return;
      } else {
        //logic to start from new initial input
        console.log("START FROM EDIT WITH NEW INITIAL INPUT");
        setTotalSeconds(calculated);
        setTimerState(TIMER_STATES["STARTED"]);
        return;
      }
    } else if (timerState === TIMER_STATES["STOPPED"]) {
      console.log("START FROM STOPPED STATE");
      setTimerState(TIMER_STATES["STARTED"]);
      return;
    } else if (timerState === TIMER_STATES["INITIAL"]) {
      console.log("START FROM INITIAL STATE");
      setTimerState(TIMER_STATES["STARTED"]);
      setTotalSeconds(calculated);
    }
  }

  function stopTimer() {
    console.log("ENTER STOP STATE");
    setTimerState(TIMER_STATES["STOPPED"]);
    clearInterval(intervalID);
    setIntervalID(undefined);
  }

  function stopAlarm() {}

  function editTimerState() {
    console.log("ENTER EDIT STATE");
    setTimerState(TIMER_STATES["EDIT"]);
    console.log("initial time from EDIT STATE", initialTime);
    clearInterval(intervalID);
    setIntervalID(undefined);
  }

  function decrementTotalSeconds() {
    setTotalSeconds((prevSeconds) => {
      if (prevSeconds === 0) {
        setTimerState(TIMER_STATES["FINISHED"]);
        return prevSeconds;
      }
      return prevSeconds - 1;
    });
  }

  function resetTimer() {
    console.log("[resetTimer] initial time", initialTime);
    console.log("ENTER INITIAL STATE");
    setTimerState(TIMER_STATES["INITIAL"]);
    clearInterval(intervalID);
    setIntervalID(undefined);
    const initialTimeInSeconds = calculateSeconds(initialTime);
    setTotalSeconds(initialTimeInSeconds);
  }

  
  //very important for UX. ensures there is never an empty input
  //possibly: if max length, and user inputs additonal number, shift numbers to left. replace first digit with the second.
  //ex: 12, 42, 53 > 24, 25, 3(6 = new number)
  
  const inputId = document.getElementById("timer");
  
  if (document.getElementById("timer")) {
    inputId.addEventListener("keyup", function onEvent(e) {
      if (e.key === "Enter") {
        startTimer();
      }
    });
  }

  function handleChange(event) {
    setInitialTime(event.target.value);
    console.log("handlechange check", initialTime);
  }

  //display 00's. ex: 2m 00s
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

    // correct logic for timer input
    // need to remove unncessary 0's for timer display
    if (showHours !== 0) {
      if (showHours.toString().length === 1) {
        formatted.push("0" + showHours)
        console.log("length === 1 trigger check")
      } else {
        formatted.push(showHours);
      }
    } else if (showHours === 0) {
      formatted.push("00")
    }

    if (showMin !== 0) {
      if (showMin.toString().length === 1) {
        formatted.push("0" + showMin)
      } else {
        formatted.push(showHours);
      }  
    } else if (showMin === 0) {
      formatted.push("00")
    }
    
    if (showSec !== 0) {
      if (showSec.toString().length === 1) {
        formatted.push("0" + showSec)
      } else {
        formatted.push(showSec);
      }  
    } else if (showSec === 0) {
      formatted.push("00")
    }

    console.log("formatted", formatted)
    return formatted;
  }



  //disable reset button if timer is not running

  //add rendering logic: show initial timer, on click: edit timer
  //if timer is clicked, pause and hide timer and show timer input. AS OPPOSED to hiding input / changing focus to input

  const formattedTime = displayTime();
  const newInput = formattedTime.join('')

  
  return (
    <div className="container">
      <div className="timer-container">
        {timerState === TIMER_STATES["EDIT"] && (
          <input
            type="number"
            id="timer"
            name="timer"
            onInput={(e) => e.target.value = e.target.value.slice(0, 6)}
            defaultValue={newInput}
            onChange={handleChange}
          ></input>
        )}
        <div>
          {totalSeconds && (
            <div id="absolute-timer" onClick={editTimerState}>
              {formattedTime}
            </div>
          )}
          {(timerState === TIMER_STATES["INITIAL"] ||
            timerState === TIMER_STATES["STOPPED"] ||
            timerState === TIMER_STATES["EDIT"]) && (
            <button id="start-button" onClick={startTimer}>
              Start
            </button>
          )}
          {timerState === TIMER_STATES["STARTED"] && (
            <button id="stop-button" onClick={stopTimer}>
              Stop
            </button>
          )}
          {timerState === TIMER_STATES["FINISHED"] && (
            <button id="ok-button" onClick={stopAlarm}>
              Ok
            </button>
          )}
          <button id="reset-button" onClick={resetTimer}>
            Reset
          </button>
        </div>
      </div>
    </div>
  );
}

export default Main;
