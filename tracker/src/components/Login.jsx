import React, { useState } from "react";
import axios from "axios";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  async function loginUser(event) {
    event.preventDefault();
    try {
      const response = await axios.post(
        "https://zentracker.adaptable.app/api/login/",
        JSON.stringify({ username, password }),
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      console.log("res: ", response);
      if (response.data.user) {
        localStorage.setItem("token", response.data.user);
        window.location.href = "/";
        alert("Log in successful");
      } else {
        alert("Please check your username and password");
      }
    } catch (err) {
      console.log("error: ", err);
    }
  }

  return (
      <>
      <form id="login1" onSubmit={loginUser}>
        <div className="field-holder">
          <input
            id="username-login"
            name="username-login"
            type="text"
            required
            className="input"
            maxLength="15"
            autoComplete="on"
            onChange={(e) => setUsername(e.target.value)}
          />
          <label htmlFor="username-login">Username</label>
        </div>
        <div className="field-holder">
          <input
            id="password-login"
            name="password-login"
            type="password"
            className="input"
            autoComplete="on"
            required
            onChange={(e) => setPassword(e.target.value)}
          />
          <label htmlFor="password-login">Password</label>
        </div>
      </form>
      <div className="final-button-container">
        <button type="submit" form="login1" value="Login" className={`final-button${(username && password !== "") ? "-enabled" : ""}`}>
          Login
        </button>
      </div>
    </>
  );
}

export default Login;