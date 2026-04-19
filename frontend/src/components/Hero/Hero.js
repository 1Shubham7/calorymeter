import React from 'react';
import './hero.css';
import ImageRecognition from '../ImageRecognition/ImageRecognition';

export default function Hero() {
  return (
    <div className="hero-section">
      <div className="hero-content">
        <div className="hero-text">
          Start your fitness journey with CaloriTrack, track your daily calories,
          and get a personalized diet plan from our AI coach.
        </div>
        <ImageRecognition />
      </div>
    </div>
  );
}
