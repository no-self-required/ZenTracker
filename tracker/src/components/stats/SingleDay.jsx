import React from "react";
import "../../styling/singleday.scss";

import startOfYear from "date-fns/startOfYear";
import format from 'date-fns/format';

function SingleDay(props) {
  // console.log("array3", props.array3)
  //extract year from date inside sessions? ****

  //can possibly get date instead
  //Can input date format needed to get year
  // const getDate = (weekSessions) => {
  //   let date;
  //   for (const element of weekSessions) {
  //     if (element[0]) {
  //       date = element[0].unformattedDate
  //       break;
  //     }
  //   }
  //   return date;
  // }

  // let dateOfCalendar = getDate(props.array3);
  // console.log("dateofcalendar", dateOfCalendar)
  //make new date with year given


  //new Date() applies current year to every calendar
  const date = new Date();
  // console.log("newDate", new Date(2000, 0, 1))
  const startYearDate = startOfYear(new Date(date));
  const daysToAdd = 7*props.weekIndex+props.daysIndex
  startYearDate.setDate(startYearDate.getDate() + daysToAdd)
  // console.log("startYearDate", startYearDate)
  const formatted = format(new Date(startYearDate), "PPP")

  
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
