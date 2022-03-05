import React, { useContext } from "react";
import { UserContext } from "../App";
import "../styling/logout.scss";
//clear jwt, usercontext logged in: set user data: false
function Logout() {
  const { userData, setUserData } = useContext(UserContext);

  function logOut(event) {
    event.preventDefault();
    setUserData({    
      token: undefined,
      user: undefined,
    })
    localStorage.setItem("token", '');
    window.location.href = "/";
  }
  return <div className="logout" onClick={logOut}>Log out</div>;
}

export default Logout
