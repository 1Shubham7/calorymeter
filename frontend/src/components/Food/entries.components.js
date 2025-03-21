import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './entries.css';
import Entry from './single-entry.component';

const Entries = () => {
  const [entries, setEntries] = useState([]);
  const [tip, setTip] = useState([]);
  const [refreshData, setRefreshData] = useState(false);
  const [changeEntry, setChangeEntry] = useState({ change: false, id: 0 });
  const [changeIngredient, setChangeIngredient] = useState({
    change: false,
    id: 0,
  });
  const [newIngredientName, setNewIngredientName] = useState('');
  const [addNewEntry, setAddNewEntry] = useState(false);
  const [newEntry, setNewEntry] = useState({
    dish: '',
    ingredients: '',
    calories: 0,
    fat: 0,
  });

  useEffect(() => {
    getAllEntries();
  }, []);

  useEffect(() => {
    if (refreshData) {
      getAllEntries();
      setRefreshData(false);
    }
  }, [refreshData]);

  return (
    <div className="entries-container">
      <header className="app-header">
        <h1>Calorie Tracker</h1>
        <button 
          className="primary-button" 
          onClick={() => setAddNewEntry(true)}
        >
          Track today's calories
        </button>
      </header>
      
      <div className="entries-list">
        {entries != null &&
          entries.map((entry, i) => (
            <Entry
              key={entry._id}
              entryData={entry}
              deleteSingleEntry={deleteSingleEntry}
              setChangeIngredient={setChangeIngredient}
              setChangeEntry={setChangeEntry}
            />
          ))}
      </div>

      {addNewEntry && (
        <div className="modal-overlay" onClick={() => setAddNewEntry(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Add Calorie Entry</h2>
              <button className="close-button" onClick={() => setAddNewEntry(false)}>×</button>
            </div>

            <div className="modal-body">
              <div className="form-group">
                <label>Dish</label>
                <input
                  type="text"
                  onChange={(event) => {
                    setNewEntry({...newEntry, dish: event.target.value});
                  }}
                />
                
                <label>Ingredients</label>
                <input
                  type="text"
                  onChange={(event) => {
                    setNewEntry({...newEntry, ingredients: event.target.value});
                  }}
                />
                
                <label>Calories</label>
                <input
                  type="number"
                  onChange={(event) => {
                    setNewEntry({...newEntry, calories: event.target.value});
                  }}
                />
                
                <label>Fat (g)</label>
                <input
                  type="number"
                  onChange={(event) => {
                    setNewEntry({...newEntry, fat: event.target.value});
                  }}
                />
              </div>
              
              <div className="button-group">
                <button className="primary-button" onClick={() => addSingleEntry()}>Add</button>
                <button className="secondary-button" onClick={() => setAddNewEntry(false)}>Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {changeIngredient.change && (
        <div className="modal-overlay" onClick={() => setChangeIngredient({ change: false, id: 0 })}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Change Ingredients</h2>
              <button className="close-button" onClick={() => setChangeIngredient({ change: false, id: 0 })}>×</button>
            </div>

            <div className="modal-body">
              <div className="form-group">
                <label>New ingredients</label>
                <input
                  type="text"
                  onChange={(event) => {
                    setNewIngredientName(event.target.value);
                  }}
                />
              </div>
              
              <div className="button-group">
                <button className="primary-button" onClick={() => changeIngredientForEntry()}>Change</button>
                <button className="secondary-button" onClick={() => setChangeIngredient({ change: false, id: 0 })}>Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {changeEntry.change && (
        <div className="modal-overlay" onClick={() => setChangeEntry({ change: false, id: 0 })}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Change Entry</h2>
              <button className="close-button" onClick={() => setChangeEntry({ change: false, id: 0 })}>×</button>
            </div>
            
            <div className="modal-body">
              <div className="form-group">
                <label>Dish</label>
                <input
                  type="text"
                  onChange={(event) => {
                    setNewEntry({...newEntry, dish: event.target.value});
                  }}
                />
                
                <label>Ingredients</label>
                <input
                  type="text"
                  onChange={(event) => {
                    setNewEntry({...newEntry, ingredients: event.target.value});
                  }}
                />
                
                <label>Calories</label>
                <input
                  type="number"
                  onChange={(event) => {
                    setNewEntry({...newEntry, calories: event.target.value});
                  }}
                />
                
                <label>Fat (g)</label>
                <input
                  type="number"
                  onChange={(event) => {
                    setNewEntry({...newEntry, fat: event.target.value});
                  }}
                />
              </div>
              
              <div className="button-group">
                <button className="primary-button" onClick={() => changeSingleEntry()}>Change</button>
                <button className="secondary-button" onClick={() => setChangeEntry({ change: false, id: 0 })}>Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  function changeIngredientForEntry() {
    setChangeIngredient({ change: false, id: 0 });
    var url = 'http://localhost:8000/food/ingredient/update/' + changeIngredient.id;
    axios
      .put(url, {
        ingredients: newIngredientName,
      })
      .then((response) => {
        if (response.status === 200) {
          setRefreshData(true);
        }
      })
      .catch(error => console.error('Error updating ingredient:', error));
  }

  function changeSingleEntry() {
    setChangeEntry({ change: false, id: 0 });
    var url = 'http://localhost:8000/food/entry/update/' + changeEntry.id;
    axios
      .put(url, {
        dish: newEntry.dish, 
        ingredients: newEntry.ingredients, 
        calories: parseInt(newEntry.calories, 10) || 0, 
        fat: parseFloat(newEntry.fat) || 0, 
      })
      .then((response) => {
        if (response.status === 200) {
          setRefreshData(true);
        }
      })
      .catch(error => console.error('Error updating entry:', error));
  }

  function addSingleEntry() {
    setAddNewEntry(false);
    var url = 'http://localhost:8000/food/create';
    axios
      .post(url, {
        ingredients: newEntry.ingredients,
        dish: newEntry.dish,
        calories: parseFloat(newEntry.calories),
        fat: parseFloat(newEntry.fat),
      })
      .then((response) => {
        if (response.status === 200) {
          setRefreshData(true);
        }
      })
      .catch(error => console.error('Error creating entry:', error));
  }

  function deleteSingleEntry(id) {
    var url = 'http://localhost:8000/food/entry/delete/' + id;
    axios
      .delete(url)
      .then((response) => {
        if (response.status === 200) {
          setRefreshData(true);
        }
      })
      .catch(error => console.error('Error deleting entry:', error));
  }

  function getAllEntries() {
    var url = 'http://localhost:8000/food/entries';
    axios
      .get(url, {
        responseType: 'json',
      })
      .then((response) => {
        if (response.status === 200) {
          setEntries(response.data);
          setTip(response.data);
        }
      })
      .catch(error => console.error('Error fetching entries:', error));
  }
};

export default Entries;