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
          <div class="account-header">Login</div>
          <Login></Login>
          <div>
            New user?
            <div class="account-switch" onClick={signupClick}>Sign up</div>
          </div>
        </>
      )}
      {props.loginOrSignup === "signup" && (
        <>
          <div className="account-header">Sign Up</div>
          <Signup></Signup>
          Have an account already?<div class="account-switch" onClick={loginClick}>Log in</div>
        </>
      )}
    </div>
  );
}

export default LogInSignUp;
