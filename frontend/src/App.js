import React from 'react';
import 'bootstrap/dist/css/bootstrap.css'

import Entries from './components/entries.components'
import TipDisplay from './components/AI/tip';


function App() {
  return (
    <div>
      <Entries />
      <TipDisplay />
    </div>
  );
}

export default App;