import React, { useState } from "react";
import "../../styling/singleday.scss";

import startOfYear from "date-fns/startOfYear";

function SingleDay(props) {
  const date = new Date();
  const startYearDate = startOfYear(new Date(date));
  const daysToAdd = 7*props.weekIndex+props.daysIndex
  startYearDate.setDate(startYearDate.getDate() + daysToAdd)
  
  // console.log("startyeardate", startYearDate)

  return (
    <div
      className={`day-${props.daysIndex + 1} single-day`}
      id={props.calcColor(props.totalSessionsUser(props.array1[props.weekIndex][props.daysIndex]))}
    >
      <span class="tooltiptext">
        {props.totalSessionsUser(props.array1[props.weekIndex][props.daysIndex])} sessions on {startYearDate.toString()}
      </span>
    </div>
  );
}

export default SingleDay;
