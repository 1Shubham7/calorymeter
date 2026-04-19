import React, { useState } from 'react';
import './navbar.css';
import { RiMenu3Line, RiCloseLine } from 'react-icons/ri';

export default function Navbar({ isAuthenticated, onLogout }) {
  const [toggleMenu, setToggleMenu] = useState(false);

  return (
    <div className="navbar">
      <div className="navbar-links">
        <div className="navbar-links_container">
          <div className="brand-mark">
            <a href="/">CaloriTrack</a>
          </div>
          <p>
            <a href="#why">Why it matters</a>
          </p>
          <p>
            <a href="#track">Track calories</a>
          </p>
          <p>
            <a href="#coach">AI coach</a>
          </p>
          <p>
            <a href="#community">Community</a>
          </p>
          <p>
            <a href="https://github.com/1Shubham7/calorymeter" target="_blank" rel="noopener noreferrer">GitHub</a>
          </p>
        </div>
      </div>
      <div className="navbar-sign">
        {isAuthenticated ? (
          <>
            <a className="navbar-ghost-link" href="http://localhost:8080/" target="_blank" rel="noopener noreferrer">
              Image recognition
            </a>
            <button className="navbar-primary-link navbar-button-reset" type="button" onClick={onLogout}>
              Logout
            </button>
          </>
        ) : (
          <>
            <a className="navbar-ghost-link" href="/login">
              Login
            </a>
            <a className="navbar-primary-link" href="/signup">
              Create account
            </a>
          </>
        )}
      </div>
      <div className="navbar-menu">
        {toggleMenu ? (
          <RiCloseLine
            color="#172033"
            size={27}
            onClick={() => setToggleMenu(false)}
          />
        ) : (
          <RiMenu3Line
            color="#172033"
            size={27}
            onClick={() => setToggleMenu(true)}
          />
        )}
        {toggleMenu && (
          <div className="navbar-menu_container scale-up-center">
            <div className="navbar-menu_container-links">
              <p>
                <a href="/">CaloriTrack</a>
              </p>
              <p>
                <a href="#why">Why it matters</a>
              </p>
              <p>
                <a href="#track">Track calories</a>
              </p>
              <p>
                <a href="#coach">AI coach</a>
              </p>
              <p>
                <a href="#community">Community</a>
              </p>
              <p>
                <a href="https://github.com/1Shubham7/calorymeter" target="_blank" rel="noopener noreferrer">GitHub</a>
              </p>
            </div>
            <div className="navbar-menu_container-links-sign">
              {isAuthenticated ? (
                <>
                  <a className="navbar-menu_link" href="http://localhost:8080/" target="_blank" rel="noopener noreferrer">
                    Image recognition
                  </a>
                  <button className="navbar-menu_button navbar-button-reset" type="button" onClick={onLogout}>
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <a className="navbar-menu_link" href="/login">
                    Login
                  </a>
                  <a className="navbar-menu_button" href="/signup">
                    Create account
                  </a>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
