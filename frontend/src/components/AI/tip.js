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
          // Define component mapping for elements
          p: ({node, ...props}) => <p className="markdown-paragraph" {...props} />,
          h1: ({node, ...props}) => <h1 className="markdown-heading-1" {...props} />,
          h2: ({node, ...props}) => <h2 className="markdown-heading-2" {...props} />,
          h3: ({node, ...props}) => <h3 className="markdown-heading-3" {...props} />,
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
    <div className="tip-container">
      <h2 className="tip-heading">Get Tips from our AI Fitness Coach</h2>
      <button 
        className="tip-button" 
        onClick={fetchTip}
        disabled={loading}
      >
        {loading ? 'Loading...' : 'Show Tip'}
      </button>
      
      {error && <p className="error-message">{error}</p>}
      
      {tip && formatTipContent(tip)}
    </div>
  );
};

export default TipDisplay;