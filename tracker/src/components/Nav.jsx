import React, { useContext, useState, useEffect } from "react";
import Modal from "react-modal";
import { Link } from "react-router-dom";
import { UserContext } from "../App";
import { useNavigate } from "react-router-dom";
import "../styling/nav.scss";
import LogInsignUp from "./LogInSignUp";
import Logout from "./Logout";
import 'animate.css';
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

  return (
    <div className="navbar">
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
      {isMobile ? (
        <>
          <div id="ham" onClick={handleShowNavbar} />
        </>
      ) : (
        <>
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
        </>
      )}
      {showNavbar && <div id="ham-drop" class="animate__animated animate__fadeInDown"></div>}

    </div>
  );
}

export default Nav;
