import React from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';

import Entries from './components/entries.components';
import TipDisplay from './components/AI/tip';
import Navbar from './components/Navbar/Navbar';
import Footer from './components/Footer/Footer';
import Hero from './components/Hero/Hero';
import Me from './components/Me/Me';
import QuoteOne from './components/QuoteOne/QuoteOne';
import Ws from './components/Ws/Ws';
import SignUp from './components/SignUp/SignUp';

function App() {
  return (
    <Router>
      <div>
        <Navbar />
        <Routes>
          <Route path="/" element={
            <>
              <Hero />
              <Entries />
              <TipDisplay />
              <QuoteOne />
              <Me />
              <Footer />
            </>
          } />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/ws" element={<Ws />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
