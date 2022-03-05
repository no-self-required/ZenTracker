import React, { useContext } from "react";
import Modal from "react-modal";
import { Link } from "react-router-dom";
import { UserContext } from "../App";

import "../styling/nav.scss";
import LogInsignUp from "./LogInSignUp";
import Logout from "./Logout";

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
  },
};

Modal.setAppElement("#root");
function Nav() {
  const { userData, setUserData } = useContext(UserContext);

  const [modalIsOpen, setIsOpen] = React.useState(false);

  function openModal() {
    setIsOpen(true);
  }

  function closeModal() {
    setIsOpen(false);
  }

  return (
    <div className="navbar">
      <div id="navbar-dot-logo">
        <span id="navbar-dot"></span>
        <div id="navbar-logo">ZenTracker</div>
      </div>
      <nav id="navbar-links">
        {userData.user !== undefined && (
          <div className="logged-in">
            <div>Hello, {userData.user.username}</div>
            <Logout className="logout"></Logout>
          </div>
        )}
        {userData.user === undefined && (
          <div id="login-signup">
            <Link to="/login" className="login" onClick={openModal}>
              Log In
            </Link>
            <Link to="/signup" className="signup" onClick={openModal}>
              Sign Up
            </Link>
            <Modal
              isOpen={modalIsOpen}
              onRequestClose={closeModal}
              style={customStyles}
              shouldCloseOnOverlayClick={false}
            >
              <Link to="/" className="closeModal" onClick={closeModal}>
                close
              </Link>
              <LogInsignUp />
            </Modal>
          </div>
        )}
      </nav>
    </div>
  );
}

export default Nav;
