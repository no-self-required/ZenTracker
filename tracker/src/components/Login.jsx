import React, { useState } from "react";
import axios from "axios";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  async function loginUser(event) {
    event.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:3000/api/login",
        JSON.stringify({ username, password }),
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      console.log("res: ", response);
      if (response.data.user) {
        localStorage.setItem("token", response.data.user);
        window.location.href = "/";
      } else {
        alert("Please check your username and password");
      }
    } catch (err) {
      console.log("error: ", err);
    }
  }

  return (
    <div>
      <form id="login1" onSubmit={loginUser}>
        <label for="username-login">Username</label>
        <br />
        <input
          id="username-login"
          name="username-login"
          type="text"
          // placeholder="username"
          className="input"
          onChange={(e) => setUsername(e.target.value)}
        />
        <br />
        <label for="password-login">Password</label>
        <br />
        <input
          id="password-login"
          name="password-login"
          type="password"
          className="input"
          // placeholder="password"
          onChange={(e) => setPassword(e.target.value)}
        />
        <br />
      </form>
      <div className="final-button-container">
      <button type="submit" form="login1" value="Login" class="final-button">
        Login
      </button>
      </div>

    </div>
  );
}

export default Login;
