import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Signup() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  async function registerUser(event) {
    event.preventDefault();
    const response = await fetch('http://localhost:3000/api/register', {
      method: 'POST',
      headers: {
        'Content-Type' : 'application/json',
      },
      body: JSON.stringify({
        email,
        username,
        password,
      }),
    })

  const data = await response.json()
  
  if (data.status === 'ok') {
    navigate('/login')
  }
  console.log('data', data)
  }


  return (
    <div>
      <form id="register1" onSubmit={registerUser}>
        <label for="email-register">Email</label>
        <br />
        <input id="email-register" name="email-register" type="text" onChange={(e) => setEmail(e.target.value)}/>
        <br />
        <label for="username-register">Username</label>
        <br />
        <input id="username-register" name="username-register" type="text" onChange={(e) => setUsername(e.target.value)}/>
        <br />
        <label for="password-register">Password</label>
        <br />
        <input id="password-register" name="password-register" type="password" onChange={(e) => setPassword(e.target.value)}/>
        <br />
        <input type="submit" value="Register" />
      </form>
      
      {/* <button type="submit" form="register1s" value="Register">
        Sign Up
      </button> */}
    </div>
  );
}

export default Signup;
