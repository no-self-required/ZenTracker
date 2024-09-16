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

  return (
    <div
      ref={refs.setReference}
      className={`day-${props.daysIndex + 1} single-day`}
      id={props.calcColor(
        props.totalSessionsUser(props.array2[props.weekIndex][props.daysIndex])
      )}
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
          </span>
        </>
      )}
    </div>
  );
}

export default SingleDay;
