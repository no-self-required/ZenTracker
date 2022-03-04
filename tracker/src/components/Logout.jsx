import React, { useContext } from "react";
import { UserContext } from "../App";

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
  return <div onClick={logOut}>Log out</div>;
}

export default Logout
