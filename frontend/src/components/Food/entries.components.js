import React, { useCallback, useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import './entries.css';
import Entry from './single-entry.component';
import ImageRecognition from '../ImageRecognition/ImageRecognition';

const Entries = ({ isAuthenticated }) => {
  const [entries, setEntries] = useState([]);
  const [requestError, setRequestError] = useState('');
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
    calories: '',
    fat: '',
  });
  const [calcLoading, setCalcLoading] = useState(false);
  const [calcError, setCalcError]   = useState('');
  const [calcMatch, setCalcMatch]   = useState('');
  const token = localStorage.getItem('token');
  const authHeaders = useMemo(() => (
    token
      ? {
          Authorization: `Bearer ${token}`,
        }
      : {}
  ), [token]);

  const getAllEntries = useCallback(() => {
    var url = 'http://localhost:8000/food/entries';
    axios
      .get(url, {
        responseType: 'json',
        headers: authHeaders,
      })
      .then((response) => {
        if (response.status >= 200 && response.status < 300) {
          setEntries(response.data);
          setRequestError('');
        }
      })
      .catch(error => {
        console.error('Error fetching entries:', error);
        setRequestError(error?.response?.data?.error || 'Failed to fetch entries.');
      });
  }, [authHeaders]);

  useEffect(() => {
    if (isAuthenticated) {
      getAllEntries();
    }
  }, [getAllEntries, isAuthenticated]);

  if (!isAuthenticated) {
    return (
      <section className="entries-section" id="track">
        <div className="entries-container">
          <div className="entries-auth-gate">
            <p className="entries-eyebrow">Login required</p>
            <h2>Log in before you create or review calorie entries.</h2>
            <p className="entries-lead">
              CaloriTrack keeps meal tracking, AI tips, and image-recognition
              follow-up behind your account. Create an account or log in first
              to start using the tracker.
            </p>
            <div className="entries-actions-row">
              <a className="entries-auth-link entries-auth-primary" href="/login">
                Log in
              </a>
              <a className="entries-auth-link entries-auth-secondary" href="/signup">
                Create account
              </a>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="entries-section" id="track">
      <div className="entries-container">
        <div className="entries-intro">
          <div className="entries-intro-copy">
            <p className="entries-eyebrow">Calorie dashboard</p>
            <h2>Track what you ate today and keep the next decision obvious.</h2>
            <p className="entries-lead">
              Use the tracker for manual entries, edits, and quick daily review.
              If you only know the meal visually, use image recognition first
              and then continue refining your log here.
            </p>
            <div className="entries-actions-row">
              <button
                className="primary-button"
                onClick={() => setAddNewEntry(true)}
              >
                Add calorie entry
              </button>
              <span className="entries-meta">
                {entries.length} {entries.length === 1 ? 'entry' : 'entries'} logged
              </span>
            </div>
          </div>
          <div className="entries-side-panel">
            <ImageRecognition />
          </div>
        </div>

        <div className="entries-list">
          {requestError && (
            <div className="entries-request-error">{requestError}</div>
          )}
          {entries != null && entries.length > 0 ? (
            entries.map((entry) => (
              <Entry
                key={entry._id}
                entryData={entry}
                deleteSingleEntry={deleteSingleEntry}
                setChangeIngredient={setChangeIngredient}
                setChangeEntry={setChangeEntry}
              />
            ))
          ) : (
            <div className="entries-empty-state">
              <h3>No entries logged yet</h3>
              <p>
                Start with a meal you already know, then build momentum one
                entry at a time.
              </p>
            </div>
          )}
        </div>

        {addNewEntry && (
          <div className="modal-overlay" onClick={() => { setAddNewEntry(false); setCalcError(''); setCalcMatch(''); }}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2>Add Calorie Entry</h2>
                <button className="close-button" onClick={() => { setAddNewEntry(false); setCalcError(''); setCalcMatch(''); }}>×</button>
              </div>

              <div className="modal-body">
                <div className="form-group">
                  <label>Dish</label>
                  <input
                    type="text"
                    value={newEntry.dish}
                    onChange={(event) => {
                      setNewEntry({...newEntry, dish: event.target.value});
                    }}
                  />

                  <label>Ingredients</label>
                  <input
                    type="text"
                    value={newEntry.ingredients}
                    onChange={(event) => {
                      setNewEntry({...newEntry, ingredients: event.target.value});
                    }}
                  />

                  <button
                    type="button"
                    className="calc-button"
                    onClick={() => calculateCalories()}
                    disabled={calcLoading || !newEntry.dish.trim()}
                  >
                    {calcLoading ? 'Calculating...' : '✦ Calculate Calories'}
                  </button>

                  {calcError && (
                    <p className="calc-error">{calcError}</p>
                  )}
                  {calcMatch && !calcError && (
                    <p className="calc-match">Matched: {calcMatch}</p>
                  )}

                  <label>Calories</label>
                  <input
                    type="number"
                    value={newEntry.calories}
                    onChange={(event) => {
                      setNewEntry({...newEntry, calories: event.target.value});
                    }}
                  />

                  <label>Fat (g)</label>
                  <input
                    type="number"
                    value={newEntry.fat}
                    onChange={(event) => {
                      setNewEntry({...newEntry, fat: event.target.value});
                    }}
                  />
                </div>
                
                <div className="button-group">
                  <button className="primary-button" onClick={() => addSingleEntry()}>Add</button>
                  <button className="secondary-button" onClick={() => { setAddNewEntry(false); setCalcError(''); setCalcMatch(''); }}>Cancel</button>
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
    </section>
  );

  async function calculateCalories() {
    setCalcError('');
    setCalcMatch('');
    setCalcLoading(true);
    try {
      const response = await axios.post(
        'http://localhost:8000/food/calculate-calories',
        { dish: newEntry.dish, ingredients: newEntry.ingredients },
        { headers: authHeaders },
      );
      if (response.status >= 200 && response.status < 300) {
        setNewEntry(prev => ({
          ...prev,
          calories: response.data.calories,
          fat:      response.data.fat,
        }));
        if (response.data.matched_food) {
          setCalcMatch(response.data.matched_food);
        }
      }
    } catch (error) {
      setCalcError(
        error?.response?.data?.error ||
        'Could not estimate calories. You can still enter them manually.'
      );
    } finally {
      setCalcLoading(false);
    }
  }

  async function changeIngredientForEntry() {
    setRequestError('');
    var url = 'http://localhost:8000/food/ingredient/update/' + changeIngredient.id;
    try {
      const response = await axios.put(url, {
        ingredients: newIngredientName,
      }, {
        headers: authHeaders,
      });

      if (response.status >= 200 && response.status < 300) {
        setChangeIngredient({ change: false, id: 0 });
        await getAllEntries();
      }
    } catch (error) {
      console.error('Error updating ingredient:', error);
      setRequestError(error?.response?.data?.error || 'Failed to update ingredients.');
    }
  }

  async function changeSingleEntry() {
    setRequestError('');
    var url = 'http://localhost:8000/food/entry/update/' + changeEntry.id;
    try {
      const response = await axios.put(url, {
        dish: newEntry.dish, 
        ingredients: newEntry.ingredients, 
        calories: parseInt(newEntry.calories, 10) || 0, 
        fat: parseFloat(newEntry.fat) || 0, 
      }, {
        headers: authHeaders,
      });

      if (response.status >= 200 && response.status < 300) {
        setChangeEntry({ change: false, id: 0 });
        await getAllEntries();
      }
    } catch (error) {
      console.error('Error updating entry:', error);
      setRequestError(error?.response?.data?.error || 'Failed to update entry.');
    }
  }

  async function addSingleEntry() {
    setRequestError('');
    var url = 'http://localhost:8000/food/create';
    try {
      const response = await axios.post(url, {
        ingredients: newEntry.ingredients,
        dish: newEntry.dish,
        calories: parseFloat(newEntry.calories),
        fat: parseFloat(newEntry.fat),
      }, {
        headers: authHeaders,
      });

      if (response.status >= 200 && response.status < 300) {
        setAddNewEntry(false);
        setCalcError('');
        setCalcMatch('');
        setNewEntry({
          dish: '',
          ingredients: '',
          calories: '',
          fat: '',
        });
        await getAllEntries();
      }
    } catch (error) {
      console.error('Error creating entry:', error);
      setRequestError(error?.response?.data?.error || 'Failed to create entry.');
    }
  }

  async function deleteSingleEntry(id) {
    var url = 'http://localhost:8000/food/entry/delete/' + id;
    try {
      const response = await axios.delete(url, {
        headers: authHeaders,
      });

      if (response.status >= 200 && response.status < 300) {
        await getAllEntries();
      }
    } catch (error) {
      console.error('Error deleting entry:', error);
      setRequestError(error?.response?.data?.error || 'Failed to delete entry.');
    }
  }
};

export default Entries;
