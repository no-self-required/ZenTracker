import React, { useContext } from "react";
import { UserContext } from "../App";
import { useNavigate } from "react-router-dom";

import "../styling/logout.scss";
//clear jwt, usercontext logged in: set user data: false
function Logout() {
  const { userData, setUserData } = useContext(UserContext);
  const navigate = useNavigate();

  function logOut(event) {
    
    event.preventDefault();
    setUserData({    
      token: undefined,
      user: undefined,
    })
    localStorage.setItem("token", '');
    localStorage.setItem("udata", '');
    navigate("/");
  }
  return <div className="logout" onClick={logOut}>Log out</div>;
}

export default Logout
