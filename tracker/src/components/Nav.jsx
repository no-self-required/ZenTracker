import React from "react";
import "../styling/nav.scss";

function Nav() {
  return (
    <div className="navbar">
      <div id="navbar-dot-logo">
        <span id="navbar-dot"></span>
        <div id="navbar-logo">ZenTracker</div>
      </div>
      <nav id="navbar-links">
        <div>Timer</div>
        <div>Login</div>
      </nav>
    </div>
  );
}

export default Nav;
