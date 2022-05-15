import React from "react";
import "../../styling/singleday.scss";

import startOfYear from "date-fns/startOfYear";
import format from 'date-fns/format';

function SingleDay(props) {

  //new Date() applies current year to every calendar

  //create date given: year

  //Find monthIndex, days
  const date = new Date();
  const startYearDate = startOfYear(new Date(date));
  // console.log("weekindex, daysindex", props.weekIndex, props.daysIndex)


  const daysToAdd = 7*props.weekIndex+props.daysIndex
  startYearDate.setDate(startYearDate.getDate() + daysToAdd)
  // console.log("startYearDate", startYearDate)
  const formatted = format(new Date(startYearDate), "PPP")

  //function profilestats as callback to singleday > onclick function changes state inside profilestats

  return (
    <div
      className={`day-${props.daysIndex + 1} single-day`}
      id={props.calcColor(props.totalSessionsUser(props.array2[props.weekIndex][props.daysIndex]))}
      // onClick={props.showSessions}
    >
        {(props.totalSessionsUser(props.array2[props.weekIndex][props.daysIndex]) === 0 || props.totalSessionsUser(props.array2[props.weekIndex][props.daysIndex]) > 1) && <span class="tooltiptext">{props.totalSessionsUser(props.array2[props.weekIndex][props.daysIndex])} sessions on {formatted}
        </span>}
        {props.totalSessionsUser(props.array2[props.weekIndex][props.daysIndex]) === 1 && <span class="tooltiptext">{props.totalSessionsUser(props.array2[props.weekIndex][props.daysIndex])} session on {formatted}
        </span>}
    </div>
  );
}

export default SingleDay;
