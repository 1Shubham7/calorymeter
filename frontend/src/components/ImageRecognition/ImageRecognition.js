import React from 'react';
import './imageRecognition.css';

export default function ImageRecognition() {
  return (
    <div className="image-recognition-card">
      <p className="image-recognition-eyebrow">New In CaloriTrack</p>
      <h2>Use image recognition to estimate meal nutrition from a photo.</h2>
      <p>
        Open the CaloriTrack image recognition feature to analyze a meal image,
        review the nutrition estimate, and export the results.
      </p>
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
