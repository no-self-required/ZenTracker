import {React, useRef} from "react";
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
  arrow,
  FloatingArrow,
} from "@floating-ui/react";

function SingleDay(props) {
  //new Date() applies current year to every calendar

  //create date given: year

  //Find monthIndex, days
  //display proper year here
  //Get date from database and calculate year from that
  const date = new Date();
  const startYearDate = startOfYear(new Date(date));

  const daysToAdd = 7 * props.weekIndex + props.daysIndex;

  startYearDate.setDate(startYearDate.getDate() + daysToAdd);

  let newDateProperYear = setYear(startYearDate, props.year);
  let formatted = format(new Date(newDateProperYear), "PPP");

  const arrowRef = useRef(null);
  const ARROW_HEIGHT = 5;
  const GAP = 5;
  
  const { x, y, strategy, refs, context } = useFloating({
    placement: "top",
    middleware: [
      offset({
        alignmentAxis: -20,
      }),
      flip(),
      shift(),
      // arrow({
      //   element: arrowRef,
      // }),
    ],
    whileElementsMounted(...args) {
      const cleanup = autoUpdate(...args, { animationFrame: true });
      return cleanup;
    },
  });

  return (
    <div
      ref={refs.setReference}
      className={`day-${props.daysIndex + 1} single-day`}
      id={props.calcColor(
        props.totalSessionsUser(props.array2[props.weekIndex][props.daysIndex])
      )}
    >
      {(props.totalSessionsUser(
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
          {/* <FloatingArrow ref={arrowRef} context={context}/> */}

          </span>
        </>
      )}
      {props.totalSessionsUser(
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
            {/* <FloatingArrow ref={arrowRef} context={context}/> */}

          </span>

        </>
      )}
    </div>
  );
}

export default SingleDay;
