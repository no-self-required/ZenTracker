import React, { useContext } from "react";
import { UserContext } from "../App";
import { useNavigate } from "react-router-dom";

import "../styling/logout.scss";
//clear jwt, usercontext logged in: set user data: false
function Logout(props) {
  const { setUserData } = useContext(UserContext);
  const navigate = useNavigate();

  function logOut(event) {
    event.preventDefault();
    setUserData({    
      token: undefined,
      user: undefined,
    })
    localStorage.setItem("token", '');
    localStorage.setItem("user", '');
    props.handleShowNavbar();
    props.handleHam();
    navigate("/");
  }
  return <p className="logout" onClick={logOut}>Log out</p>;
}

export default Logout
