import React from "react";

import Login from "./Login";
import Signup from "./Signup";

function LogInSignUp(props) {
  function loginClick() {
    props.setLoginOrSignup("login");
  }

  function signupClick() {
    props.setLoginOrSignup("signup");
  }

  return (
    <div>
      <div>{/* <div onClick={signupClick}>Sign Up</div> */}</div>
      {props.loginOrSignup === "login" && (
        <>
          <div onClick={loginClick}>Login</div>
          <Login></Login>
          <div onClick={signupClick}>Sign Up</div>
        </>
      )}
      {props.loginOrSignup === "signup" && (
        <>
          <div onClick={signupClick}>Sign Up</div>
          <Signup></Signup>
          <div onClick={loginClick}>Login</div>
        </>
      )}
    </div>
  );
}

export default LogInSignUp;
