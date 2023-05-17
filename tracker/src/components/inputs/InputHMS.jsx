import React, { useState, useEffect, useRef } from "react";

import "../../styling/inputs.scss";

import useLongPress from "../../hooks/longPress";
import NotationH from "../notations/NotationH";
import NotationM from "../notations/NotationM";
import NotationS from "../notations/NotationS";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCaretUp, faCaretDown } from '@fortawesome/free-solid-svg-icons'

const caretUp = <FontAwesomeIcon icon={faCaretUp} size="lg"/>
const caretDown = <FontAwesomeIcon icon={faCaretDown} size="lg"/>

function TimerHMS(props) {
  //Store inputs to traverse between them
  //traverse left
  const [selection1, setSelection1] = useState();
  //traverse right
  const [selection2, setSelection2] = useState();
  //traverse input
  const [inputEle1, setInputEle1] = useState();

  const [inputEleH, setInputEleH] = useState();
  const [inputEleS, setInputEleS] = useState();

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
    if (!props.selection3) return;
    const { start, end } = props.selection3;
    props.inputEle2.setSelectionRange(start, end);
  }, [props.selection3]);

  //prevent access to 0
  const [selection4, setSelection4] = useState();
  const [selection5, setSelection5] = useState();
  const [selection6, setSelection6] = useState();

  const [selectionH, setSelectionH] = useState();
  const [selectionS, setSelectionS] = useState();

  //use ref for hours input. Will need useRef for minutes and seconds input. Used to block cursor click on left side on input.
  const timerH = useRef();
  const timerM = useRef();
  const timerS = useRef();

  //prevent clickaccess to 0: Hours
  useEffect(() => {
    if (!selection4) return;
    const { start, end } = selection4;
    timerH.current.setSelectionRange(start, end);
  }, [selection4]);

  function handleClickH() {
    timerH.current.focus();
    setSelection4({ start: 1, end: 1 });
  }

  //Minutes
  useEffect(() => {
    if (!selection5) return;
    const { start, end } = selection5;
    timerM.current.setSelectionRange(start, end);
  }, [selection5]);

  function handleClickM() {
    timerM.current.focus();
    setSelection5({ start: 1, end: 1 });
  }

  //Seconds
  useEffect(() => {
    if (!selection6) return;
    const { start, end } = selection6;
    timerS.current.setSelectionRange(start, end);
  }, [selection6]);

  //up arrow sets focus to hours and SR: 1,1
  useEffect(() => {
    if (!selectionH) return;
    const { start, end } = selectionH;
    inputEleH.current.setSelectionRange(start, end);
  }, [selectionH]);

  //up arrow sets focus to seconds and SR: 2,2
  useEffect(() => {
    if (!selectionS) return;
    const { start, end } = selectionS;
    inputEleS.current.setSelectionRange(start, end);
  }, [selectionS]);

  function handleClickS() {
    timerS.current.focus();
    setSelection6({ start: 1, end: 1 });
  }

  //redirect focus to setSelectionRange(1, 1) if div is clicked. Prevent cursor access past final digit when clicking
  function handleKeyDown(e) {
    const input = e.target;
    setInputEle1(input);
    //moving left
    //prevent cursor access past final digit inside all inputs when traversing with left and right arrows
    //ex: [11] > [|11] : cannot reach "|"
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
    } else if (e.keyCode === 38) {
      //key up sets focus to Hours input with SelectionRange 1,1
      setInputEleH(timerH);
      timerH.current.focus();
      setSelectionH({ start: 1, end: 1 });
    } else if (e.keyCode === 40) {
      //key down sets focus to Seconds input with SelectionRange 2,2
      setInputEleS(timerS);
      timerS.current.focus();
      setSelectionS({ start: 2, end: 2 });
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

  function numOnly(event) {
    if (!/[0-9]/.test(event.key)) {
      event.preventDefault();
    }
  }

  function handleButtonClickUpH() {
    let value = props.InputTimerHour;
    let newValue;
    let stringToInt = parseInt(value) + 1;
    let x = stringToInt.toString();

    if (value === "99") {
      newValue = "00";
    }
    if (x.length === 1) {
      newValue = "0" + x;
    }
    if (x.length === 2) {
      newValue = x;
    }

    props.setInputTimerHour(newValue);
  }

  function handleButtonClickUpM() {
    let value = props.InputTimerMinute;
    let newValue;
    let stringToInt = parseInt(value) + 1;
    let x = stringToInt.toString();

    if (value === "99") {
      newValue = "00";
    }
    if (x.length === 1) {
      newValue = "0" + x;
    }
    if (x.length === 2) {
      newValue = x;
    }

    props.setInputTimerMinute(newValue);
  }

  function handleButtonClickDownH() {
    let value = props.InputTimerHour;
    let newValue;
    let stringToInt = parseInt(value) - 1;
    let x = stringToInt.toString();

    if (value === "00") {
      newValue = "99";
    } else if (x.length === 2) {
      newValue = x;
    }
    if (x.length === 1) {
      newValue = "0" + x;
    }
    props.setInputTimerHour(newValue);
  }

  function handleButtonClickDownM() {
    let value = props.InputTimerMinute;
    let newValue;
    let stringToInt = parseInt(value) - 1;
    let x = stringToInt.toString();

    if (value === "00") {
      newValue = "99";
    } else if (x.length === 2) {
      newValue = x;
    }
    if (x.length === 1) {
      newValue = "0" + x;
    }

    console.log("newvalue", newValue);

    props.setInputTimerMinute(newValue);
  }

  function handleButtonClickUpS() {
    let value = props.InputTimerSecond;
    let newValue;
    let stringToInt = parseInt(value) + 1;
    let x = stringToInt.toString();

    if (value === "99") {
      newValue = "00";
    }
    if (x.length === 1) {
      newValue = "0" + x;
    }
    if (x.length === 2) {
      newValue = x;
    }

    props.setInputTimerSecond(newValue);
  }

  function handleButtonClickDownS() {
    let value = props.InputTimerSecond;
    let newValue;
    let stringToInt = parseInt(value) - 1;
    let x = stringToInt.toString();

    if (value === "00") {
      newValue = "99";
    } else if (x.length === 2) {
      newValue = x;
    }
    if (x.length === 1) {
      newValue = "0" + x;
    }

    console.log("newvalue", newValue);

    props.setInputTimerSecond(newValue);
  }

  const longPressUpH = useLongPress(handleButtonClickUpH, 135);
  const longPressDownH = useLongPress(handleButtonClickDownH, 135);

  const longPressUpM = useLongPress(handleButtonClickUpM, 135);
  const longPressDownM = useLongPress(handleButtonClickDownM, 135);

  const longPressUpS = useLongPress(handleButtonClickUpS, 135);
  const longPressDownS = useLongPress(handleButtonClickDownS, 135);
  return (
    <div className="inputs-boxes">
      <div className="buttons">
        <div className="down" id="down-buttons">
          <button
            className="button-down-H"
            onClick={handleButtonClickDownH}
            {...longPressDownH}
          >
            {caretDown}
          </button>

          <button
            className="button-down-M"
            onClick={handleButtonClickDownM}
            {...longPressDownM}
          >
            {caretDown}
          </button>
          <button
            className="button-down-S"
            onClick={handleButtonClickDownS}
            {...longPressDownS}
          >
            {caretDown}
          </button>
        </div>
      </div>
      <div className="boxes">
        <div className="boxH" onClick={handleClickH}></div>
        <div className="boxM" onClick={handleClickM}></div>
        <div className="boxS" onClick={handleClickS}></div>
      </div>
      <div className="inputs">
        <input
          ref={timerH}
          className="hoursInput"
          type="text"
          id="timerHour"
          value={props.valueH}
          onChange={props.onChangeH}
          onKeyDown={handleKeyDown}
          onKeyPress={numOnly}
          maxLength={3}
          // inputmode="numeric"
          // pattern="[0-9]*"
        ></input>
        <input
          ref={timerM}
          className="minutesInput"
          type="text"
          id="timerMinute"
          value={props.valueM}
          onChange={props.onChangeM}
          onKeyDown={handleKeyDown}
          onKeyPress={numOnly}
          maxLength={3}
          // inputmode="numeric"
          // pattern="[0-9]*"
        ></input>
        <input
          ref={timerS}
          className="secondsInput"
          type="text"
          id="timerSecond"
          value={props.valueS}
          onChange={props.onChangeS}
          onKeyDown={handleKeyDown}
          onKeyPress={numOnly}
          maxLength={3}
          // inputmode="numeric"
          // pattern="[0-9]*"
          autoFocus
        ></input>
      </div>
      <div className="notation">
        <div className="notation-hours">
          <NotationH />
        </div>
        <div className="notation-minutes">
          <NotationM />
        </div>
        <div className="notation-seconds">
          <NotationS />
        </div>
      </div>
      <div className="buttons">
        <div className="up" id="up-buttons">
          <button
            className="button-up-H"
            onClick={handleButtonClickUpH}
            {...longPressUpH}
          >
            {caretUp}
          </button>
          <button
            className="button-up-M"
            onClick={handleButtonClickUpM}
            {...longPressUpM}
          >
            {caretUp}
          </button>
          <button
            className="button-up-S"
            onClick={handleButtonClickUpS}
            {...longPressUpS}
          >
            {caretUp}
          </button>
        </div>
      </div>
    </div>
  );
}

export default TimerHMS;
