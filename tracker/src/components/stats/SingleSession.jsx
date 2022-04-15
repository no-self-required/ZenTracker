import React, {} from "react";
// import { UserContext } from "../../App";
import axios from 'axios';

import '../../styling/profilestats.scss'


function SingleSession(props) {
  // const { userData, setUserData } = useContext(UserContext);

  const id = props.sessionId;
  
  //stays as pending? actually gets deleted 
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
    props.setIsUpdated(true)
  }
  return (
    <div>
      <div>
      date: {props.date}
      <br/>
      length: {props.length}
      <br/>
      {props.log && <div>log: {props.log}</div>}
      </div> 
      <button className="delete-button" onClick={deleteRefresh}>Delete</button>
    </div>
  )
}

export default SingleSession;
