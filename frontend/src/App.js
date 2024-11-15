import React from 'react';
import 'bootstrap/dist/css/bootstrap.css'

import Entries from './components/entries.components'
import TipDisplay from './components/AI/tip';
import Navbar from './components/Navbar/Navbar';
import Footer from './components/Footer/Footer';
import Hero from './components/Hero/Hero';
import Me from './components/Me/Me';
import QuoteOne from './components/QuoteOne/QuoteOne';

function App() {
  return (
    <div>
      <Navbar />
      <Hero />
      <Entries />
      <TipDisplay />
      <QuoteOne />
      <Me />
      <Footer />
    </div>
  );
}

export default App;