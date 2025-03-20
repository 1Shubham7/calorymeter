import React from 'react';
import './entry.css';

const Entry = ({
  entryData,
  setChangeIngredient,
  deleteSingleEntry,
  setChangeEntry,
}) => {
  return (
    <div className="entry-card">
      <div className="entry-content">
        <div className="entry-info">
          <div className="entry-field">
            <span className="field-label">Dish:</span>
            <span className="field-value">{entryData?.dish}</span>
          </div>
          <div className="entry-field">
            <span className="field-label">Ingredients:</span>
            <span className="field-value">{entryData?.ingredients}</span>
          </div>
          <div className="entry-field">
            <span className="field-label">Calories:</span>
            <span className="field-value">{entryData?.calories}</span>
          </div>
          <div className="entry-field">
            <span className="field-label">Fat:</span>
            <span className="field-value">{entryData?.fat}g</span>
          </div>
        </div>
        
        <div className="entry-actions">
          <button 
            className="edit-button" 
            onClick={() => changeEntry()}
          >
            Edit Entry
          </button>
          <button 
            className="update-button" 
            onClick={() => changeIngredient()}
          >
            Update Ingredients
          </button>
          <button 
            className="delete-button" 
            onClick={() => deleteSingleEntry(entryData._id)}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );

  function changeIngredient() {
    setChangeIngredient({
      change: true,
      id: entryData._id,
    });
  }

  function changeEntry() {
    setChangeEntry({
      change: true,
      id: entryData._id,
    });
  }
};

export default Entry;