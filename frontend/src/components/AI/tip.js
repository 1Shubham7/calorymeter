import React, { useState } from 'react';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import './tip.css';

const TipDisplay = () => {
  const [tip, setTip] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchTip = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await axios.get('http://localhost:8000/tip');
      setTip(response.data.aitip.Candidates[0].Content.Parts[0]);
      console.log(response.data.aitip.Candidates[0].Content.Parts[0]);
    } catch (error) {
      console.error('Error fetching tip:', error);
      setError('Failed to fetch tip. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  // Function to parse and format sections
  const formatTipContent = (content) => {
    if (!content) return null;

    return (
      <div className="tip-content">
        <ReactMarkdown components={{
          p: ({node, ...props}) => <p className="markdown-paragraph" {...props} />,
          h1: ({node, children, ...props}) => <h3 className="markdown-heading-1" {...props}>{children}</h3>,
          h2: ({node, children, ...props}) => <h3 className="markdown-heading-2" {...props}>{children}</h3>,
          h3: ({node, children, ...props}) => <h4 className="markdown-heading-3" {...props}>{children}</h4>,
          ul: ({node, ...props}) => <ul className="markdown-list" {...props} />,
          ol: ({node, ...props}) => <ol className="markdown-numbered-list" {...props} />,
          li: ({node, ...props}) => <li className="markdown-list-item" {...props} />,
          strong: ({node, ...props}) => <strong className="markdown-bold" {...props} />
        }}>
          {content}
        </ReactMarkdown>
      </div>
    );
  };

  return (
    <section className="tip-section" id="coach">
      <div className="tip-container">
        <div className="tip-header">
          <div>
            <p className="tip-eyebrow">AI coach</p>
            <h2 className="tip-heading">Turn your logged meals into practical next-step advice.</h2>
            <p className="tip-subtext">
              Once you have entries in CaloriTrack, ask the AI coach for quick
              guidance on whether your day is trending in the right direction.
            </p>
          </div>
          <button 
            className="tip-button" 
            onClick={fetchTip}
            disabled={loading}
          >
            {loading ? 'Loading...' : 'Generate AI tip'}
          </button>
        </div>
        
        {error && <p className="error-message">{error}</p>}
        
        {tip ? formatTipContent(tip) : (
          <div className="tip-placeholder">
            Your advice summary will appear here after you generate a tip.
          </div>
        )}
      </div>
    </section>
  );
};

export default TipDisplay;
