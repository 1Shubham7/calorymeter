import React from 'react';
import 'bootstrap/dist/css/bootstrap.css'

import Entries from './components/entries.components'
import TipDisplay from './components/AI/tip';
import Navbar from './components/Navbar/Navbar';
import Footer from './components/Footer/Footer';
import Hero from './components/Hero/Hero';

function App() {
  return (
    <div>
      <Navbar />
      <Hero />
      <Entries />
      <TipDisplay />
      <Footer />
    </div>
  );
}

export default App;