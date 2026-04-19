import React from 'react';
import './hero.css';

export default function Hero() {
  return (
    <section className="hero-section" id="home">
      <div className="hero-grid">
        <div className="hero-copy">
          <p className="hero-eyebrow">Nutrition tracking for real routines</p>
          <h1>
            CaloriTrack helps you understand what you eat, why it matters, and
            what to do next.
          </h1>
          <p className="hero-text">
            Log meals, review calorie totals, get AI guidance, and add image
            recognition when you want faster nutrition estimates from meal
            photos. The goal is simple: replace guesswork with a system you can
            actually follow every day.
          </p>
          <div className="hero-actions">
            <a className="hero-primary" href="#track">
              Start tracking
            </a>
            <a className="hero-secondary" href="#why">
              Why tracking matters
            </a>
          </div>
          <div className="hero-metrics">
            <div className="hero-metric-card">
              <span className="hero-metric-number">Daily</span>
              <span className="hero-metric-label">manual calorie logging</span>
            </div>
            <div className="hero-metric-card">
              <span className="hero-metric-number">AI</span>
              <span className="hero-metric-label">nutrition feedback and tips</span>
            </div>
            <div className="hero-metric-card">
              <span className="hero-metric-number">Photo</span>
              <span className="hero-metric-label">meal recognition workflow</span>
            </div>
          </div>
        </div>
        <div className="hero-panel">
          <div className="hero-panel-badge">Why CaloriTrack is useful</div>
          <h2>Consistency beats intensity in nutrition.</h2>
          <ul className="hero-panel-list">
            <li>Track meals before small habits become invisible.</li>
            <li>See calorie intake in one place instead of relying on memory.</li>
            <li>Use AI tips to spot patterns and adjust your next day faster.</li>
          </ul>
          <div className="hero-panel-note">
            Most people underestimate calories when they are busy. CaloriTrack
            gives your routine a visible record, which is the first step toward
            improving it.
          </div>
        </div>
      </div>
    </section>
  );
}
