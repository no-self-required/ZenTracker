import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
import axios from "axios";

function Signup() {
  // const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  async function registerUser(event) {
    event.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:3000/api/register",
        JSON.stringify({ email, username, password }),
        {
          headers: { "Content-Type": "application/json" }
        }
      );

      if (response.statusText === "OK") {
        //register should log in automatically
        window.location.href = "/";
      }
      console.log("response: ", response);
    } catch (err) {
      console.log("error: ", err);
    }
  }

  return (
    <div>
      <form id="register1" onSubmit={registerUser}>
        <label for="email-register">Email</label>
        <br />
        <input
          id="email-register"
          name="email-register"
          type="text"
          className="input"
          onChange={(e) => setEmail(e.target.value)}
        />
        <br />
        <label for="username-register">Username</label>
        <br />
        <input
          id="username-register"
          name="username-register"
          type="text"
          className="input"
          onChange={(e) => setUsername(e.target.value)}
        />
        <br />
        <label for="password-register">Password</label>
        <br />
        <input
          id="password-register"
          name="password-register"
          type="password"
          className="input"
          onChange={(e) => setPassword(e.target.value)}
        />
        <br />
        <div class="final-button-container">
        <input type="submit" value="Register" class="final-button"/>
        </div>
      </form>
    </div>
  );
}

export default Signup;
