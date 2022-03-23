import React, { useState, useEffect } from "react";
import axios from 'axios';
import SingleSession from "./SingleSession";

function ProfileStats() {
  const [ currentData, setCurrentData] = useState()

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

  // console.log('currentData', currentData)

  if(currentData) {
    let sessionsData = currentData.user.sessions
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
          <SingleSession sessionId={sessionsData[key].id} date={sessionsData[key].date} length={sessionsData[key].length} log={sessionsData[key].log} />
        </div>
      );
    });
    
    return (
      <div>
        <div>Total Sessions: {totalSessions()}</div>
        <div>{allSessions}</div>
      </div>
    );
  }

  // let data = JSON.parse(localStorage.getItem("udata"));
  // console.log("udata profilestats", data);
  // const sessions = data.sessions;
  // console.log("sessions", sessions);


  return(<div></div>)

}

export default ProfileStats;
