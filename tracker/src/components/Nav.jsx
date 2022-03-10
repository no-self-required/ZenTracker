import React, { useContext, useState } from "react";
import Modal from "react-modal";
import { Link } from "react-router-dom";
import { UserContext } from "../App";
import { useNavigate } from "react-router-dom";
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
  const [loginOrSignup, setLoginOrSignup] = useState(null);
  const navigate = useNavigate();
  
  function openModalLogin() {
    setIsOpen(true);
    setLoginOrSignup("login");
  }

  function openModalSignup() {
    setIsOpen(true);
    setLoginOrSignup("signup");
  }

  function closeModal() {
    setIsOpen(false);
  }

  return (
    <div className="navbar">
      <div id="navbar-dot-logo">
        <span id="navbar-dot"></span>
        <div
          id="navbar-logo"
          onClick={() => {
            navigate("/");
          }}
        >
          ZenTracker
        </div>
      </div>
      <nav id="navbar-links">
        {userData.user !== undefined && (
          <div className="logged-in">
            <div>Hello, {userData.user.username}</div>
            <Logout className="logout"></Logout>
            <Link to="/profile" className="profile">
              Profile
            </Link>
          </div>
        )}
        {userData.user === undefined && (
          <div id="login-signup">
            <div className="login-signup-links">
              <p className="login" onClick={openModalLogin}>
                Log In
              </p>
              <p className="signup" onClick={openModalSignup}>
                Sign Up
              </p>
            </div>
            <Modal
              isOpen={modalIsOpen}
              onRequestClose={closeModal}
              style={customStyles}
              shouldCloseOnOverlayClick={false}
            >
              <div>
                <p to="/" className="closeModal" onClick={closeModal}>
                  close
                </p>
                <LogInsignUp
                  loginOrSignup={loginOrSignup}
                  setLoginOrSignup={setLoginOrSignup}
                />
              </div>
            </Modal>
          </div>
        )}
      </nav>
    </div>
  );
}

export default Nav;
