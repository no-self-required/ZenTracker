import React from "react";

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

