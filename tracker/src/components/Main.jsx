import React, { useState, useEffect } from "react";
import "../styling/main.scss";

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
  const [intervalID, setIntervalID] = useState();
  const [timerState, setTimerState] = useState(TIMER_STATES["INITIAL"]);
  const [inputTimer, setInputTimer] = useState(initialTime);

  useEffect(() => {
    if (timerState === TIMER_STATES["STARTED"] && !intervalID) {
      const intervalID = setInterval(decrementTotalSeconds, 1000);
      setIntervalID(intervalID);
    }
  }, [timerState, intervalID]);

  function startTimer() {
    const calculated = calculateSeconds(initialTime);
    const newInputTimer = calculateSeconds(inputTimer)
    //if initial time has already started
    if (timerState === TIMER_STATES["EDIT"]) {
      console.log("START FROM EDIT STATE");
        //logic to start from new initial input
        console.log("START FROM EDIT WITH NEW INITIAL INPUT");
        setTotalSeconds(newInputTimer);
        setTimerState(TIMER_STATES["STARTED"]);
        return;
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
    displayInputValue();
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
 
  const inputId = document.getElementById("timer");
  
  if (document.getElementById("timer")) {
    inputId.addEventListener("keyup", function onEvent(e) {
      if (e.key === "Enter") {
        startTimer();
      }
    });
  }

  //input overflow working correctly
  //default value not wokring correctly
  //when timer is started, then enter edit state, default value goes to initial timer rather than current timer.
  //issues with string vs integer input
  //use setState to change value

  function handleChange(event) {
    let timerInput = event.target.value
    console.log("TYPE", typeof timerInput)
    while (timerInput.length > 6) {
      timerInput = timerInput.substring(1)
      console.log("check timerInput", timerInput)
    }
    setInputTimer(timerInput);
    setInitialTime(timerInput);
  }

  //use timerInput to set and display new input value

  //take totalseconds and set new input
  function displayInputValue() {
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

    setInputTimer(formatted.join(''))
  }

  // function handleInput(e) {
  //   // e.target.value = e.target.value.slice(0)
  //   // let inputValue = e.target.value
  //   // if (inputValue.length > 6) {
  //   //   inputValue.substring(1)
  //   // }
  // }

  //display necessary 00's. ex: 2m 00s
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
            // onInput={handleInput}
            // defaultValue={newInput}
            value={inputTimer}
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
