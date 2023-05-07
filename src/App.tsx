import { useState } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import './index.css';
import Tray from './components/Tray/Tray';

const App = () => {
  return (
    <>
      <Routes>
        <Route path="/tray" element={<Tray />} />
      </Routes>
    </>
  );
};

export default App;
