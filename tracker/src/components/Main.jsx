import React, { useState, useEffect, useRef } from "react";
import "../styling/main.scss";

//store input length and value as state > input is invisible
//pass state into master component of input
//if length = 1, value = 1. > update single digit of seconds component to show.
//
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

  //take all three inputs, combine and calculate seconds
  //step 1: display timer based off input -- complete
  //step 2: set timer values based off display timer -- incomplete

  function startTimer() {

    let tripleInputArray = [inputTimerHour, inputTimerMinute, inputTimerSecond]
    let tripleCombined = tripleInputArray.join('');


    const calculated = calculateSeconds(initialTime);
    const newInputTimer = calculateSeconds(tripleCombined);
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
    fillZeros();
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

  //stretch: on fresh edit state: any new input will delete previous timer
  function handleChange(event) {
    let timerInput = event.target.value;
    while (timerInput.length > 6) {
      timerInput = timerInput.substring(1);
    }

    setInputTimer(timerInput);
    setInitialTime(timerInput);
  }

  //only accept numbers for timer input
  function numOnly(event) {
    if (!/[0-9]/.test(event.key)) {
      event.preventDefault();
    }
  }

  //take totalseconds and calculate display input
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

    formatted.push(showHours);
    formatted.push(showMin);
    formatted.push(showSec);

    return formatted;
  }

  //set input timer based on displayed timer //**** important: display timer > input timer */
  function fillZeros() {
    let input = displayInputValue();

    for (let i = 0; i < input.length; i++) {
      if (input[0] === 0) {
        input[0] = "00";
      } else if (input[0] !== 0 && input[0].toString().length === 1) {
        input[0] = "0" + input[0];
      }

      if (input[1] === 0) {
        input[1] = "00";
      } else if (input[1] !== 0 && input[1].toString().length === 1) {
        input[1] = "0" + input[1];
      }

      if (input[2] === 0) {
        input[2] = "00";
      } else if (input[2] !== 0 && input[2].toString().length === 1) {
        input[2] = "0" + input[2];
      }
    }
    setInputTimer(input.join(""));
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

    //add a zero before single digits
    for (let i = 0; i < formatted.length; i++) {
      if (formatted[i].toString().length === 1) {
        formatted[i] = "0" + formatted[i];
      }
    }
    return formatted;
  }

  /**
   * Split timer takes the display time which consists of an array of elements where each element is two digits representing either hours, minutes or seconds, and reformats it so that every digit is its own element in an array.
   *
   * For example, if the display time input would have the value of: ["00", "05", "02"], then,
   * the splitTimer() function would return: ["0", "0", "0", "5", "0", "2"]
   *
   * @returns An array where each element is a digit of the current displayed time
   */
  function splitTimer() {
    const timer = displayTime();
    const joinTimer = timer.join("");
    const splitTimer = joinTimer.split("");
    return splitTimer;
  }

  function omitZero() {
    const splitTime = splitTimer();

    let omitZero = [];
    //remove zeros before start of timer

    if (totalSeconds === 0) {
      omitZero = ["0"];
    } else {
      for (let i = 0; i < splitTime.length; i++) {
        if (splitTime[i] !== "0") {
          omitZero = splitTime.slice(i);
          break;
        }
      }
    }

    if (totalSeconds !== 0) {
      for (let i = 0; i < splitTime.length; i++) {
        if (splitTime[i] !== "0") {
          omitZero = splitTime.slice(i);
          break;
        }
      }
    } else {
      omitZero = ["0"];
    }
    console.log("omitZero inside omitZero", omitZero);
    return omitZero;
  }

  // displayTime > omitZero > addTimeNotation

  //time notation for every length case
  //if input goes above 99:59:59 > default timer to 99:59:59
  //ex: 99:99:99 > 99:59:59

  //if input is empty: timer is = 0
  function addTimeNotation() {
    const formatted = omitZero();
    switch (formatted.length) {
      case 0:
      case 1:
        formatted[0] = formatted[0] + "s ";
        break;
      case 2:
        formatted[1] = formatted[1] + "s ";
        break;
      case 3:
        formatted[0] = formatted[0] + "m ";
        formatted[2] = formatted[2] + "s ";
        break;
      case 4:
        formatted[1] = formatted[1] + "m ";
        formatted[3] = formatted[3] + "s ";
        break;
      case 5:
        formatted[0] = formatted[0] + "h ";
        formatted[2] = formatted[2] + "m ";
        formatted[4] = formatted[4] + "s ";
        break;
      case 6:
        formatted[1] = formatted[1] + "h ";
        formatted[3] = formatted[3] + "m ";
        formatted[5] = formatted[5] + "s ";
        break;
      default:
        break;
    }
    return formatted;
  }

  //disable reset button if timer is not running

  const formattedTime = addTimeNotation();

  console.log("timer check", inputTimer);

  /**
   * IMPORTED FROM TEST
   */

  //INPUT VALUES COME FROM HERE
  const [inputTimerSecond, setInputTimerSecond] = useState("00");
  const [inputTimerMinute, setInputTimerMinute] = useState("00");
  const [inputTimerHour, setInputTimerHour] = useState("00");

  // const [firstS, setFirstS] = useState(0);
  // const [secondS, setSecondS] = useState(0);
  // const [firstM, setFirstM] = useState(0);
  // const [secondM, setSecondM] = useState(0);
  // const [firstH, setFirstH] = useState(0);
  // const [secondH, setSecondH] = useState(0);

  //traverse left
  const [selection1, setSelection1] = useState();

  //traverse right
  const [selection2, setSelection2] = useState();

  //replace/delete
  const [selection3, setSelection3] = useState();

  //traverse input
  const [inputEle1, setInputEle1] = useState();

  //replacing/deleting digit
  const [inputEle2, setInputEle2] = useState();

  //prevent access to 0
  const [selection4, setSelection4] = useState();
  
    //travese input left
    useEffect(() => {
      if (!selection1) return;  // prevent running on start
      const {start, end} = selection1;
      inputEle1.previousElementSibling.focus();
      inputEle1.previousElementSibling.setSelectionRange(start, end);
    }, [selection1])
  
    //traverse input right
    useEffect(() => {
      if (!selection2) return;  
      const {start, end} = selection2;
      inputEle1.nextElementSibling.focus();
      inputEle1.nextElementSibling.setSelectionRange(start, end);
    }, [selection2])
  
    //replace/delete digit
    useEffect(() => {
      if (!selection3) return;  
      const {start, end} = selection3;
      inputEle2.setSelectionRange(start, end);
    },[selection3])
  
    //prevent access to 0
    useEffect(() => {
      if (!selection4) return;  
      const {start, end} = selection4;
      timerH.current.setSelectionRange(start, end);
    },[selection4])

  const notation = ["s", "m", "h"];

  //use ref for hours input
  const timerH = useRef();

  function handleClick() {
    // setInputEle3(timerH)
    timerH.current.focus();
    setSelection4({ start: 1, end: 1 });
  }

  function handleKeyDown(e) {
    const input = e.target;

    setInputEle1(input);

    //moving left
    //prevent access past final digit inside all input
    if (
      input.previousElementSibling &&
      input.value.length === 2 &&
      input.selectionEnd === 1 &&
      e.keyCode === 37
    ) {
      setSelection1({ start: 2, end: 2 });
    } else if (
      !input.previousElementSibling &&
      input.value.length === 2 &&
      input.selectionEnd === 1 &&
      e.keyCode === 37
    ) {
      e.preventDefault();
    }

    //moving right
    if (
      input.nextElementSibling &&
      (input.selectionEnd === 2 || input.selectionEnd === 0) &&
      e.keyCode === 39
    ) {
      setSelection2({ start: 1, end: 1 });
    }
  }

  function handleChangeSecond(event) {
    let input = event.target.value;
    const target = event.target;
    setInputEle2(target);
    const initialPosition = target.selectionStart;

    //keep caret position if u change 2nd digit
    if (target.selectionStart === 2) {
      setSelection3({ start: initialPosition, end: initialPosition - 1 });
      //if u delete
    } else if (target.selectionEnd === initialPosition) {
      setSelection3({ start: initialPosition + 1, end: initialPosition + 1 });
    }

    while (input.length > 2) {
      input = input.substring(1);
    }

    if (!input) {
      input = "00";
    } else if (input.length === 1) {
      input = "0" + input.substring(0);
    }

    console.log("INPUT", input);

    // switch (input.length) {
    //   case 0:
    //     setFirstS(0);
    //     setSecondS(0);
    //     break;
    //   case 1:
    //     setFirstS(input.substring(0, 1));
    //     setSecondS(0);
    //     break;
    //   case 2:
    //     setFirstS(input.substring(1, 2));
    //     setSecondS(input.substring(0, 1));
    //     break;
    //   default:
    //     break;
    // }
    setInputTimerSecond(input);
  }

  function handleChangeMinute(event) {
    let input = event.target.value;
    const target = event.target;
    setInputEle2(target);
    const initialPosition = target.selectionStart;

    //keep caret position if u change 2nd digit
    if (target.selectionStart === 2) {
      setSelection3({ start: initialPosition, end: initialPosition - 1 });
      //if u delete
    } else if (target.selectionEnd === initialPosition) {
      setSelection3({ start: initialPosition + 1, end: initialPosition + 1 });
    }

    while (input.length > 2) {
      input = input.substring(1);
    }

    if (!input) {
      input = "00";
    } else if (input.length === 1) {
      input = "0" + input.substring(0);
    }

    // switch (input.length) {
    //   case 0:
    //     setFirstM(0);
    //     setSecondM(0);
    //     break;
    //   case 1:
    //     setFirstM(input.substring(0, 1));
    //     setSecondM(0);
    //     break;
    //   case 2:
    //     setFirstM(input.substring(1, 2));
    //     setSecondM(input.substring(0, 1));
    //     break;
    //   default:
    //     break;
    // }
    setInputTimerMinute(input);
  }

  function handleChangeHour(event) {
    let input = event.target.value;

    const target = event.target;
    setInputEle2(target);
    const initialPosition = target.selectionStart;

    //keep caret position if u change 2nd digit
    if (target.selectionStart === 2) {
      setSelection3({ start: initialPosition, end: initialPosition - 1 });
      //if u delete
    } else if (target.selectionEnd === initialPosition) {
      setSelection3({ start: initialPosition + 1, end: initialPosition + 1 });
    }

    while (input.length > 2) {
      input = input.substring(1);
    }

    if (!input) {
      input = "00";
    } else if (input.length === 1) {
      input = "0" + input.substring(0);
    }

    // switch (input.length) {
    //   case 0:
    //     setFirstH(0);
    //     setSecondH(0);
    //     break;
    //   case 1:
    //     setFirstH(input.substring(0, 1));
    //     setSecondH(0);
    //     break;
    //   case 2:
    //     setFirstH(input.substring(1, 2));
    //     setSecondH(input.substring(0, 1));
    //     break;
    //   default:
    //     break;
    // }
    setInputTimerHour(input);
  }

  /**
   * IMPORTED FROM TEST
   */

  return (
    <div className="container">
      <div className="timer-container">
        {timerState === TIMER_STATES["EDIT"] && (
          <div id="notation-timer">
            <input
              type="number"
              id="timer"
              name="timer"
              value={inputTimer}
              onChange={handleChange}
              onKeyPress={numOnly}
              autoFocus
            ></input>
            <div className="box" onClick={handleClick}></div>
            <div className="all-inputs">
              <input
                className="hoursInput"
                type="text"
                id="timerx1"
                ref={timerH}
                value={inputTimerHour}
                onChange={handleChangeHour}
                onKeyDown={handleKeyDown}
                onKeyPress={numOnly}
                maxLength={3}
              ></input>
              <input
                className="minutesInput"
                type="text"
                id="timerx2"
                value={inputTimerMinute}
                onChange={handleChangeMinute}
                onKeyDown={handleKeyDown}
                onKeyPress={numOnly}
                maxLength={3}
              ></input>
              <input
                className="secondsInput"
                type="text"
                id="timerx3"
                value={inputTimerSecond}
                onChange={handleChangeSecond}
                onKeyDown={handleKeyDown}
                onKeyPress={numOnly}
                maxLength={3}
              ></input>
            </div>
            <div className="notation">
              <div className="hours">
                <span className="notationH">{notation[2]}</span>
              </div>
              <div className="minutes">
                <span className="notationM">{notation[1]}</span>
              </div>
              <div className="seconds">
                <span className="notationS">{notation[0]}</span>
              </div>
            </div>
          </div>
        )}
        <div id="timer-button-container">
          {timerState !== TIMER_STATES["EDIT"] && (
            <div id="timer-button-absolute-container">
              <div id="absolute-timer" onClick={editTimerState}>
                {formattedTime}
              </div>
            </div>
          )}
          <div id="button-container">
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
    </div>
  );
}

export default Main;
