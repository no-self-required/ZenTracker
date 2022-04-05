import React, { useState } from "react";

import Login from "./Login";
import Signup from "./Signup";

function LogInSignUp(props) {


  function loginClick() {
    props.setLoginOrSignup('login');
  }

  function signupClick() {
    props.setLoginOrSignup('signup');
  }

  return (
    <div>
      <div>
        <p onClick={loginClick}>Log In</p>
        <p onClick={signupClick}>Sign Up</p>
      </div>
      {props.loginOrSignup === 'login' && <Login></Login>}
      {props.loginOrSignup === 'signup' && <Signup></Signup>}
    </div>
  );
}

export default LogInSignUp;
