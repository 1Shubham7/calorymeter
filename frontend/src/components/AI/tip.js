import React, { useState } from 'react';
import axios from 'axios';

const TipDisplay = () => {
  const [tip, setTip] = useState('');

  const fetchTip = async () => {
    try {
      const response = await axios.get('http://localhost:8000/tip');
      setTip(response.data.aitip.Candidates[0].Content.Parts[0]);
      console.log(response.data.aitip.Candidates[0].Content.Parts[0])
    } catch (error) {
      console.error('Error fetching tip:', error);
    }
  };

  return (
    <div>
      <h2>Tip of the Day:</h2>
      <button onClick={fetchTip}>Show Tip</button>
      {tip && <p>{tip}</p>}
    </div>
  );
};

export default TipDisplay;
