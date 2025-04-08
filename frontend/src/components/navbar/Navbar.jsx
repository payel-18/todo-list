import React, { useState } from 'react';
import "./Navbar.css";
import { RiTodoFill } from "react-icons/ri";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { authActions } from '../../store';

const Navbar = () => {
  const isLoggedIn = useSelector((state) => state.isLoggedIn);
  const dispatch = useDispatch();

  const [showProfile, setShowProfile] = useState(false); 
  const username = sessionStorage.getItem("username");    

  const toggleProfile = () => {
    setShowProfile(!showProfile);
  };

  const logout = () => {
    sessionStorage.clear();
    dispatch(authActions.logout());
  };

  return (
    <div>
      <nav className="navbar navbar-expand-lg bg-body-tertiary">
        <div className="container">
          {/* Logo */}
          <Link className="navbar-brand" to="/"><b><RiTodoFill /> Todo-app</b></Link>

          {/* Toggler for mobile */}
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent">
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav ms-auto mb-2 mb-lg-0 w-100 justify-content-end flex-lg-row flex-column align-items-lg-center">
              {/* Common links */}
              <li className="nav-item nav-text mx-2"><Link className="nav-link active" to="/"><b>Home</b></Link></li>
              <li className="nav-item nav-text mx-2"><Link className="nav-link active" to="/todo"><b>Todo</b></Link></li>

              {/* Show Register/Login if not logged in */}
              {!isLoggedIn && (
                <>
                  <li className="nav-item mx-2">
                    <Link className="nav-link active btn-nav my-2 my-lg-0 px-3 py-1" to="/register">
                      Register
                    </Link>
                  </li>
                  <li className="nav-item mx-2">
                    <Link className="nav-link active btn-nav my-2 my-lg-0 px-3 py-1" to="/login">
                      Login
                    </Link>
                  </li>
                </>
              )}

              {/* Show Log Out if logged in */}
              {isLoggedIn && (
                <li className="nav-item mx-2" onClick={logout}>
                  <Link className="nav-link active btn-nav my-2 my-lg-0" to="/">Log Out</Link>
                </li>
              )}

              {/* User profile image + popup */}
              <li className="nav-item mx-2 position-relative">
                <img
                  className="img-fluid user-img"
                  src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTM3FwFWSj9qohGE7FhrwJ-PlcK4-tLdWSlGg&s"
                  alt="user"
                  onClick={toggleProfile}
                  style={{ cursor: 'pointer', borderRadius: '50%', width: '40px', height: '40px' }}
                />
                {showProfile && (
                  <div className="profile-popup p-2 shadow bg-white rounded" style={{ position: "absolute", top: "60px", right: "10px", zIndex: "1000" }}>
                    {username ? <p className="m-0">Hello, <b>{username}</b>!</p> : <p className="m-0">Not logged in</p>}
                  </div>
                )}
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
