import { useState } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import './index.css';
import Tray from './components/Tray/Tray';
import SplashScreen from './components/Splashscreen/Splashscreen';

const App = () => {
  return (
    <>
      <Routes>
        <Route path="/tray" element={<Tray />} />
        <Route path="/splash" element={<SplashScreen />} />
      </Routes>
    </>
  );
};

export default App;
