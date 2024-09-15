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
    <div className="account-container">
      {props.loginOrSignup === "login" && (
        <>
          <div className="account-header">Login</div>
          <Login></Login>
          <div className="account-switch-message">
            New user?
            <div className="account-switch" onClick={signupClick}>Sign up</div>
          </div>
        </>
      )}
      {props.loginOrSignup === "signup" && (
        <>
          <div className="account-header">Sign Up</div>
          <Signup></Signup>
          <div className="account-switch-message">Have an account already?<div className="account-switch" onClick={loginClick}>Log in</div></div>
        </>
      )}
    </div>
  );
}

export default LogInSignUp;
