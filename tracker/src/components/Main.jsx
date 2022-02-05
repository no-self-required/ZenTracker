import React, { useState, useEffect, useRef } from "react";
import "../styling/main.scss";

//H:M:S inputs
import TimerHMS from "./inputs/InputHMS";

import NotationH from "./notations/NotationH";
import NotationM from "./notations/NotationM";
import NotationS from "./notations/NotationS";

//Display timer digits
import FirstH from "./displayDigits/FirstH";
import SecondH from "./displayDigits/SecondH";
import FirstM from "./displayDigits/FirstM";
import SecondM from "./displayDigits/SecondM";
import FirstS from "./displayDigits/FirstS";
import SecondS from "./displayDigits/SecondS";

//Buttons
import Start from "./buttons/Start";
import Stop from "./buttons/Stop";
import Ok from "./buttons/Ok";
import Reset from "./buttons/Reset";
import ResetDisabled from "./buttons/ResetDisabled";

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
//calculated time becomes new split Arr???
function calculateSeconds(initialTime) {
  const splitArr = splitInput(initialTime);
  console.log("splitArray inside calc seconds", splitArr);
  const seconds = [];
  const minutes = [];
  const hours = [];
  hours.push(splitArr[0], splitArr[1]);
  minutes.push(splitArr[2], splitArr[3]);
  seconds.push(splitArr[4], splitArr[5]);
  const totSec = seconds[0] * 10 + seconds[1];
  const totMin = minutes[0] * 600 + minutes[1] * 60;
  const totHours = hours[0] * 36000 + hours[1] * 3600;
  let calculatedTotalSeconds = totSec + totMin + totHours;

  console.log("calculatedTotalSeconds", calculatedTotalSeconds);

  //if time entered is more than 99hours, set to 99h/59m/59s
  if (calculatedTotalSeconds > 360000) {
    calculatedTotalSeconds = 359999;
  }
  return calculatedTotalSeconds;
}

function displayTime(totalSeconds) {
  let showHours = 0;
  let showMin = 0;
  let showSec = 0;
  let formatted = [];

  while (totalSeconds >= 3600) {
    showHours += 1;
    totalSeconds -= 3600;
  }

  while (totalSeconds >= 60) {
    showMin += 1;
    totalSeconds -= 60;
  }

  if (totalSeconds < 60) {
    showSec = totalSeconds;
  }

  formatted.push(showHours);
  formatted.push(showMin);
  formatted.push(showSec);

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

function splitTimer(totalSeconds) {
  const timer = displayTime(totalSeconds);
  const joinTimer = timer.join("");
  const splitTimer = joinTimer.split("");
  return splitTimer;
}

//take totalseconds and calculate display input
function displayInputValue(totalSeconds) {
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

function Main() {
  const TIMER_STATES = {
    INITIAL: 0,
    STARTED: 1,
    STOPPED: 2,
    EDIT: 3,
    FINISHED: 4,
  };

  const alarm1 = new Audio(
    "https://freesound.org/people/suburban%20grilla/sounds/2166/download/2166__suburban-grilla__bowl-struck.wav"
  );

  const [totalSeconds, setTotalSeconds] = useState(300);
  //initialTime is running off array [5, 0, 0]
  const [initialTime, setInitialTime] = useState(500);
  const [intervalID, setIntervalID] = useState();
  const [timerState, setTimerState] = useState(TIMER_STATES["INITIAL"]);

  //State tags for each digit (display timer)
  const [firstS, setFirstS] = useState(null);
  const [secondS, setSecondS] = useState(null);
  const [firstM, setFirstM] = useState(null);
  const [secondM, setSecondM] = useState(null);
  const [firstH, setFirstH] = useState(null);
  const [secondH, setSecondH] = useState(null);

  //Input values
  const [inputTimerSecond, setInputTimerSecond] = useState("00");
  const [inputTimerMinute, setInputTimerMinute] = useState("00");
  const [inputTimerHour, setInputTimerHour] = useState("00");

  //Store inputs to traverse between them
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
  // const [selection4, setSelection4] = useState();

  //use ref for hours input. Will need useRef for minutes and seconds input. Used to block cursor click on left side on input.
  // const timerH = useRef();

  //run focus and setSelectionRange for target inputs
  //travese input left
  useEffect(() => {
    if (!selection1) return; // prevent running on start
    const { start, end } = selection1;
    inputEle1.previousElementSibling.focus();
    inputEle1.previousElementSibling.setSelectionRange(start, end);
  }, [selection1]);

  //traverse input right
  useEffect(() => {
    if (!selection2) return;
    const { start, end } = selection2;
    inputEle1.nextElementSibling.focus();
    inputEle1.nextElementSibling.setSelectionRange(start, end);
  }, [selection2]);

  //replace/delete digit
  useEffect(() => {
    if (!selection3) return;
    const { start, end } = selection3;
    inputEle2.setSelectionRange(start, end);
  }, [selection3]);

  //prevent access to 0
  // useEffect(() => {
  //   if (!selection4) return;
  //   const { start, end } = selection4;
  //   timerH.current.setSelectionRange(start, end);
  // }, [selection4]);

  //Decrement timer if timer has started, and there is an interval
  useEffect(() => {
    if (timerState === TIMER_STATES["STARTED"] && !intervalID) {
      if (totalSeconds !== 0) {
        const intervalID = setInterval(decrementTotalSeconds, 1000);
        setIntervalID(intervalID);
      }
    } else if (timerState === TIMER_STATES["FINISHED"]) {
      startAlarm();
    }
  }, [timerState, intervalID, decrementTotalSeconds, startAlarm, totalSeconds]);

  //update display spans on every tick
  useEffect(() => {
    omitZero();
  }, [totalSeconds]);

  function startTimer() {
    //if initial time has already started
    if (timerState === TIMER_STATES["EDIT"]) {
      console.log("START FROM EDIT STATE");
      let tripleInputs = inputTimerHour + inputTimerMinute + inputTimerSecond;
      const newInputTimer = calculateSeconds(tripleInputs);
      //logic to start from new initial input
      setTotalSeconds(newInputTimer);
      setTimerState(TIMER_STATES["STARTED"]);
      //set new initial time to concatenated inputs
      setInitialTime(tripleInputs);

      return;
    } else if (timerState === TIMER_STATES["STOPPED"]) {
      console.log("START FROM STOPPED STATE");
      setTimerState(TIMER_STATES["STARTED"]);
      return;
    } else if (timerState === TIMER_STATES["INITIAL"]) {
      const calculated = calculateSeconds(initialTime);
      console.log("START FROM INITIAL STATE");
      setTimerState(TIMER_STATES["STARTED"]);
      setTotalSeconds(calculated);
      return;
    }
  }

  function stopTimer() {
    console.log("ENTER STOP STATE");
    setTimerState(TIMER_STATES["STOPPED"]);
    clearInterval(intervalID);
    setIntervalID(undefined);
  }

  function startAlarm() {
    alarm1.loop = false;
    alarm1.play();
  }

  function stopAlarm() {
    alarm1.pause();
  }

  function editTimerState() {
    console.log("ENTER EDIT STATE");
    setTimerState(TIMER_STATES["EDIT"]);
    clearInterval(intervalID);
    setIntervalID(undefined);
    fillZeros();
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
    clearInterval(intervalID);
    setIntervalID(undefined);
    const initialTimeInSeconds = calculateSeconds(initialTime);
    console.log('initialTimeInSeconds', initialTimeInSeconds)
    setTotalSeconds(initialTimeInSeconds);
    setTimerState(TIMER_STATES["INITIAL"]);
  }

  // const inputId = document.getElementById("timer");

  // if (document.getElementById("timer")) {
  //   inputId.addEventListener("keyup", function onEvent(e) {
  //     if (e.key === "Enter") {
  //       startTimer();
  //     }
  //   });
  // }

  //only accept numbers for timer input
  function numOnly(event) {
    if (!/[0-9]/.test(event.key)) {
      event.preventDefault();
    }
  }

  //sets triple input values based off total seconds
  function fillZeros() {
    let input = displayInputValue(totalSeconds);
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

    //convert to strings for input values
    setInputTimerHour(input[0].toString());
    setInputTimerMinute(input[1].toString());
    setInputTimerSecond(input[2].toString());
  }

  //remove zeros and set update display timer spans
  function omitZero() {
    const splitTime = splitTimer(totalSeconds);

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

    switch (omitZero.length) {
      case 0:
        break;
      case 1:
        setFirstH(null);
        setSecondH(null);
        setFirstM(null);
        setSecondM(null);
        setFirstS(null);
        setSecondS(omitZero[0]);
        break;
      case 2:
        setFirstH(null);
        setSecondH(null);
        setFirstM(null);
        setSecondM(null);
        setFirstS(omitZero[0]);
        setSecondS(omitZero[1]);
        break;
      case 3:
        setFirstH(null);
        setSecondH(null);
        setFirstM(null);
        setSecondM(omitZero[0]);
        setFirstS(omitZero[1]);
        setSecondS(omitZero[2]);
        break;
      case 4:
        setFirstH(null);
        setSecondH(null);
        setFirstM(omitZero[0]);
        setSecondM(omitZero[1]);
        setFirstS(omitZero[2]);
        setSecondS(omitZero[3]);
        break;
      case 5:
        setFirstH(null);
        setSecondH(omitZero[0]);
        setFirstM(omitZero[1]);
        setSecondM(omitZero[2]);
        setFirstS(omitZero[3]);
        setSecondS(omitZero[4]);
        break;
      case 6:
        setFirstH(omitZero[0]);
        setSecondH(omitZero[1]);
        setFirstM(omitZero[2]);
        setSecondM(omitZero[3]);
        setFirstS(omitZero[4]);
        setSecondS(omitZero[5]);
        break;

      default:
        break;
    }
    console.log('omit zero', omitZero);
    return omitZero;
  }

  //redirect focus to setSelectionRange(1, 1) if div is clicked. Prevent cursor access past final digit when clicking
  // function handleClickH() {
  //   timerH.current.focus();
  //   setSelection4({ start: 1, end: 1 });
  // }

  // function handleKeyDown(e) {
  //   const input = e.target;
  //   setInputEle1(input);
  //   //moving left
  //   //prevent cursor access past final digit inside all inputs when traversing with left and right arrows
  //   //ex: [11] > [|11] : cannot reach "|"
  //   if (
  //     input.previousElementSibling &&
  //     input.value.length === 2 &&
  //     input.selectionEnd === 1 &&
  //     e.keyCode === 37
  //   ) {
  //     setSelection1({ start: 2, end: 2 });
  //   } else if (
  //     !input.previousElementSibling &&
  //     input.value.length === 2 &&
  //     input.selectionEnd === 1 &&
  //     e.keyCode === 37
  //   ) {
  //     e.preventDefault();
  //   }

  //   //moving right
  //   if (
  //     input.nextElementSibling &&
  //     (input.selectionEnd === 2 || input.selectionEnd === 0) &&
  //     e.keyCode === 39
  //   ) {
  //     setSelection2({ start: 1, end: 1 });
  //   }
  // }

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

    setInputTimerHour(input);
  }

  //todo:
  //div block clicks to 0 on inputs
  //styling

  return (
    <div className="container">
      <div className="timer-container">
        {timerState === TIMER_STATES["EDIT"] && (
          <div id="notation-timer">
            {/* <div className="box" onClick={}></div> */}
            <div className="all-inputs">
              <TimerHMS
                // ref={timerH}
                valueH={inputTimerHour}
                valueM={inputTimerMinute}
                valueS={inputTimerSecond}
                onChangeH={handleChangeHour}
                onChangeM={handleChangeMinute}
                onChangeS={handleChangeSecond}
                onKeyPress={numOnly}
              ></TimerHMS>
            </div>
            <div className="notation">
              <div className="hours">
                <NotationH />
              </div>
              <div className="minutes">
                <NotationM />
              </div>
              <div className="seconds">
                <NotationS />
              </div>
            </div>
          </div>
        )}
        <div id="timer-button-container">
          {timerState !== TIMER_STATES["EDIT"] && (
            <div id="display-timer-container">
              <div className="absolute-timer" onClick={editTimerState}>
                <div className="notationDisplay">
                  <div className="hours">
                    {/* <span className="firstH">{firstH}</span> */}
                    <FirstH value={firstH} />
                    <SecondH value={secondH} />
                    {(firstH || secondH) && <NotationH />}
                  </div>
                  <div className="minutes">
                    <FirstM value={firstM} />
                    <SecondM value={secondM} />
                    {(firstM || secondM) && <NotationM />}
                  </div>
                  <div className="seconds">
                    <FirstS value={firstS} />
                    <SecondS value={secondS} />
                    {(firstS || secondS) && <NotationS />}
                  </div>
                </div>
              </div>
            </div>
          )}
          <div id="button-container">
            {(timerState === TIMER_STATES["INITIAL"] ||
              timerState === TIMER_STATES["STOPPED"] ||
              timerState === TIMER_STATES["EDIT"]) && (
              <Start onClick={startTimer} />
            )}
            {timerState === TIMER_STATES["STARTED"] && (
              <Stop onClick={stopTimer} />
            )}
            {timerState === TIMER_STATES["FINISHED"] && (
              <Ok onClick={stopAlarm} />
            )}
            {timerState !== TIMER_STATES["INITIAL"] && (
              <Reset onClick={resetTimer} />
            )}
            {timerState === TIMER_STATES["INITIAL"] && <ResetDisabled />}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Main;
