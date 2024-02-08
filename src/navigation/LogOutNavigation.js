import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Login from '../pages/LoginPages/Login';

function LogOutNavigation() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
    </Routes>
  );
}

export default LogOutNavigation;
