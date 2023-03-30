import React from "react";
import "../../styling/singleday.scss";

import startOfYear from "date-fns/startOfYear";
import setYear from "date-fns/setYear";
import format from "date-fns/format";

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

  
  return (
    <div
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
        <span class="tooltiptext">
          {props.totalSessionsUser(
            props.array2[props.weekIndex][props.daysIndex]
          )}{" "}
          sessions on {formatted}
        </span>
      )}
      {props.totalSessionsUser(
        props.array2[props.weekIndex][props.daysIndex]
      ) === 1 && (
        <span class="tooltiptext">
          {props.totalSessionsUser(
            props.array2[props.weekIndex][props.daysIndex]
          )}{" "}
          session on {formatted}
        </span>
      )}
    </div>
  );
}

export default SingleDay;
