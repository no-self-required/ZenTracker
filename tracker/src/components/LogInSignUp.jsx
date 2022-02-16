import React, { useState } from "react";

import { Routes, Route, Link } from "react-router-dom";

import Login from "./Login";
import Signup from "./Signup";

function LogInSignUp() {

  return (
    <div>
      <Link to="/login">Log In</Link>
      <Link to="/signup">Sign Up</Link>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>


    </div>
  );
}

export default LogInSignUp;

// else if (signup) {
//   return (
//     <div>
//     <form id="login1">
//       <label for="email">Email</label>
//       <br />
//       <input id="email" name="email" />
//       <br />
//       <label for="username">Username</label>
//       <br />
//       <input id="username" name="username" />
//       <br />
//       <label for="password">Password</label>
//       <br />
//       <input id="password" name="password" />
//       <br />
//     </form>
//     <button type="submit" form="login1" value="Login">
//       Sign Up
//     </button>
//   </div>
//   )
// }
