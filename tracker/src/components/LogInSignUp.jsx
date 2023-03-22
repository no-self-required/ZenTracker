import React from "react";

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
        <div onClick={loginClick}>Log In</div>
        <div onClick={signupClick}>Sign Up</div>
      </div>
      {props.loginOrSignup === 'login' && <Login></Login>}
      {props.loginOrSignup === 'signup' && <Signup></Signup>}
    </div>
  );
}

export default LogInSignUp;
