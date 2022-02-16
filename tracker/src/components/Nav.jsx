import React from "react";
import Modal from "react-modal";
import { Routes, Route, Link } from "react-router-dom";

import "../styling/nav.scss";
import LogInsignUp from "./LogInSignUp";

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

function Nav() {
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
        <div>
          <Link to="/login" className="login" onClick={openModal}>
            Log In
          </Link>
          <Link to="/signup" clasName="signup" onClick={openModal}>
            Sign Up
          </Link>
          <Modal
            isOpen={modalIsOpen}
            onRequestClose={false}
            style={customStyles}
            shouldCloseOnOverlayClick={false}
          >
            <Link to="/" className="closeModal" onClick={closeModal}>
              close
            </Link>
            <LogInsignUp />
          </Modal>
        </div>
      </nav>
    </div>
  );
}

export default Nav;
