import React, { useState } from "react";


function Login() {

  return (
    <div>
      <form id="login1">
        <label for="username">Username</label>
        <br />
        <input id="username" name="username" />
        <br />
        <label for="password">Password</label>
        <br />
        <input id="password" name="password" />
        <br />
      </form>
      <button type="submit" form="login1" value="Login">
        Login
      </button>
    </div>
  );
}

export default Login;