import { React } from "react";

export default function ToolTipSingle(props) {

  return (
    <>
      <span
        className="tooltiptext"
      >
        {props.totalSessionsUser(
          props.array2[props.weekIndex][props.daysIndex]
        )}{" "}
        session on {props.formatted}
      </span>
    </>
  );
}
