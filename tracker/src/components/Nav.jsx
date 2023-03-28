import React, { useContext, useState, useEffect } from "react";
import Modal from "react-modal";
import { Link } from "react-router-dom";
import { UserContext } from "../App";
import { useNavigate } from "react-router-dom";
import "../styling/nav.scss";
import LogInsignUp from "./LogInSignUp";
import Logout from "./Logout";
import { Twirl as Hamburger } from "hamburger-react";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faXmark } from '@fortawesome/free-solid-svg-icons'

const element = <FontAwesomeIcon icon={faXmark} />

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    transform: "translate(-50%, -50%)",
    borderRadius: "20px",
    height: "22em",
    width: "13em",
    padding: "1em",
  },
};

Modal.setAppElement("#root");

function Nav() {
  const { userData } = useContext(UserContext);

  const [modalIsOpen, setIsOpen] = React.useState(false);
  const [loginOrSignup, setLoginOrSignup] = useState(null);
  const [showNavbar, setShowNavbar] = useState(false);
  const [windowDimension, setWindowDimension] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    setWindowDimension(window.innerWidth);
  }, []);

  useEffect(() => {
    function handleResize() {
      setWindowDimension(window.innerWidth);
    }

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const isMobile = windowDimension <= 600;

  function openModalLogin() {
    setIsOpen(true);
    setLoginOrSignup("login");
  }

  function handleLogin() {
    handleShowNavbar();
    openModalLogin();
  }

  function handleSignup() {
    handleShowNavbar();
    openModalSignup();
  }

  function openModalSignup() {
    setIsOpen(true);
    setLoginOrSignup("signup");
  }

  function closeModal() {
    setIsOpen(false);
  }

  const handleShowNavbar = () => {
    setShowNavbar(!showNavbar);
  };

  const [isOpen, setOpen] = useState(false);

  function handleHam() {
    setOpen(!isOpen);
  }

  return (
    <div className="navbar">
      {isMobile ? (
        <>
          <div id="logo-ham">
            <div id="navbar-dot-logo">
              <div
                id="navbar-logo"
                onClick={() => {
                  navigate("/");
                }}
              >
                ZenTracker
              </div>
            </div>
            <div id="ham" onClick={handleShowNavbar}>
              <Hamburger toggled={isOpen} toggle={setOpen} size={20} />
            </div>
          </div>
        </>
      ) : (
        <>
          <div id="navbar-dot-logo">
            <div
              id="navbar-logo"
              onClick={() => {
                navigate("/");
                handleHam();
              }}
            >
              ZenTracker
            </div>
          </div>
          <nav id="navbar-links">
            {userData.user !== undefined && (
              <div className="logged-in">
                <Link
                  to="/profile"
                  className="profile"
                  onClick={handleShowNavbar}
                >
                  <div>{userData.user.username}</div>
                </Link>
                <Logout
                  className="logout"
                  handleHam={handleHam}
                  handleShowNavbar={handleShowNavbar}
                ></Logout>
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
              </div>
            )}
          </nav>
        </>
      )}
      {showNavbar && isMobile && (
        <div id="ham-drop">
          <nav id="navbar-links">
            {userData.user !== undefined && (
              <div className="logged-in">
                <Link
                  to="/profile"
                  className="profile"
                  onClick={() => {
                    handleShowNavbar();
                    handleHam();
                  }}
                >
                  <div>{userData.user.username}</div>
                </Link>
                <Logout
                  className="logout"
                  handleHam={handleHam}
                  handleShowNavbar={handleShowNavbar}
                ></Logout>
              </div>
            )}
            {userData.user === undefined && (
              <div id="login-signup">
                <div className="login-signup-links">
                  <p
                    className="login"
                    onClick={() => {
                      handleLogin();
                      handleHam();
                    }}
                  >
                    Log In
                  </p>
                  <p
                    className="signup"
                    onClick={() => {
                      handleSignup();
                      handleHam();
                    }}
                  >
                    Sign Up
                  </p>
                </div>
              </div>
            )}
          </nav>
        </div>
      )}
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        style={customStyles}
        shouldCloseOnOverlayClick={false}
      >
        <div className="modal">
          <div to="/" className="closeModal" onClick={closeModal}>
          {element}
          </div>
          <LogInsignUp
            loginOrSignup={loginOrSignup}
            setLoginOrSignup={setLoginOrSignup}
          />
        </div>
      </Modal>
    </div>
  );
}

export default Nav;
