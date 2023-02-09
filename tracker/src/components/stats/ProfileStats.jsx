import React, { useState, useEffect } from "react";
import axios from "axios";
import SingleSession from "./SingleSession";
import SingleDay from "./SingleDay";
import Modal from "react-modal";

import { v4 as uuidv4 } from "uuid";

import getDayOfYear from "date-fns/getDayOfYear";
import formatDuration from "date-fns/formatDuration";
import format from "date-fns/format";
import getYear from "date-fns/getYear";

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
  // console.log("splitArray inside calc seconds", splitArr);
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
  const [currentData, setCurrentData] = useState();
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [log, setLog] = useState("");

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

  // console.log("currentDate check", year, month, day)

  const [newDate, setNewDate] = useState(`${year}, ${month + 1}, ${day}`);

  const token = localStorage.getItem("token");

  const [isUpdated, setIsUpdated] = useState(false);

  //after 5 add/delete sessions, site freezes => /profile doesnt load
  //use debugger to find freezing

  useEffect(() => {
    const getSessions = async () => {
      if (!currentData) {
        const userResponse = await axios.get("/api/users/profile", {
          headers: { token: token },
        });
        setCurrentData({
          user: userResponse.data,
        });
      } else if (currentData && isUpdated) {
        const userResponse = await axios.get("/api/users/profile", {
          headers: { token: token },
        });

        // if (!compareProfiles(currentData.user, userResponse.data)) {
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

  //suspect that delete session changes something about the comparisons of profiles
  // function compareProfiles(profileA, profileB) {
  //   let sessionsEqual = profileA.sessions.length && profileB.sessions.length
  //   if (sessionsEqual) {
  //     profileA.sessions.forEach((_element, index) => { sessionsEqual = sessionsEqual && compareSessions(profileA.sessions[index], profileB.sessions[index])})
  //   }
  //   return profileA.id === profileB.id && profileA.username === profileB.username && profileA.email === profileB.email && sessionsEqual
  // }

  // function compareSessions(sessionsA, sessionsB) {
  //   console.log("sessionsA, sessionsB", sessionsA, sessionsB)
  //   //userResponse.data becomes undefined after delete session

  //   return sessionsA.id === sessionsB.id && sessionsA.date === sessionsB.date && sessionsA.dayOfYear === sessionsB.dayOfYear && sessionsA.length === sessionsB.length && sessionsA.lengthSeconds === sessionsB.lengthSeconds && sessionsA.year === sessionsB.year && sessionsA.log === sessionsB.log
  // }

  function openModal() {
    setModalIsOpen(true);
  }

  function closeModalSubmit() {
    submitSession();
    setIsUpdated(true);
    setInputTimerHour("00");
    setInputTimerMinute("00");
    setInputTimerSecond("00");
    setModalIsOpen(false);
  }

  function closeModalEsc() {
    setModalIsOpen(false);
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
    const date = newDate;

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

    await axios.put(`/api/users/${id}`, {
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

  function calcColor(numOfSessions) {
    switch (true) {
      case numOfSessions === 0:
        return "square";
      case numOfSessions === 1:
      case numOfSessions === 2:
        return "square-light";
      case numOfSessions === 3:
      case numOfSessions === 4:
        return "square-medium";
      case numOfSessions > 4:
        return "square-dark";
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
      // console.log("sessionsData", sessionsData)
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
      // console.log("sessionsData", sessionsData)
      let count = 0;
      for (const key in Object.keys(sessionsData)) {
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
      const lengthString = formatDuration({
        hours: formatedLength[0],
        minutes: formatedLength[1],
        seconds: formatedLength[2],
      });
      return lengthString;
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
      for (const key in Object.keys(sessionsData)) {
        count += 1;
      }

      const averageSeconds = totalTimeInSeconds / count;
      const formatedLength = displayInputValue(averageSeconds);
      const lengthString = formatDuration({
        hours: formatedLength[0],
        minutes: formatedLength[1],
        seconds: Math.floor(formatedLength[2]),
      });
      return lengthString;
    }

    //Caluculate longest session length
    function longestLength() {
      let longestLength = 0;
      for (const object of sessionsData) {
        // console.log('object', object)
        for (const property in object) {
          if (property === "lengthSeconds") {
            if (object[property] > longestLength) {
              longestLength = object[property];
            }
          }
        }
      }
      const formatedLength = displayInputValue(longestLength);
      const lengthString = formatDuration({
        hours: formatedLength[0],
        minutes: formatedLength[1],
        seconds: formatedLength[2],
      });
      return lengthString;
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
        <div id="single-session-container">
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
      },
    };

    //Assign year to each yearCalendar
    //ex:
    //[{year: 2021, calendar: Array(53)}, {year: 2022, calendar: Array(53)}]

    //clone fullYearArray, fill it with sessions based on year from yearSessions
    function fillCalendarByYear() {
      for (const yearKey of Object.values(yearSessions)) {
        const clonedArray = structuredClone(fullYearArray);
        let year;
        for (const session of yearKey) {
          // console.log("session", session)
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

    /**
     * n year -> 52 weeks -> 7 days
     * 2
     * CalendarArray = [2][52][7]{ sessionData: sessionData | null }
     * [52]
     * [{weeks: [52], year: 2018}]
     *
     */

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
      console.log("allYearSessions", allYearSessions);
      if (selectedYear === year.year)
        return (
          <>
            <div className="stats-header">
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
                <div>
                  Mon
                </div>
                <div>
                  Wed
                </div>
                <div>
                  Fri
                </div>
              </div>
                {year.calendar.map((week, weekIndex, array2) => {
                  return (
                    <div className={`week-${weekIndex + 1}`}>
                      {week.map((days, daysIndex, array3) => {
                        return (
                          <SingleDay
                            year={year.year}
                            allYearSessions={allYearSessions}
                            array2={array2}
                            array3={array3}
                            daysIndex={daysIndex}
                            weekIndex={weekIndex}
                            calcColor={calcColor}
                            totalSessionsUser={totalSessionsUser}
                          ></SingleDay>
                        );
                      })}
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        );
    });

    // const sqsWrapper = (
    //   <>
    //     <div id="month-row">Jan</div>
    //     {printSqs}
    //   </>
    // );

    const allYearButtons = listAllYears().map((year) => {
      return (
        <>
          <button onClick={(e) => setSelectedYear(year)}>{year}</button>
        </>
      );
    });

    return (
      <div className="profile-stats-container">
        <div className="session-stats">
          <div className="stats-header">Sessions</div>
          <hr className="line" />
          <div className="stat-container">
            Total <div>{totalSessions()}</div>
          </div>
          <hr className="line" />
          <div className="stat-container">
            Most in a single day <div>{mostSingleDaySessions()}</div>
          </div>
          <hr className="line" />
          <div className="stat-container">
            Days with at least one session <div>{singleDaySessions()}</div>
          </div>
        </div>
        <div className="time-stats">
          <div className="stats-header">Time</div>
          <hr className="line" />
          <div className="stat-container">
            Total <div>{totalTime()}</div>
          </div>
          <hr className="line" />
          <div className="stat-container">
            Average session length <div>{averageLength()}</div>
          </div>
          <hr className="line" />
          <div className="stat-container">
            Longest session length <div>{longestLength()}</div>
          </div>
        </div>
        <div className="calendar-container">
          {printSqs}
          <div className="button-group">{allYearButtons}</div>
        </div>
        <div>
          <Modal
            isOpen={modalIsOpen}
            onRequestClose={closeModalEsc}
            style={customStyles}
            shouldCloseOnOverlayClick={false}
          >
            <label for="date-input">Date of session:</label>
            <input
              className="date-input"
              type="date"
              onChange={(e) => setNewDate(e.target.value)}
            ></input>
            <div>
              <div>Length of session:</div>
              <div>h</div>
              <input
                className="length-input-hour"
                type="number"
                min="0"
                max="24"
                onChange={(e) => setInputTimerHour(e.target.value)}
              ></input>
              <div>m</div>
              <input
                className="length-input-minute"
                type="number"
                min="0"
                max="59"
                onChange={(e) => setInputTimerMinute(e.target.value)}
              ></input>
              <div>s</div>
              <input
                className="length-input-second"
                type="number"
                min="0"
                max="59"
                onChange={(e) => setInputTimerSecond(e.target.value)}
              ></input>
            </div>
            <label for="logInput">Log:</label>
            <input
              className="logInput"
              onChange={(e) => setLog(e.target.value)}
            ></input>
            <button onClick={closeModalSubmit}>submit</button>
          </Modal>
        </div>
        <div className="all-sessions-container">
          <button className="add-session" onClick={openModal}>
            Add session
          </button>
          <div className="stats-header">All Sessions</div>
          <hr className="line" />
          {allSessions}
        </div>
      </div>
    );
  }
  return <></>;
}

export default ProfileStats;
