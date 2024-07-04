import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { createTheme, ThemeProvider, CssBaseline, Button } from '@mui/material';
import { Brightness4, Brightness7 } from '@mui/icons-material';
import Header from './components/Header';
import Home from './components/Home';
import Members from './components/Members';
import Logs from './components/Logs';
import QRScanner from './components/QRScanner';
import './App.css';

const App = () => {
  const [darkMode, setDarkMode] = useState(false);

  const lightTheme = createTheme({
    palette: {
      mode: 'light',
    },
  });

  const darkTheme = createTheme({
    palette: {
      mode: 'dark',
      background: {
        default: '#121212', // Dark mode background color
      },
    },
  });

  const handleToggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <ThemeProvider theme={darkMode ? darkTheme : lightTheme}>
      <CssBaseline />
      <Router>
        <Header darkMode={darkMode} />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/members" element={<Members darkMode={darkMode} />} />
          <Route path="/logs" element={<Logs />} />
          <Route path="/qr-scanner" element={<QRScanner />} />
        </Routes>
        <Button sx={{ position: 'fixed', bottom: '10px', right: '10px' }} onClick={handleToggleDarkMode} variant="contained">
          {darkMode ? <Brightness7 /> : <Brightness4 />}
        </Button>
      </Router>
    </ThemeProvider>
  );
};

export default App;
