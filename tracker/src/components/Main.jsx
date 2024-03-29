import React, { useState, useEffect, useContext } from "react";
// import { FullScreen, useFullScreenHandle } from "react-full-screen";
import Modal from "react-modal";
import jwt from "jsonwebtoken";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { UserContext } from "../App";

import { v4 as uuidv4 } from "uuid";

import getDayOfYear from "date-fns/getDayOfYear";
import getYear from "date-fns/getYear";
import formatDuration from "date-fns/formatDuration";
import format from "date-fns/format";

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

  //disable alarm due to CORB issue
  // const alarm1 = new Audio(
  //   "https://freesound.org/people/suburban%20grilla/sounds/2166/download/2166__suburban-grilla__bowl-struck.wav"
  // );

  const [totalSeconds, setTotalSeconds] = useState(300);
  //initialTime is running off array converison: 500 => [5, 0, 0] (5 min 0 seconds)
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

  //context for logged in user
  const { userData } = useContext(UserContext);

  //Store cursor position to restore after input
  const [cursor, setCursor] = useState();
  //Store target input 
  const [targetInput, setTargetInput] = useState();

  //Restore cursor position on input change
  useEffect(() => {
    if (!cursor) return;
    const { start, end } = cursor;
    targetInput.setSelectionRange(start, end);
  }, [cursor]);

  const [loggedin, setLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const user = jwt.decode(token);
      if (!user) {
        localStorage.removeItem("token");
        navigate("/login");
      } else {
        setLoggedIn(true);
      }
    }
  }, [navigate]);

  //Decrement timer if timer has started, and there is an interval
  useEffect(() => {
    if (timerState === TIMER_STATES["STARTED"] && !intervalID) {
      if (totalSeconds !== 0) {
        const intervalID = setInterval(decrementTotalSeconds, 1000);
        setIntervalID(intervalID);
      }
    }
  }, [
    timerState,
    TIMER_STATES,
    intervalID,
    totalSeconds,
    decrementTotalSeconds,
  ]);

  useEffect(() => {
    if (timerState === TIMER_STATES["FINISHED"]) {
      startAlarm();
      onCompletion();
    }
  }, [timerState, TIMER_STATES, onCompletion]);

  //update display spans on every tick
  useEffect(() => {
    omitZero();
  }, [totalSeconds, omitZero]);

  function startTimer() {
    //if initial time has already started
    if (timerState === TIMER_STATES["EDIT"]) {
      console.log("START FROM EDIT STATE");
      setTimerState(TIMER_STATES["STARTED"]);
      let tripleInputs = inputTimerHour + inputTimerMinute + inputTimerSecond;
      const newInputTimer = calculateSeconds(tripleInputs);
      //logic to start from new initial input
      setTotalSeconds(newInputTimer);
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

  //1sec = 000001
  //remove zeros then calculate message
  function removeZeros(string) {
    // console.log("string", string);
    let splitString = string.split("");

    for (let i = 0; i < splitString.length; i++) {
      if (splitString[i] !== "0") {
        splitString = splitString.slice(i);
        break;
      }
    }
    return splitString;
  }

  function completedTime() {
    let array = removeZeros(initialTime.toString());
    let message = "You completed ";
    switch (array.length) {
      case 0:
        break;
      case 1:
        message += formatDuration({ seconds: parseInt(array[0]) });
        break;
      case 2:
        message += formatDuration({ seconds: parseInt(array[0] + array[1]) });
        break;
      case 3:
        message += formatDuration({
          minutes: parseInt(array[0]),
          seconds: parseInt(array[1] + array[2]),
        });
        break;
      case 4:
        message += formatDuration({
          minutes: parseInt(array[0] + array[1]),
          seconds: parseInt(array[2] + array[3]),
        });
        break;
      case 5:
        message += formatDuration({
          hours: parseInt(array[0]),
          minutes: parseInt(array[1] + array[2]),
          seconds: parseInt(array[3] + array[4]),
        });
        break;
      case 6:
        message += formatDuration({
          hours: parseInt(array[0] + array[1]),
          minutes: parseInt(array[2] + array[3]),
          seconds: parseInt(array[4] + array[5]),
        });
        break;
    }
    return message;
  }

  const message = completedTime();
  const [modalIsOpen, setModalIsOpen] = useState(false);

  function openModal() {
    setModalIsOpen(true);
  }

  function closeModal() {
    submitSession();
    setModalIsOpen(false);
    resetTimer();
  }

  //adding log must be done through a handler
  const [log, setLog] = useState("");

  async function submitSession() {
    const id = userData.user.id;
    let generateId = uuidv4();
    const constantId = generateId;
    const totalSeconds = calculateSeconds(initialTime);
    const formattedTime = displayInputValue(calculateSeconds(initialTime));
    const sessionLog = log;
    const formattedDate = format(new Date(), "PPP");
    const dayOfYear = getDayOfYear(new Date());
    const year = getYear(new Date());
    const lengthString = formatDuration({
      hours: formattedTime[0],
      minutes: formattedTime[1],
      seconds: formattedTime[2],
    });

    await axios.put(`/api/users/${id}`, {
      $push: {
        sessions: {
          id: constantId,
          date: formattedDate,
          dayOfYear: dayOfYear,
          length: lengthString,
          lengthSeconds: totalSeconds,
          year: year,
          log: sessionLog,
        },
      },
    });
  }

  function onCompletion() {
    openModal();
  }

  function stopTimer() {
    console.log("ENTER STOP STATE");
    setTimerState(TIMER_STATES["STOPPED"]);
    clearInterval(intervalID);
    setIntervalID(undefined);
  }

  function startAlarm() {
    // alarm1.loop = false;
    // alarm1.play();
    console.log("startalarm check");
  }

  function stopAlarm() {
    // alarm1.pause();
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
    console.log("initialTimeInSeconds", initialTimeInSeconds);
    setTotalSeconds(initialTimeInSeconds);
    setTimerState(TIMER_STATES["INITIAL"]);
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
    return omitZero;
  }

  const customStyles = {
    content: {
      top: "50%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      marginRight: "-50%",
      transform: "translate(-50%, -50%)",
    },
  };

  const setValues = (arr) => {
    setInputTimerHour(arr[0]);
    setInputTimerMinute(arr[1]);
    setInputTimerSecond(arr[2]);
  };

  //move all elements -1 index
  let move = (arr, offset = 0) => {
    const pivot = (offset < 0 ? 0 : arr.length) - (offset % arr.length);
    return arr.slice(pivot).concat(arr.slice(0, pivot));
  };

  let manipulate = (arr, newArr) => {
    let movedArr = move(arr, -1);
    movedArr.pop();
    newArr = [
      movedArr[0] + movedArr[1],
      movedArr[2] + movedArr[3],
      movedArr[4] + movedArr[5],
    ];
    setValues(newArr);
  };

  let handleInput = (event) => {
    let keyConversion = String.fromCharCode(event.keyCode);

    let splitHr = inputTimerHour.split("");
    let splitMn = inputTimerMinute.split("");
    let splitSc = inputTimerSecond.split("");

    let newArr = [splitHr, splitMn, splitSc];

    let flatNewArr = newArr.flat();

    const caretPosition = event.target.selectionStart;
    const focusedInputId = document.activeElement.id;
    const targetInput = event.target;
    setTargetInput(targetInput);

    if (event.keyCode >= 48 && event.keyCode <= 57) {
      // console.log("number key code entered");
      setTimeout(() => {
        setCursor({ start: caretPosition, end: caretPosition });
      });
      if (focusedInputId === "timerSecond") {
        if (caretPosition === 1) {
          flatNewArr.splice(5, 0, keyConversion);
          manipulate(flatNewArr, newArr);
        } else if (caretPosition === 2) {
          flatNewArr.splice(6, 0, keyConversion);
          manipulate(flatNewArr, newArr);
        }
      } else if (focusedInputId === "timerMinute") {
        if (caretPosition === 1) {
          flatNewArr.splice(3, 0, keyConversion);
          manipulate(flatNewArr, newArr);
        } else if (caretPosition === 2) {
          flatNewArr.splice(4, 0, keyConversion);
          manipulate(flatNewArr, newArr);
        }
      } else if (focusedInputId === "timerHour") {
        if (caretPosition === 1) {
          flatNewArr.splice(1, 0, keyConversion);
          manipulate(flatNewArr, newArr);
        } else if (caretPosition === 2) {
          flatNewArr.splice(2, 0, keyConversion);
          manipulate(flatNewArr, newArr);
        }
      }
    } else if (event.keyCode === 8) {
      setTimeout(() => {
        setCursor({ start: caretPosition, end: caretPosition });
      });
      if (focusedInputId === "timerSecond") {
        if (caretPosition === 1) {
          flatNewArr.splice(4, 1);
          flatNewArr.unshift("0");
          newArr = [
            flatNewArr[0] + flatNewArr[1],
            flatNewArr[2] + flatNewArr[3],
            flatNewArr[4] + flatNewArr[5],
          ];
          setValues(newArr);
        } else if (caretPosition === 2) {
          flatNewArr.splice(5, 1);
          flatNewArr.unshift("0");
          newArr = [
            flatNewArr[0] + flatNewArr[1],
            flatNewArr[2] + flatNewArr[3],
            flatNewArr[4] + flatNewArr[5],
          ];
          setValues(newArr);
        }
      } else if (focusedInputId === "timerMinute") {
        if (caretPosition === 1) {
          flatNewArr.splice(2, 1);
          flatNewArr.unshift("0");
          newArr = [
            flatNewArr[0] + flatNewArr[1],
            flatNewArr[2] + flatNewArr[3],
            flatNewArr[4] + flatNewArr[5],
          ];
          setValues(newArr);
        } else if (caretPosition === 2) {
          flatNewArr.splice(3, 1);
          flatNewArr.unshift("0");
          newArr = [
            flatNewArr[0] + flatNewArr[1],
            flatNewArr[2] + flatNewArr[3],
            flatNewArr[4] + flatNewArr[5],
          ];
          setValues(newArr);
        }
      } else if (focusedInputId === "timerHour") {
        if (caretPosition === 1) {
          flatNewArr.splice(0, 1);
          flatNewArr.unshift("0");
          newArr = [
            flatNewArr[0] + flatNewArr[1],
            flatNewArr[2] + flatNewArr[3],
            flatNewArr[4] + flatNewArr[5],
          ];
          setValues(newArr);
        } else if (caretPosition === 2) {
          flatNewArr.splice(1, 1);
          flatNewArr.unshift("0");
          newArr = [
            flatNewArr[0] + flatNewArr[1],
            flatNewArr[2] + flatNewArr[3],
            flatNewArr[4] + flatNewArr[5],
          ];
          setValues(newArr);
        }
      }
    }
  };

  return (
    <div className="container">
      <div className="timer-container">
        <div id="timer-button-container">
          {timerState !== TIMER_STATES["EDIT"] && (
            <div id="display-timer-container">
              <div className="absolute-timer" onClick={editTimerState}>
                <div className="notation-display">
                  {(firstH || secondH) && (
                    <div className="hours">
                      <FirstH value={firstH} />
                      <SecondH value={secondH} />
                      <NotationH />
                    </div>
                  )}
                  {(firstM || secondM) && (
                    <div className="minutes">
                      <FirstM value={firstM} />
                      <SecondM value={secondM} />
                      <NotationM />
                    </div>
                  )}
                  {firstS ? (
                    <div className="seconds">
                      <FirstS value={firstS} />
                      <SecondS value={secondS} />
                      <NotationS />
                    </div>
                  ) : (
                    <div className="seconds" id="solo-seconds">
                      <SecondS value={secondS} />
                      <NotationS />
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
          {timerState === TIMER_STATES["EDIT"] && (
            <div id="notation-timer">
              <TimerHMS
                valueH={inputTimerHour}
                valueM={inputTimerMinute}
                valueS={inputTimerSecond}
                handleInput={handleInput}
                InputTimerHour={inputTimerHour}
                setInputTimerHour={setInputTimerHour}
                InputTimerMinute={inputTimerMinute}
                setInputTimerMinute={setInputTimerMinute}
                InputTimerSecond={inputTimerSecond}
                setInputTimerSecond={setInputTimerSecond}
              ></TimerHMS>
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
            {timerState === TIMER_STATES["FINISHED"] && loggedin && (
              <div>
                <Modal
                  isOpen={modalIsOpen}
                  style={customStyles}
                  shouldCloseOnOverlayClick={false}
                >
                  <div className="log-message">{message}</div>
                  <label for="logInput">Enter a log:</label>
                  <br />
                  <input
                    type="text"
                    className="logInput"
                    onChange={(e) => setLog(e.target.value)}
                  ></input>
                  <br />
                  <button class="submit-log" onClick={closeModal}>
                    Submit Session
                  </button>
                </Modal>
              </div>
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
