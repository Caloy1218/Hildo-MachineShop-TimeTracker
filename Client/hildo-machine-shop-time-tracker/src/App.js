import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Home from './components/Home';
import Members from './components/Members';
import Logs from './components/Logs';
import QRScanner from './components/QRScanner';

const App = () => {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/members" element={<Members />} />
        <Route path="/logs" element={<Logs />} />
        <Route path="/qr-scanner" element={<QRScanner />} />
      </Routes>
    </Router>
  );
};

export default App;
