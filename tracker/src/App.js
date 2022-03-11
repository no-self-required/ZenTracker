import React, { createContext, useState, useEffect } from "react";
import Nav from "./components/Nav";
import Main from "./components/Main";
import axios from "axios";

import { BrowserRouter, Routes, Route } from "react-router-dom";

import "./styling/app.scss";
import ProfileStats from "./components/stats/ProfileStats";

export const UserContext = createContext();

function App() {
  const [userData, setUserData] = useState({
    token: undefined,
    user: undefined,
  });

  useEffect(() => {
    const isLoggedIn = async () => {
      let token = localStorage.getItem("token");
      if (token === null) {
        localStorage.setItem("token", "");
        token = "";
      }

      const tokenResponse = await axios.post("/api/users/tokenIsValid", null, {
        headers: { token: token },
      });

      // console.log("tokenResponse.data", tokenResponse.data);

      if (tokenResponse.data === true) {
        const userResponse = await axios.get("/api/users/profile", {
          headers: { token: token },
        });
        setUserData({
          token: token,
          user: userResponse.data,
        });

        window.localStorage.setItem("udata", JSON.stringify(userResponse.data));
      } else {
        return;
      }
    };

    isLoggedIn();
  }, []);

  // useEffect(() => {
  //   console.log
  // }, [])

  // useEffect(() => {
  //   const gData = window.localStorage.getItem('udata')
  //   setUserData(JSON.parse(gData))
  // }, [])

  console.log("userData", userData);

  return (
    <UserContext.Provider value={{ userData, setUserData }}>
      <BrowserRouter>
        <div className="App">
          <Nav />
          <Routes>
            <Route path="/profile" exact element={<ProfileStats />} />
            <Route path="/" exact element={<Main />} />
          </Routes>
        </div>
      </BrowserRouter>
    </UserContext.Provider>
  );
}

export default App;

// const defaultDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
// const [theme, setTheme] = useLocalStorage(
//   "theme",
//   defaultDark ? "dark" : "light"
// );

// const switchTheme = () => {
//   const newTheme = theme === 'light' ? 'dark' : 'light';
//   setTheme(newTheme)
// }
