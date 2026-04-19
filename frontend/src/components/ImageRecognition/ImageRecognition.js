import React from 'react';
import './imageRecognition.css';

export default function ImageRecognition() {
  return (
    <div className="image-recognition-card">
      <p className="image-recognition-eyebrow">Photo workflow</p>
      <h2>Estimate meal nutrition from an image when manual logging is too slow.</h2>
      <p>
        Open the CaloriTrack image-recognition feature to analyze a meal image,
        review a nutrition estimate, and export the result before you continue
        tracking in the main dashboard.
      </p>
      <ul className="image-recognition-list">
        <li>Upload up to 3 meal photos</li>
        <li>Get estimated calories, carbs, fat, and protein</li>
        <li>Use it as a faster starting point for logging</li>
      </ul>
      <a
        className="image-recognition-button"
        href="http://localhost:8080/"
        target="_blank"
        rel="noopener noreferrer"
      >
        Image Recognition
      </a>
    </div>
  );
}
