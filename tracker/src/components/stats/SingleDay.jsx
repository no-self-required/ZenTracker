import { React, useState} from "react";
import "../../styling/singleday.scss";

import startOfYear from "date-fns/startOfYear";
import setYear from "date-fns/setYear";
import format from "date-fns/format";

import {
  useFloating,
  offset,
  flip,
  shift,
  autoUpdate,
} from "@floating-ui/react";

function SingleDay(props) {
  const date = new Date();
  const startYearDate = startOfYear(new Date(date));

  const daysToAdd = 7 * props.weekIndex + props.daysIndex;

  startYearDate.setDate(startYearDate.getDate() + daysToAdd);

  let newDateProperYear = setYear(startYearDate, props.year);
  let formatted = format(new Date(newDateProperYear), "PPP");

  const secToMin = (totalSeconds) => {
    return Math.round(totalSeconds / 60)
  }

  const { x, y, strategy, refs } = useFloating({
    placement: "top",
    middleware: [
      offset({
        alignmentAxis: -20,
      }),
      flip(),
      shift(),
    ],
    whileElementsMounted: autoUpdate,
  });

  const [isOpen, setIsOpen] = useState(false);
  const getLength = props.totalLength(props.array2[props.weekIndex][props.daysIndex], 'lengthSeconds')
  const getTotalSessions = props.totalSessionsUser(props.array2[props.weekIndex][props.daysIndex])

  return (
    <div
      ref={refs.setReference}
      className={`day-${props.daysIndex + 1} single-day`}
      id={props.calcColor(getLength, getTotalSessions)}
      onMouseEnter={e => setIsOpen(true)}
      onMouseLeave={e => setIsOpen(false)}
    >
      {isOpen &&
        (props.totalSessionsUser(
          props.array2[props.weekIndex][props.daysIndex]
        ) === 0 ||
          props.totalSessionsUser(
            props.array2[props.weekIndex][props.daysIndex]
          ) > 1) && (
          <>
            <span
              ref={refs.setFloating}
              style={{
                position: strategy,
                top: y ?? 0,
                left: x ?? 0,
                width: "max-content",
              }}
              className="tooltiptext"
            >
              {props.totalSessionsUser(
                props.array2[props.weekIndex][props.daysIndex]
              )}{" "}
              sessions on {formatted}
              <br/>
              {secToMin(getLength) <= 1 ? 
               <>
               Total length: {secToMin(getLength)} minute
               </> 
               :
               <>
               Total length: {secToMin(getLength)} minutes 
               </> 
              }              
            </span>
          </>
        )}
      {isOpen && props.totalSessionsUser(
        props.array2[props.weekIndex][props.daysIndex]
      ) === 1 && (
        <>
          <span
            ref={refs.setFloating}
            style={{
              position: strategy,
              top: y ?? 0,
              left: x ?? 0,
              width: "max-content",
            }}
            className="tooltiptext"
          >
            {props.totalSessionsUser(
              props.array2[props.weekIndex][props.daysIndex]
            )}{" "}
            session on {formatted}
            <br/>
            {secToMin(getLength) <= 1 ? 
               <>
               Total length: {secToMin(getLength)} minute
               </> 
               :
               <>
               Total length: {secToMin(getLength)} minutes 
               </> 
              }  
          </span>
        </>
      )}
    </div>
  );
}

export default SingleDay;
