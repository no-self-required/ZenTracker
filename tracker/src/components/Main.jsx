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

//when timer hits 0, sound alarm, and switch button to "OK" that stops alarm.

function Main() {
  const TIMER_STATES = {
    INITIAL: 0,
    STARTED: 1,
    STOPPED: 2,
    EDIT: 3,
    FINISHED: 4,
  };

  const [totalSeconds, setTotalSeconds] = useState(300);
  const [initialTime, setInitialTime] = useState({
    current: 500,
    prevTime: 500
  });
  const [intervalID, setIntervalID] = useState();
  const [timerState, setTimerState] = useState(TIMER_STATES["INITIAL"]);

  useEffect(() => {
    if (timerState === TIMER_STATES["STARTED"] && !intervalID) {
      const intervalID = setInterval(decrementTotalSeconds, 1000);
      setIntervalID(intervalID);
    }
  }, [timerState, intervalID]);

  //start from default || start from stop || start from edit 

  //RESET> EDIT> start with new intial time IF NEW INPUT IS LESS THAN CURRENT TIMER > works ******
  //Need to figure out logic to start timer from new initial state > AFTER timer has been started

  function startTimer() {
    const calculated = calculateSeconds(initialTime.current);
    //if initial time has already started
    if (timerState === TIMER_STATES["EDIT"]) {
      console.log("START FROM EDIT STATE");
      // if totalSeconds less than calculated (initial time in seconds) : then start from current timer 
      // this logic doesnt make sense because it doesnt account for new initial timer > current timer
      // need this logic to run if NO NEW initial input
      // if (totalSeconds < calculated) 


      if (initialTime.current === initialTime.prevTime) { //check this logic out
        console.log("Start from current initial time")
        setTotalSeconds(totalSeconds); //start from current timer
        setTimerState(TIMER_STATES["STARTED"]);         
        return
      } else { //need logic to account for: ANY new initial input > start from that input
        //logic to start from new initial input
        console.log("START FROM EDIT WITH NEW INITIAL INPUT")
        setTotalSeconds(calculated);
        // setTimerState(TIMER_STATES["INITIAL"]);
        setTimerState(TIMER_STATES["STARTED"]);
         //start from initial timer / new input
        return;
      }
    } else if (timerState === TIMER_STATES["STOPPED"]) {
      console.log("START FROM STOPPED STATE")
      setTimerState(TIMER_STATES["STARTED"]);
      return;
    } else if (timerState === TIMER_STATES["INITIAL"]) {
      console.log("START FROM INITIAL STATE")
      setTimerState(TIMER_STATES["STARTED"]);
      setTotalSeconds(calculated);
    }
  }

  function stopTimer() {
    console.log("ENTER STOP STATE")
    setTimerState(TIMER_STATES["STOPPED"]);
    clearInterval(intervalID);
    setIntervalID(undefined);
  }

  function stopAlarm() {}

  function editTimerState() {
    console.log("ENTER EDIT STATE")
    console.log("INIT CURRENT", initialTime.current)
    console.log("INIT PREV", initialTime.prevTime)
    setTimerState(TIMER_STATES["EDIT"]);
    console.log("initial time from EDIT STATE", initialTime.current)

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
    console.log("[resetTimer] initial time", initialTime.current);
    console.log("ENTER INITIAL STATE");
    setTimerState(TIMER_STATES["INITIAL"]);
    clearInterval(intervalID);
    setIntervalID(undefined);
    const initialTimeInSeconds = calculateSeconds(initialTime.current);
    setTotalSeconds(initialTimeInSeconds);
  }
  
  
  //if input is an empty string, continue from current initial time *Dec 4*
  //input value should reflect current timer when clicked
  //need to manipulate input value to show current time 
  //Need to only accept numbers for input

  function handleChange(event) {
    // console.log("evt target value from handleChange", event.target.value)
    // if (event.target.value === "") {
    //   setInitialTime(initialTime)
    // } else {
    setInitialTime((prevInitialTime) => {
      return {
        current: event.target.value,
        prevTime: prevInitialTime.current
      }
    })
    console.log("handlechange check", initialTime)
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
    return formatted;
  }

  //add rendering logic: show initial timer, on click: edit timer
  //disable reset button if timer is not running

  //if timer is running, clicking timer will enter edit timer state

  //if timer is clicked, pause and hide timer and show timer input. AS OPPOSED to hiding input / changing focus to input

  
  const formattedTime = displayTime();
  return (
    <div className="timer-container">
      {timerState === TIMER_STATES["EDIT"] && (
        <input
          type="text"
          id="timer"
          name="timer"
          maxLength="6"
          onChange={handleChange}
        ></input>
      )}
      {totalSeconds && <div onClick={editTimerState}>{formattedTime}</div>}
      {(timerState === TIMER_STATES["INITIAL"] ||
        timerState === TIMER_STATES["STOPPED"] ||
        timerState === TIMER_STATES["EDIT"]) && (
        <button onClick={startTimer}>Start</button>
      )}
      {timerState === TIMER_STATES["STARTED"] && (
        <button onClick={stopTimer}>Stop</button>
      )}
      {timerState === TIMER_STATES["FINISHED"] && (
        <button onClick={stopAlarm}>Ok</button>
      )}
      <button onClick={resetTimer}>Reset</button>
    </div>
  );
}

export default Main;
