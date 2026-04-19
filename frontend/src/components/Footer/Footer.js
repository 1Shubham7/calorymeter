import React from 'react';
import './footer.css';
import { SocialIcon } from 'react-social-icons';

export default function Footer() {
  return (
    <footer className="footer" id="community">
      <div className="footer-shell">
        <div className="footer-brand">
          <p className="footer-eyebrow">CaloriTrack</p>
          <h2>Build a nutrition routine you can actually maintain.</h2>
          <p className="footer-copy">
            CaloriTrack combines meal logging, AI guidance, and image
            recognition so nutrition tracking feels practical instead of heavy.
          </p>
          <div className="socials">
            <div className="social-logo">
              <SocialIcon url="https://twitter.com/1shubham7" />
            </div>
            <div className="social-logo">
              <SocialIcon url="https://github.com/1shubham7" />
            </div>
            <div className="social-logo">
              <SocialIcon url="https://www.linkedin.com/in/shubham-singh-5a002b20b/" />
            </div>
            <div className="social-logo">
              <SocialIcon
                url="https://hashnode.com/@1shubham7"
                bgColor="#ffffff"
              />
            </div>
          </div>
        </div>
        <div className="footer-links-grid">
          <div className="footer-column">
            <h3>Product</h3>
            <a href="#track">Calorie tracking</a>
            <a href="#coach">AI coach</a>
            <a href="http://localhost:8080/" target="_blank" rel="noopener noreferrer">Image recognition</a>
          </div>
          <div className="footer-column">
            <h3>Project</h3>
            <a href="https://github.com/1Shubham7/calorymeter" target="_blank" rel="noopener noreferrer">GitHub</a>
            <a href="/signup">Create account</a>
            <a href="/ws">Community chat</a>
          </div>
          <div className="footer-column">
            <h3>Why use it</h3>
            <p>Track meals before guesswork stacks up.</p>
            <p>See daily intake in one place.</p>
            <p>Use AI feedback to adjust earlier.</p>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <p>© 2026 CaloriTrack. Built with React, Go, MongoDB, WebSockets, and Gemini-powered tips.</p>
      </div>
    </footer>
  );
}
