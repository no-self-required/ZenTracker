import React from "react";
import "../../styling/singleday.scss";

import startOfYear from "date-fns/startOfYear";
import format from 'date-fns/format'

function SingleDay(props) {
  //only works for current year
  const allYearSessions = props.allYearSessions
  // console.log('allYearSessions', allYearSessions)
  // let year;
  // for (const yearArray of allYearSessions) {
  //   for (const weekArray of yearArray) {
  //     for (const dayArray of weekArray) {
  //       if(dayArray[0]) {
  //         // year = dayArray[0].year
  //         console.log('dayyarray 0', dayArray[0])
  //       }
  //     }
  //   }
  // }

  //get year of last element of allYearSessions
  
  // console.log('year', year)
  const date = new Date();
  const startYearDate = startOfYear(new Date(date));
  const daysToAdd = 7*props.weekIndex+props.daysIndex
  startYearDate.setDate(startYearDate.getDate() + daysToAdd)
  const formatted = format(new Date(startYearDate), "PPP")
  // console.log('formatted', formatted)
  // const functionHandler = () => {
  //   props.passChildData(daysToAdd)
  // }

  // functionHandler();

  // Need to show correct year for different years of printSqs
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
