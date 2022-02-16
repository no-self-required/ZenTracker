import React, { useState } from "react";

function Signup() {

  return (
    <div>
      <form id="login1">
        <label for="email">Email</label>
        <br />
        <input id="email" name="email" />
        <br />
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
        Sign Up
      </button>
    </div>
  );
}

export default Signup;
