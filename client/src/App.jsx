import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Header from './components/Header/Header';
import HomePage from './pages/HomePage';
import StorePage from './pages/StorePage';
import LoginPage from './pages/LoginPage';
import './App.css';

function App() {
    return (
        <AuthProvider>
            <Router>
                <div className="App">
                    <Header />
                    <main className="main-content">
                        <Routes>
                            <Route path="/pages" element={<HomePage />} />
                            <Route path="/pages" element={<StorePage />} />
                            <Route path="/pages" element={<LoginPage />} />
                        </Routes>
                    </main>
                </div>
            </Router>
        </AuthProvider>
    );
}

export default App;