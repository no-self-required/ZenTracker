import React, { useState, useEffect, useRef } from "react";

import "../../styling/inputs.scss";

import useLongPress from "../../hooks/longPress";
import NotationH from "../notations/NotationH";
import NotationM from "../notations/NotationM";
import NotationS from "../notations/NotationS";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretUp, faCaretDown } from "@fortawesome/free-solid-svg-icons";

const caretUp = <FontAwesomeIcon icon={faCaretUp} size="2xl" />;
const caretDown = <FontAwesomeIcon icon={faCaretDown} size="2xl" />;

function InputHMS(props) {
  //Store inputs to traverse between them

  //prevent access to 0
  const [selection4, setSelection4] = useState();
  const [selection5, setSelection5] = useState();
  const [selection6, setSelection6] = useState();

  //use ref for hours input. Used to block cursor click on left side of input. On click redirects focus to caret: 1,1 of designated input.
  const timerH = useRef();
  const timerM = useRef();
  const timerS = useRef();

  //prevent clickaccess to 0: Hours
  useEffect(() => {
    if (!selection4) return;
    const { start, end } = selection4;
    timerH.current.setSelectionRange(start, end);
  }, [selection4]);

  //redirect focus to setSelectionRange(1, 1) if div is clicked. Prevent cursor access past final digit when clicking
  function handleClickH() {
    timerH.current.focus();
    setSelection4({ start: 1, end: 1 });
  }

  function handleClickM() {
    timerM.current.focus();
    setSelection5({ start: 1, end: 1 });
  }

  function handleClickS() {
    timerS.current.focus();
    setSelection6({ start: 1, end: 1 });
  }
  
  //Minutes
  useEffect(() => {
    if (!selection5) return;
    const { start, end } = selection5;
    timerM.current.setSelectionRange(start, end);
  }, [selection5]);

  //Seconds
  useEffect(() => {
    if (!selection6) return;
    const { start, end } = selection6;
    timerS.current.setSelectionRange(start, end);
  }, [selection6]);

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
      <div className="input-wrapper">
        <div className="boxes">
          <div className="boxH" onClick={handleClickH}></div>
          <div className="boxM" onClick={handleClickM}></div>
          <div className="boxS" onClick={handleClickS}></div>
        </div>
        <div className="inputs">
          <input
            ref={timerH}
            className="hoursInput"
            type="tel"
            id="timerHour"
            value={props.valueH}
            onInput={(e) => {
              props.setCursor({ start: props.caret, end: props.caret });
            }}
            onKeyDown={(event) => {
              props.handleInput(event);
            }}
            onKeyPress={numOnly}
            maxLength={3}
          ></input>
          <input
            ref={timerM}
            className="minutesInput"
            type="tel"
            id="timerMinute"
            value={props.valueM}
            onInput={(e) => {
              props.setCursor({ start: props.caret, end: props.caret }); //keeps cursor position on input
            }}
            onKeyDown={(event) => {
              props.handleInput(event);
            }}
            onKeyPress={numOnly}
            maxLength={3}
          ></input>
          <input
            ref={timerS}
            className="secondsInput"
            type="tel"
            id="timerSecond"
            value={props.valueS}
            onInput={(e) => {
              props.setCursor({ start: props.caret, end: props.caret });
            }}
            onKeyDown={(event) => {
              props.handleInput(event);
            }}
            onKeyPress={numOnly}
            maxLength={3}
            autoFocus
          ></input>
        </div>
        <div className="notation">
          <div className="notation" id="notation-h">
            <NotationH />
          </div>
          <div className="notation" id="notation-m">
            <NotationM />
          </div>
          <div className="notation" id="notation-s">
            <NotationS />
          </div>
        </div>
      </div>
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
    </div>
  );
}

export default InputHMS;
