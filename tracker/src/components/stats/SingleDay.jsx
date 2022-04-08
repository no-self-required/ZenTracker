import React from "react";
import "../../styling/singleday.scss";

import startOfYear from "date-fns/startOfYear";
import format from 'date-fns/format'

function SingleDay(props) {
  const date = new Date();
  const startYearDate = startOfYear(new Date(date));
  const daysToAdd = 7*props.weekIndex+props.daysIndex
  startYearDate.setDate(startYearDate.getDate() + daysToAdd)
  const formatted = format(new Date(startYearDate), "PPP")

  return (
    <div
      className={`day-${props.daysIndex + 1} single-day`}
      id={props.calcColor(props.totalSessionsUser(props.array1[props.weekIndex][props.daysIndex]))}
    >
        {(props.totalSessionsUser(props.array1[props.weekIndex][props.daysIndex]) === 0 || props.totalSessionsUser(props.array1[props.weekIndex][props.daysIndex]) > 1) && <span class="tooltiptext">{props.totalSessionsUser(props.array1[props.weekIndex][props.daysIndex])} sessions on {formatted}
        </span>}
        {props.totalSessionsUser(props.array1[props.weekIndex][props.daysIndex]) === 1 && <span class="tooltiptext">{props.totalSessionsUser(props.array1[props.weekIndex][props.daysIndex])} session on {formatted}
        </span>}
    </div>
  );
}

export default SingleDay;
