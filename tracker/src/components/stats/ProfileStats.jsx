import React, { useState, useEffect, useContext, Fragment, useRef } from "react";
import axios from "axios";
import SingleSession from "./SingleSession";
import SingleDay from "./SingleDay";
import Modal from "react-modal";
import { UserContext } from "../../App";
import { v4 as uuidv4 } from "uuid";

import getDayOfYear from "date-fns/getDayOfYear";
import formatDuration from "date-fns/formatDuration";
import format from "date-fns/format";
import getYear from "date-fns/getYear";

import Flatpickr from 'react-flatpickr';
import 'flatpickr/dist/themes/airbnb.css';

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";

const plusIcon = <FontAwesomeIcon icon={faPlus} />;

function splitInput(initialTime) {
  const parsedTimer = parseInt(initialTime);
  const arr = Array.from(parsedTimer.toString()).map(Number);
  if (arr.length <= 5) {
    const padAmount = 6 - arr.length;
    const arr2 = [...Array(padAmount).fill(0), ...arr];
    return arr2;
  }
  return arr;
}

//temporarily calculate add new session length to seconds. (array > seconds)
function calculateSeconds(initialTime) {
  const splitArr = splitInput(initialTime);
  const seconds = [];
  const minutes = [];
  const hours = [];
  hours.push(splitArr[0], splitArr[1]);
  minutes.push(splitArr[2], splitArr[3]);
  seconds.push(splitArr[4], splitArr[5]);
  const totSec = seconds[0] * 10 + seconds[1];
  const totMin = minutes[0] * 600 + minutes[1] * 60;
  const totHours = hours[0] * 36000 + hours[1] * 3600;
  let calculatedTotalSeconds = totSec + totMin + totHours;

  //if time entered is more than 99hours, set to 99h/59m/59s
  if (calculatedTotalSeconds > 360000) {
    calculatedTotalSeconds = 359999;
  }
  return calculatedTotalSeconds;
}

function displayInputValue(totalSeconds) {
  let formatTime = totalSeconds;
  let showHours = 0;
  let showMin = 0;
  let showSec = 0;
  let formatted = [];

  while (formatTime >= 3600) {
    showHours += 1;
    formatTime -= 3600;
  }

  while (formatTime >= 60) {
    showMin += 1;
    formatTime -= 60;
  }

  if (formatTime < 60) {
    showSec = formatTime;
  }

  formatted.push(showHours);
  formatted.push(showMin);
  formatted.push(showSec);

  return formatted;
}

function ProfileStats() {
  const { userData } = useContext(UserContext);
  const [currentData, setCurrentData] = useState();
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [log, setLog] = useState("");
  const [loglength, setLoglength] = useState(0);

  //default state should be latest year
  const [selectedYear, setSelectedYear] = useState(getYear(Date.now()));

  //Input values
  const [inputTimerHour, setInputTimerHour] = useState("00");
  const [inputTimerMinute, setInputTimerMinute] = useState("00");
  const [inputTimerSecond, setInputTimerSecond] = useState("00");

  const currentDate = new Date();
  const year = currentDate.getUTCFullYear();
  const month = currentDate.getMonth();
  const day = currentDate.getDate();


  const [newDate, setNewDate] = useState(new Date());

  const token = localStorage.getItem("token");

  const [isUpdated, setIsUpdated] = useState(false);

  // const inputRef = useRef(null)

  useEffect(() => {
    const getSessions = async () => {
      if (!currentData) {
        const userResponse = await axios.get("https://zentracker.adaptable.app/api/users/profile", {
          headers: { token: token },
        });
        setCurrentData({
          user: userResponse.data,
        });
      } else if (currentData && isUpdated) {
        const userResponse = await axios.get("https://zentracker.adaptable.app/api/users/profile", {
          headers: { token: token },
        });
        if (currentData.user !== userResponse.data) {
          setCurrentData({
            user: userResponse.data,
          });
          setIsUpdated(false);
        } else {
          setCurrentData({
            user: userResponse.data,
          });
          setIsUpdated(false);
        }
      }
    };
    getSessions();
  });

  function openModal() {
    setModalIsOpen(true);
  }

  function closeModalSubmit() {
    submitSession();
    setIsUpdated(true);
    setInputTimerHour("00");
    setInputTimerMinute("00");
    setInputTimerSecond("00");
    setLog("");
    setModalIsOpen(false);
  }

  function closeModalEsc() {
    setModalIsOpen(false);
  }

  const formatDateYMD = (date) => {
    if(Array.isArray(date)){
      date = date[0]
    }
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
  
    return `${year}-${month}-${day}`;
  }

  //YYYY, MM, DD
  async function submitSession() {
    const tripleInputs = inputTimerHour + inputTimerMinute + inputTimerSecond;
    let generateId = uuidv4();
    const id = currentData.user.id;
    const constantId = generateId;
    const totalSeconds = calculateSeconds(tripleInputs);
    const length = displayInputValue(totalSeconds);
    const sessionLog = log;
    const date = formatDateYMD(newDate);

    const yearSlice = date.slice(0, 4);
    const monthSlice = date.slice(5, 7);
    const daySlice = date.slice(8, 11);
    const newFormat = [yearSlice, monthSlice - 1, daySlice];

    const dayOfYear = getDayOfYear(
      new Date(newFormat[0], newFormat[1].toString(), newFormat[2])
    );

    const formattedDate = format(
      new Date(yearSlice, monthSlice - 1, daySlice),
      "PPP"
    );

    const lengthString = formatDuration({
      hours: length[0],
      minutes: length[1],
      seconds: length[2],
    });

    //include when submitting on timer session
    const testFormat = new Date(yearSlice, monthSlice - 1, daySlice);

    await axios.put(`https://zentracker.adaptable.app/api/users/${id}`, {
      $push: {
        sessions: {
          id: constantId,
          unformattedDate: testFormat,
          date: formattedDate,
          dayOfYear: dayOfYear,
          length: lengthString,
          lengthSeconds: totalSeconds,
          year: parseInt(yearSlice),
          log: sessionLog,
        },
      },
    });
  }

  let fullYearArray = [];
  let allYearSessions = [];

  function yearArray() {
    for (let x = 0; x < 52; x++) {
      fullYearArray.push([]);
    }
  }

  function fillYearArray() {
    for (let x = 0; x < fullYearArray.length; x++) {
      fullYearArray[x].push([], [], [], [], [], [], []);
    }
  }

  function addLastDay() {
    fullYearArray.push([[]]);
  }

  yearArray();
  fillYearArray();
  addLastDay();

  function calcColor(lengthSeconds, totalSessions) {
    switch (true) {
      case totalSessions === 0:
        return "square";
      case totalSessions === 1 && lengthSeconds === 0:
        return "square-light";
      case lengthSeconds >= 0 && lengthSeconds <= 600:
        return "square-light";
      case lengthSeconds >= 600 && lengthSeconds <= 1800:
        return "square-medium";
      case lengthSeconds > 1800:
        return "square-dark";
      default:
        break;
    }
  }

  function totalSessionsUser(object) {
    let x = Object.keys(object);
    let count = 0;
    if (x) {
      for (let i = 0; i < x.length; i++) {
        count++;
      }
    }
    return count;
  }

  function totalLength(object, key) {
    let sum = 0;
    for (const obj of object) {
      sum += obj[key] || 0;
    }
    return sum;
  }

  if (currentData) {
    let sessionsData = currentData.user.sessions;

    let yearSessions = {};

    sortSessionsByYear();
    fillCalendarByYear();

    const mostSingleDaySessions = () => {
      let highestCount = 0;
      for (const year of allYearSessions) {
        for (const week of year.calendar) {
          for (const day of week) {
            if (day.length > highestCount) {
              highestCount = day.length;
            }
          }
        }
      }
      return highestCount;
    };

    const singleDaySessions = () => {
      let singleDayCount = 0;
      for (const year of allYearSessions) {
        for (const week of year.calendar) {
          for (const day of week) {
            if (day.length) {
              singleDayCount += 1;
            }
          }
        }
      }
      return singleDayCount;
    };

    function sortSessionsByYear() {
      const yearSet = new Set();

      //add all possible session years to yearSet
      for (const session of sessionsData) {
        if (!yearSet.has(session["year"])) {
          yearSet.add(session["year"]);
          yearSet.forEach((year) => (yearSessions[year] = []));
        }
      }

      //if year exists in set,
      for (const session of sessionsData) {
        if (yearSet.has(session["year"])) {
          const year = session["year"];
          yearSessions[year].push(session);
        }
      }
    }

    //Calculate number of all sessions
    function totalSessions() {
      let count = 0;
      for (let i = 0; i < sessionsData.length; i++) {
        count += 1;
      }
      return count;
    }

    //Calculate total time of all sessions
    function totalTime() {
      let totalTimeInSeconds = 0;
      for (const object of sessionsData) {
        for (const property in object) {
          if (property === "lengthSeconds") {
            totalTimeInSeconds += object[property];
          }
        }
      }

      const formatedLength = displayInputValue(totalTimeInSeconds);
      const displayString =
        Math.round(formatedLength[0]) +
        "h " +
        Math.round(formatedLength[1]) +
        "m " +
        Math.round(formatedLength[2]) +
        "s ";
      return displayString;
    }

    //Calculate average time of all sessions
    function averageLength() {
      let totalTimeInSeconds = 0;
      for (const object of sessionsData) {
        for (const property in object) {
          if (property === "lengthSeconds") {
            totalTimeInSeconds += object[property];
          }
        }
      }

      let count = 0;
      for (let i = 0; i < sessionsData.length; i++) {
        count += 1;
      }

      const averageSeconds = totalTimeInSeconds / count;
      const formatedLength = displayInputValue(averageSeconds);

      const displayString =
        Math.round(formatedLength[0]) +
        "h " +
        Math.round(formatedLength[1]) +
        "m " +
        Math.round(formatedLength[2]) +
        "s ";
      return displayString;
    }

    //Caluculate longest session length
    function longestLength() {
      let longestLength = 0;
      for (const object of sessionsData) {
        for (const property in object) {
          if (property === "lengthSeconds") {
            if (object[property] > longestLength) {
              longestLength = object[property];
            }
          }
        }
      }
      const formatedLength = displayInputValue(longestLength);
      const displayString =
        Math.round(formatedLength[0]) +
        "h " +
        Math.round(formatedLength[1]) +
        "m " +
        Math.round(formatedLength[2]) +
        "s ";
      return displayString;
    }

    //sort sessions to show latest session at the top
    const sortedSessionsByDay = sessionsData.sort(function (a, b) {
      if (a.year === b.year) {
        return b.dayOfYear - a.dayOfYear;
      }
      return a.year < b.year ? 1 : -1;
    });

    //display all sessions with the sorted data
    const allSessions = Object.keys(sortedSessionsByDay).map(function (key) {
      return (
        <div id="single-session-container" key={key}>
          <SingleSession
            currentData={currentData}
            sessionId={sessionsData[key].id}
            date={sessionsData[key].date}
            length={sessionsData[key].length}
            log={sessionsData[key].log}
            setIsUpdated={setIsUpdated}
          />
        </div>
      );
    });

    const customStyles = {
      content: {
        top: "50%",
        left: "50%",
        right: "auto",
        bottom: "auto",
        marginRight: "-50%",
        transform: "translate(-50%, -50%)",
        border: "1px solid black",
        borderRadius: ".5em",
        width: "264.875px",
      },
    };

    //clone fullYearArray, fill it with sessions based on year from yearSessions
    function fillCalendarByYear() {
      for (const yearKey of Object.values(yearSessions)) {
        const clonedArray = structuredClone(fullYearArray);
        let year;
        for (const session of yearKey) {
          year = session["year"];
          const dayOfYear = session["dayOfYear"];
          const index = dayOfYear - 1;
          const calcIndexRemainder = index % 7;
          const weekIndex = Math.floor(index / 7);
          clonedArray[weekIndex][calcIndexRemainder].push(session);
        }
        allYearSessions.push({ year: year, calendar: clonedArray });
      }
    }

    //loop through year calendar (nested array)
    //count all days with sessions
    function totalSessionYear(yearArray) {
      let count = 0;
      for (const week of yearArray) {
        for (const day of week) {
          if (day) {
            count += day.length;
          }
        }
      }
      return count;
    }

    const listAllYears = () => {
      let allYears = [];
      for (const year of allYearSessions) {
        allYears.push(year.year);
      }
      return allYears.reverse();
    };

    const printSqs = allYearSessions.map((year, yearIndex, array1) => {
      if (selectedYear === year.year) {
        return (
          <Fragment key={year}>
            <div className="stats-header" id="calendar-header">
              {totalSessionYear(year.calendar)} sessions in {selectedYear}
            </div>
            <div className={`year-${yearIndex + 1} year`}>
              <div id="month-row">
                <div>Jan</div>
                <div id="feb">Feb</div>
                <div id="mar">Mar</div>
                <div id="apr">Apr</div>
                <div id="may">May</div>
                <div id="jun">Jun</div>
                <div id="jul">Jul</div>
                <div id="aug">Aug</div>
                <div id="sep">Sep</div>
                <div id="oct">Oct</div>
                <div id="nov">Nov</div>
                <div id="dec">Dec</div>
              </div>
              <div id="week-wrapper">
                <div id="day-column">
                  <div>Mon</div>
                  <div>Wed</div>
                  <div>Fri</div>
                </div>
                {year.calendar.map((week, weekIndex, array2) => (
                  <div
                    key={`week-${weekIndex}`}
                    className={`week-${weekIndex + 1}`}
                  >
                    {week.map((days, daysIndex, array3) => (
                      <SingleDay
                        key={`${weekIndex}-${daysIndex}`}
                        year={year.year}
                        allYearSessions={allYearSessions}
                        array2={array2}
                        array3={array3}
                        daysIndex={daysIndex}
                        weekIndex={weekIndex}
                        calcColor={calcColor}
                        totalSessionsUser={totalSessionsUser}
                        totalLength={totalLength}
                      />
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </Fragment>
        );
      } else {
        return null;
      }
    });

    const allYearButtons = listAllYears().map((year) => {
      return (
        <Fragment key={year}>
          <button
            className="buttons-year"
            onClick={(e) => setSelectedYear(year)}
          >
            {year}
          </button>
        </Fragment>
      );
    });

    const legendSquares = (
      <div className="legend-container">
        <div id="less-text">Less</div>
        <span id="square"></span>
        <span id="square-light"></span>
        <span id="square-medium"></span>
        <span id="square-dark"></span>
        <div id="more-text">More</div>
      </div>
    )
    
    const charLimit = (
      <div className="charlimit">
        {loglength}/255
      </div>
    )

    return (
      <div className="profile-stats-container">
        <p className="profile-name">Username : {userData.user.username}</p>
        <div className="wrapper-stats">
          <div className="session-stats">
            <div className="stats-header">Sessions</div>
            <hr className="line" />
            <div className="stat-container">
              Total <div className="bold-stats">{totalSessions()}</div>
            </div>
            <hr className="line" />
            <div className="stat-container">
              Most in a single day{" "}
              <div className="bold-stats">{mostSingleDaySessions()}</div>
            </div>
            <hr className="line" />
            <div className="stat-container">
              Days with at least one session{" "}
              <div className="bold-stats">{singleDaySessions()}</div>
            </div>
          </div>
          <div className="time-stats">
            <div className="stats-header">Time</div>
            <hr className="line" />
            <div className="stat-container">
              Total <div className="bold-stats">{totalTime()}</div>
            </div>
            <hr className="line" />
            <div className="stat-container">
              Average session{" "}
              <div className="bold-stats">{averageLength()}</div>
            </div>
            <hr className="line" />
            <div className="stat-container">
              Longest session{" "}
              <div className="bold-stats">{longestLength()}</div>
            </div>
          </div>
        </div>
        <div className="calendar-wrapper">
          <div className="calendar-container">{printSqs}</div>
          <div className="years-legend">
            <div className="button-group">{allYearButtons}</div>
            {legendSquares}
          </div>
        </div>
        <div>
          <Modal
            isOpen={modalIsOpen}
            onRequestClose={closeModalEsc}
            style={customStyles}
            shouldCloseOnOverlayClick={false}
          >
            <div id="modal-wrapper">
              <label htmlFor="date-input">Date of session</label>
              <Flatpickr
                placeholder="Select date.."
                onChange={(date) => setNewDate(date)}
                id="date-input"
                options={{
                  altInput: true,
                  altFormat: "F j, Y",
                  dateFormat: "Y-m-d",
                  maxDate: "today",
                }}
              />
              <div className="date-container"></div>
              <div id="length-wrapper">
                <div>Length of session</div>
                <div id="input-wrapper">
                  <label htmlFor="length-input-hour">h</label>
                  <input
                    className="length-input-hour"
                    type="number"
                    min="0"
                    max="24"
                    onChange={(e) => setInputTimerHour(e.target.value)}
                  ></input>
                  <label htmlFor="length-input-minute">m</label>
                  <input
                    className="length-input-minute"
                    type="number"
                    min="0"
                    max="59"
                    onChange={(e) => setInputTimerMinute(e.target.value)}
                  ></input>
                  <label htmlFor="length-input-second">s</label>
                  <input
                    className="length-input-second"
                    type="number"
                    min="0"
                    max="59"
                    onChange={(e) => setInputTimerSecond(e.target.value)}
                  ></input>
                </div>
              </div>
              <label htmlFor="log-input">Enter a log: </label>
              <textarea
                className="logInput"
                onChange={(e) => {
                  setLog(e.target.value)
                  setLoglength(e.target.value.length)
                }}
              ></textarea>
              {charLimit}
              <button onClick={closeModalSubmit} className="submit-log">
                Submit Session
              </button>
            </div>
          </Modal>
        </div>
        <div className="all-sessions-container">
          <div className="sessions-header">
            <div className="stats-header">All Sessions</div>
            <button className="add-session" onClick={openModal}>
              {plusIcon}
            </button>
          </div>
          <hr className="line" />
          <div id="all-sessions-wrapper">{allSessions}</div>
        </div>
      </div>
    );
  }
  return <></>;
}

export default ProfileStats;