import React from "react";
// import "../../styling/everyInput.scss";

export default function Input({onChange, value, onClick, innerRef, onInput, id, onKeyDown}) {

  return (
    <>
      <div className="inputWrapper">
        <div className="inputs">
          <input
            ref={innerRef}
            value={value}
            onClick={onClick}
            onChange={(e) => onChange(e.target.value)}
            maxLength={2}
            onKeyDown={onKeyDown}
            id={id}
          ></input>
        </div>
      </div>
    </>
  );
}
