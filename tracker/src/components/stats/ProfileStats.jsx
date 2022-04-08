import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import SingleSession from "./SingleSession";
import SingleDay from "./SingleDay";
import Modal from "react-modal";

import { v4 as uuidv4 } from "uuid";

import getDayOfYear from "date-fns/getDayOfYear";
import startOfYear from "date-fns/startOfYear";

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
  console.log("splitArray inside calc seconds", splitArr);
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

  console.log("calculatedTotalSeconds", calculatedTotalSeconds);

  //if time entered is more than 99hours, set to 99h/59m/59s
  if (calculatedTotalSeconds > 360000) {
    calculatedTotalSeconds = 359999;
  }
  return calculatedTotalSeconds;
}

function displayInputValue(totalSeconds) {
  let formatTime = totalSeconds;
  console.log("formatTime inside DIV", formatTime);
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

  console.log("formatted", formatted);
  return formatted;
}

function ProfileStats() {
  const [currentData, setCurrentData] = useState();
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [log, setLog] = useState("");

  //Input values
  const [inputTimerHour, setInputTimerHour] = useState("00");
  const [inputTimerMinute, setInputTimerMinute] = useState("00");
  const [inputTimerSecond, setInputTimerSecond] = useState("00");

  const currentDate = new Date()
  // console.log(currentDate)
  const year = currentDate.getUTCFullYear();
  const month = currentDate.getMonth();
  const day = currentDate.getDate();
  // console.log('year, month, day', year, month, day)
  const [newDate, setNewDate] = useState(`${year}, ${month+1}, ${day}`);

  useEffect(() => {
    const isLoggedIn = async () => {
      let token = localStorage.getItem("token");
      if (token === null) {
        localStorage.setItem("token", "");
        token = "";
      }

      const tokenResponse = await axios.post("/api/users/tokenIsValid", null, {
        headers: { token: token },
      });

      if (tokenResponse.data === true) {
        const userResponse = await axios.get("/api/users/profile", {
          headers: { token: token },
        });
        setCurrentData({
          token: token,
          user: userResponse.data,
        });
      } else {
        return;
      }
    };

    isLoggedIn();
  }, [currentData]);

  function openModal() {
    setModalIsOpen(true);
  }

  function closeModalSubmit() {
    submitSession();
    setInputTimerHour("00");
    setInputTimerMinute("00");
    setInputTimerSecond("00");
    setModalIsOpen(false);
  }

  function closeModalEsc() {
    setModalIsOpen(false);
  }

  async function submitSession() {
    let tripleInputs = inputTimerHour + inputTimerMinute + inputTimerSecond;
    const id = currentData.user.id;
    let generateId = uuidv4();
    const constantId = generateId;
    const totalSeconds = calculateSeconds(tripleInputs);
    const length = displayInputValue(totalSeconds);
    const sessionLog = log;
    const date = newDate;

    console.log("date input short format", date);

    const yearSlice = date.slice(0, 4);
    const monthSlice = date.slice(5, 7);
    const daySlice = date.slice(8, 10);
    const newFormat = [yearSlice, monthSlice - 1, daySlice];
    //newDate : YYYY-MM-DD
    //fns format : yyyy, mm, dd
    const day = getDayOfYear(
      new Date(newFormat[0], newFormat[1].toString(), newFormat[2])
    );

    await axios.put(`/api/users/${id}`, {
      $push: {
        sessions:
          {
            id: constantId,
            date: date,
            dayOfYear: day,
            length: length,
            log: sessionLog,
          },
      }
    });
  }

  // await axios.put(`/api/users/${id}`, {
  //   $set: {
  //     sessions:[
  //       {
  //         id: constantId,
  //         date: date,
  //         dayOfYear: day,
  //         length: length,
  //         log: sessionLog,
  //       },
  //     ]
  //   }
  // });


  
  let fullYearArray = [];

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

  //sessionsData = current    Data.user.sessions
  const dayRef = useRef(null);

  if (currentData) {
    // fillCalendarObject()
    fillCalendar();

    // function fillCalendarObject() {
    //   for (let x = 0; x < fullYearArray.length; x++) {
    //     for (let y = 0; y < fullYearArray[x].length ; y++) {
    //       fullYearArray[x][y].push(
    //         {}
    //       );
    //     }

    //   }
    // }

    function fillCalendar() {
      let sessionKeysLength = Object.keys(currentData.user.sessions).length;
      let sessionKeys = Object.keys(currentData.user.sessions);
      // console.log("sesh keys",sessionKeys)
      for (let x = 0; x < sessionKeysLength; x++) {
        if (currentData.user.sessions) {
          const dayOfYear = currentData.user.sessions[sessionKeys[x]].dayOfYear;
          const index = dayOfYear - 1;
          const calcIndexRemainder = index % 7;
          const weekIndex = Math.floor(index / 7);
          const sessions = currentData.user.sessions[sessionKeys[x]];
          // const dayObj = {[`${currentData.user.sessions[sessionKeys[x]].date}`]: currentData.user.sessions[sessionKeys[x]]}

          //array of object of object of objects
          // dayObj[`${currentData.user.sessions[sessionKeys[x]].date}`]=currentData.user.sessions[sessionKeys[x]]
          // console.log('dayObj',dayObj)
          fullYearArray[weekIndex][calcIndexRemainder].push(sessions);
          // fullYearArray[weekIndex][calcIndexRemainder]=dayObj
        }
      }
    }

    let sessionsData = currentData.user.sessions;

    function totalSessions() {
      let count = 0;
      for (const key in Object.keys(sessionsData)) {
        count += 1;
      }
      return count;
    }

    // function calcDate(array1, index1, index2) {
    //   console.log("index1, index2" , index1, index2)
    //   console.log('array check', array1[index1][index2])
    //   if(array1[index1][index2][0]) {
    //     return array1[index1][index2][0].date
    //   }
    // }



    const allSessions = Object.keys(sessionsData).map(function (key) {
      return (
        <div>
          <div></div>
          <SingleSession
            sessionId={sessionsData[key].id}
            date={sessionsData[key].date}
            length={sessionsData[key].length}
            log={sessionsData[key].log}
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

    //can use calcdate for elements with information
    //need to assign a date to each element
    //trying to access data-date for now > then use a function to set data-date

    const printSq = fullYearArray.map((week, weekIndex, array1) => {
      return (
        <div className={`week-${weekIndex + 1}`}>
          {week.map((days, daysIndex, array2) => {
            if (currentData.user.sessions) {
              return (
                <SingleDay
                  array1={array1}
                  daysIndex={daysIndex}
                  weekIndex={weekIndex}
                  calcColor={calcColor}
                  totalSessionsUser={totalSessionsUser}
                ></SingleDay>
              );
            }
          })}
        </div>
      );
    });

    // if (currentData.user.sessions && dayRef.current) {
    //   let date = dayRef.current.getAttribute("data-date")
    //   return (
    //     <div className={`day-${daysIndex + 1} single-day`} id={calcColor(totalSessionsUser(array1[weekIndex][daysIndex]))} data-date={assignDate(array1, weekIndex, daysIndex)} ref={dayRef}>
    //       <span class="tooltiptext">
    //         {totalSessionsUser(array1[weekIndex][daysIndex])} sessions on {date}
    //       </span>
    //     </div>
    //   );
    // }
    // else{
    //   return (
    //     <div className={`day-${daysIndex + 1} single-day`} id="square" ref={dayRef}>
    //       <span class="tooltiptext">Total Sessions: 0 </span>
    //     </div>
    //   );
    // }

    // console.log('fullyeararray', fullYearArray)
    //time is currently being shown as array

    return (
      <div>
        <div>Total Sessions: {totalSessions()}</div>
        <div className="calendar-container">{printSq}</div>
        <div>
          <button className="add-session" onClick={openModal}>
            Add session
          </button>
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
        <div>{allSessions}</div>
      </div>
    );
  }

  // let data = JSON.parse(localStorage.getItem("udata"));
  // console.log("udata profilestats", data);
  // const sessions = data.sessions;
  // console.log("sessions", sessions);

  return <div></div>;
}

export default ProfileStats;
