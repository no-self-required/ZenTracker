import React, { useState, useEffect } from "react";
import axios from "axios";
import SingleSession from "./SingleSession";
import Modal from "react-modal";
import { v4 as uuidv4 } from "uuid";

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
  console.log('formatTime inside DIV', formatTime)
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

  console.log('formatted', formatted)
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

  const [newDate, setNewDate] = useState();

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

  function closeModal() {
    submitSession();
    setInputTimerHour('00')
    setInputTimerMinute('00')
    setInputTimerSecond('00')

    setModalIsOpen(false);
  }

  async function submitSession() {
    let tripleInputs = inputTimerHour + inputTimerMinute + inputTimerSecond;
    const id = currentData.user.id;
    let generateId = uuidv4();
    const constantId = generateId;
    const totalSeconds = calculateSeconds(tripleInputs)
    const length = displayInputValue(totalSeconds)
    const sessionLog = log;
    const date = newDate;

    await axios.put(`/api/users/${id}`, {
      $set: {
        ["sessions." + constantId]: {
          id: constantId,
          date: date.toString(),
          length: length,
          log: sessionLog,
        },
      },
    });
  }

  if (currentData) {
    let sessionsData = currentData.user.sessions;
    function totalSessions() {
      let count = 0;

      for (const key in Object.keys(sessionsData)) {
        count += 1;
      }

      return count;
    }

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

    return (
      <div>
        <div>Total Sessions: {totalSessions()}</div>
        <div>
          <button className="add-session" onClick={openModal}>
            Add session
          </button>
        </div>
        <div>
          <Modal
            isOpen={modalIsOpen}
            onRequestClose={closeModal}
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
            <button onClick={closeModal}>submit</button>
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
