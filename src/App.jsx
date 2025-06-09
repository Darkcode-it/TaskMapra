import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import AddUserPage from './pages/AddUserPage';
import UsersPage from './pages/UsersPage';
import './App.css';

function App() {
  return (
    <Router basename="/TaskMapra">
      <div className="app" dir="rtl">
        <nav>
          <ul>
            <li><Link to="/">افزودن کاربر</Link></li>
            <li><Link to="/users">لیست کاربران</Link></li>
          </ul>
        </nav>

        <div className="container">
          <Routes>
            <Route path="/" element={<AddUserPage />} />
            <Route path="/users" element={<UsersPage />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;