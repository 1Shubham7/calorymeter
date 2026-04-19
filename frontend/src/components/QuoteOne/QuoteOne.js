import React from 'react';
import './quoteone.css';

export default function QuoteOne() {
  return (
    <section className="quote-box" id="why">
      <div className="quote-shell">
        <div className="quote-intro">
          <p className="quote-eyebrow">Why calorie tracking matters</p>
          <h2 className="quote-title">
            Better nutrition decisions start when intake becomes visible.
          </h2>
          <p className="quote-description">
            Most people do not fail because they lack motivation. They fail
            because they are working from rough estimates. CaloriTrack gives you
            a clearer view of your meals so you can adjust with intent instead
            of reacting after weeks of inconsistency.
          </p>
        </div>
        <div className="quote-grid">
          <article className="quote-card">
            <h3>Awareness over guesswork</h3>
            <p>
              Logging meals turns vague eating habits into concrete numbers you
              can review and improve.
            </p>
          </article>
          <article className="quote-card">
            <h3>Smarter daily adjustments</h3>
            <p>
              When breakfast, lunch, and snacks are visible, it becomes easier
              to correct the rest of the day before goals drift.
            </p>
          </article>
          <article className="quote-card">
            <h3>Feedback that compounds</h3>
            <p>
              Pair tracking with AI tips and photo recognition to learn faster
              and build a routine you can sustain.
            </p>
          </article>
        </div>
      </div>
    </section>
  );
}
