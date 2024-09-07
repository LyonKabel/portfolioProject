import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Search from './Components/Search';
import Login from './Components/Login';
import Callback from './Components/Callback';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/login" element={<Login />} />
      <Route path="/callback" element={<Callback />} />
      <Route path="/search" element={<Search />} />
    </Routes>
  );
}

export default App;
