import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Header.css';
import logo from '../../assets/images/logo.png'; // Путь к твоему логотипу

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
      <Link to="/" className="logo-link">
                <img src={logo} alt="Game Store" className="header-logo" />
                <span className="logo-text">Game Store</span>
            </Link>

        <nav className="nav">
          <Link to="/" className="nav-link">🏠 Главная</Link>
          <Link to="/store" className="nav-link">🛒 Магазин</Link>
          {user && <Link to="/library" className="nav-link">📚 Библиотека</Link>}
          {user && <Link to="/chat" className="nav-link">💬 Чат</Link>}
          {user && <Link to="/cart" className="cart-link">🛒 Корзина</Link>}
        </nav>

        <div className="header-actions">
          {user ? (
            <>
              <div className="user-info">
                <span className="user-balance">💰 {user.balance?.toFixed(2) || 0} ₽</span>
                <Link to="/profile" className="user-profile">
                  👤 {user.username}
                </Link>
              </div>
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