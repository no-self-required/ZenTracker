import React, {useState, useEffect, useRef}from "react";

function TimerHMS(props) {

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

  //prevent  clickaccess to 0 
  // useEffect(() => {
  //   if (!selection4) return;
  //   const { start, end } = selection4;
  //   timerH.current.setSelectionRange(start, end);
  // }, [selection4]);

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

  
  return (
    <div>
      <input
        className="hoursInput"
        type="text"
        id="timerHour"
        value={props.valueH}
        onChange={props.onChangeH}
        onKeyDown={handleKeyDown}
        onKeyPress={numOnly}
        maxLength={3}
      ></input>
      <input
        className="minutesInput"
        type="text"
        id="timerMinute"
        value={props.valueM}
        onChange={props.onChangeM}
        onKeyDown={handleKeyDown}
        onKeyPress={numOnly}
        maxLength={3}
      ></input>
      <input
        className="secondsInput"
        type="text"
        id="timerSecond"
        value={props.valueS}
        onChange={props.onChangeS}
        onKeyDown={handleKeyDown}
        onKeyPress={numOnly}
        maxLength={3}
      ></input>
    </div>
  );
}

export default TimerHMS;
