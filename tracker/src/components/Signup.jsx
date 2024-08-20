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
        "https://zentracker.adaptable.app/api/register/",
        JSON.stringify({ email, username, password }),
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      if (response.status === 200) {
        //register should log in automatically
        window.location.href = "/";
      }
      console.log("response: ", response);
    } catch (err) {
      console.log("error: ", err);
    }
  }

  return (
    <>
      <form id="register1" onSubmit={registerUser}>
        <div className="field-holder">
          <input
            id="email-register"
            name="email-register"
            type="text"
            required
            className="input"
            onChange={(e) => setEmail(e.target.value)}
          />
          <label for="email-register">Email</label>
        </div>
        <div className="field-holder">
          <input
            id="username-register"
            name="username-register"
            type="text"
            className="input"
            required
            onChange={(e) => setUsername(e.target.value)}
          />
          <label for="username-register">Username</label>
        </div>
        <div className="field-holder">
          <input
            id="password-register"
            name="password-register"
            type="password"
            className="input"
            required
            onChange={(e) => setPassword(e.target.value)}
          />
          <label for="password-register">Password</label>
        </div>
        <div class="final-button-container">
          <button
            type="submit"
            form="register1"
            value="Register"
            className={`final-button${(email && username && password !== "") ? "-enabled" : ""}`}
          >
            Register
          </button>
          {/* <input type="submit" value="Register" class="final-button" /> */}
        </div>
      </form>
    </>
  );
}

export default Signup;
