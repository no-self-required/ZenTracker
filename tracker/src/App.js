import "./App.css";
import Nav from "./components/Nav";
import Main from "./components/Main";

import "./styling/app.scss";
import Login from "./components/Login";
import Signup from "./components/Signup";


// import useLocalStorage from "use-local-storage";

function App() {
  // const defaultDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  // const [theme, setTheme] = useLocalStorage(
  //   "theme",
  //   defaultDark ? "dark" : "light"
  // );

  // const switchTheme = () => {
  //   const newTheme = theme === 'light' ? 'dark' : 'light';
  //   setTheme(newTheme)
  // }

  return (
    <div className="App">
      <Nav></Nav>
      <Main></Main>
    </div>
  );
}

export default App;
