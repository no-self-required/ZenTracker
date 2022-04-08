import React, { useContext, useEffect } from "react";
import { UserContext } from "../../App";
import axios from 'axios';

import '../../styling/profilestats.scss'


function SingleSession(props) {
  const { userData, setUserData } = useContext(UserContext);
  // console.log('sessionid:', props.sessionId)
  const id = props.sessionId;

  async function deleteSession() {
    const userid = userData.user.id;

    await axios.put(`/api/users/${userid}`, {
      $pull: { sessions: { id: id} }
    });

  }

  // $unset: { ['sessions.'+id] : ''}

  function deleteRefresh() {
    deleteSession();
    // window.location.href = "/profile";
  }
  return (
    <div>
      <div>
      date: {props.date}
      <br/>
      length: {props.length}
      <br/>
      log: {props.log}
      </div> 
      <button className="delete-button" onClick={deleteRefresh}>Delete</button>
    </div>
  )
}

export default SingleSession;
