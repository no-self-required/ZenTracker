import React, { useContext } from "react";
import { UserContext } from "../../App";

function ProfileStats() {
  let data = JSON.parse(localStorage.getItem("udata"))
  console.log('udata profilestats', data)
  const sessions = data.sessions
  console.log('sessions', sessions)

  //sessions: 
  const allSessions = Object.keys(sessions).map(function(key){
    return (
      <div>
        Date: {sessions[key].date}
        <br/>
        Length: {sessions[key].length}
        <br/>
        Log: {sessions[key].log}
      </div>
    )
  })

  return <div>{allSessions}</div>;
}

export default ProfileStats;

{/* <SingleSession
key={i}
date={i.date}
length={i.length}
log={i.log}
/> */}