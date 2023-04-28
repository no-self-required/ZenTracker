import React from "react";
import axios from "axios";

import "../../styling/profilestats.scss";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash } from '@fortawesome/free-solid-svg-icons'

const trashIcon = <FontAwesomeIcon icon={faTrash} />

function SingleSession(props) {
  // const { userData, setUserData } = useContext(UserContext);

  const id = props.sessionId;

  //stays as pending? actually gets deleted
  async function deleteSession() {
    const userid = props.currentData.user.id;
    await axios.put(`https://zentracker.herokuapp.com/api/users/${userid}`, {
      $pull: { sessions: { id: id } },
    });
  }

  function deleteRefresh() {
    deleteSession();
    props.setIsUpdated(true);
  }
  return (
    <>
      <div className="session-info-container">
        <div className="stat-container">
          Date <div>{props.date}</div>
        </div>
        <hr className="line-single" />
        <div className="stat-container">
          Length <div>{props.length}</div>
        </div>
        {props.log && (
          <>
            <hr className="line-single" />
            <div className="stat-container">
              Log <div id="log-container">{props.log}</div>
            </div>
          </>
        )}
      </div>
      <button className="delete-button" onClick={deleteRefresh}>
        {trashIcon}
      </button>
    </>
  );
}

export default SingleSession;
