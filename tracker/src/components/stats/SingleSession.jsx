import React from "react";
// import { UserContext } from "../../App";
import axios from 'axios';

import '../../styling/profilestats.scss'


function SingleSession(props) {
  // const { userData, setUserData } = useContext(UserContext);

  const id = props.sessionId;

  async function deleteSession() {
    // const userid = userData.user.id;
    const userid = props.currentData.user.id
    // console.log("current data userid", props.currentData.user.id)
    
    await axios.put(`/api/users/${userid}`, {
      $pull: { sessions: { id: id} }
    });

  }

  function deleteRefresh() {
    deleteSession();
    props.getSessions()
  }
  return (
    <div>
      <div>
      date: {props.date}
      <br/>
      length: {props.length}
      <br/>
      {props.log && <div>log: {props.log}</div>}
      {/* log: {props.log} */}
      </div> 
      <button className="delete-button" onClick={deleteRefresh}>Delete</button>
    </div>
  )
}

export default SingleSession;
