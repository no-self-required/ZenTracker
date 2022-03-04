import React, { createContext, useState, useEffect } from "react";
import Nav from "./components/Nav";
import Main from "./components/Main";
import axios from "axios";


import "./styling/app.scss";

// import useLocalStorage from "use-local-storage";

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
        headers: { "token": token },
      });

      console.log('tokenResponse.data', tokenResponse.data);

      if(tokenResponse.data === true) {
        const userResponse = await axios.get("/api/users/profile", {
          headers: { "token": token },
        });
        setUserData({
          token: token,
          user: userResponse.data,
        });
      } else {
        return;
      }
    };
    isLoggedIn();
  }, []);

  return (
    <div className="App">
      <UserContext.Provider value={{ userData, setUserData }}>
        <Nav></Nav>
        <Main></Main>
      </UserContext.Provider>
    </div>
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
