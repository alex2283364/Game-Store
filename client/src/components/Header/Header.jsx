import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Header.css';

const Header = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <header className="header">
            <div className="header-container">
                <Link to="/" className="logo">
                    🎮 GAME PORTAL
                </Link>

                <nav className="nav">
                    <Link to="/" className="nav-link">🏠 Главная</Link>
                    <Link to="/store" className="nav-link">🛒 Магазин</Link>
                    {user && <Link to="/library" className="nav-link">📚 Библиотека</Link>}
                    {user && <Link to="/chat" className="nav-link">💬 Чат</Link>}
                </nav>

                <div className="header-actions">
                    {user ? (
                        <>
                            <span className="username">👤 {user.username}</span>
                            <button onClick={handleLogout} className="logout-btn">
                                Выйти
                            </button>
                        </>
                    ) : (
                        <Link to="/login" className="login-btn">🔐 Войти</Link>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Header;