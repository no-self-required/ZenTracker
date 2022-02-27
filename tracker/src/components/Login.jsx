import React, { useState } from "react";

function Login() {

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  async function loginUser(event) {
    event.preventDefault();
    const response = await fetch('http://localhost:3000/api/login', {
      method: 'POST',
      headers: {
        'Content-Type' : 'application/json',
      },
      body: JSON.stringify({
        username,
        password,
      }),
    })

  const data = await response.json()
  
  if (data.user) {
    localStorage.setItem('token', data.user)
    alert('Login successful')
    window.location.href = '/'
    console.log('data.user', data.user)
  } else {
    alert('Please check your username and password')
  }
  console.log('data', data)
  }

  return (
    <div>
      <form id="login1" onSubmit={loginUser}>
        <label for="username-login">Username</label>
        <br />
        <input id="username-login" name="username-login" type="text" onChange={(e) => setUsername(e.target.value)}/>
        <br />
        <label for="password-login">Password</label>
        <br />
        <input id="password-login" name="password-login" type="password" onChange={(e) => setPassword(e.target.value)} />
        <br />
      </form>
      <button type="submit" form="login1" value="Login">
        Login
      </button>
    </div>
  );
}

export default Login;