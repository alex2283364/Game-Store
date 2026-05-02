import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Header from './components/Header/Header';
import HomePage from './pages/HomePage';
import StorePage from './pages/StorePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ChatPage from './pages/ChatPage';
import ProfilePage from './pages/ProfilePage';
import LibraryPage from './pages/LibraryPage';
import CartPage from './pages/CartPage';
import TopUpPage from './pages/TopUpPage';
import GamePage from './pages/GamePage';
import './App.css';

// 🔥 Компонент защиты роутов
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  // 🔥 Ждём завершения проверки авторизации
  if (loading) {
    return (
      <div className="loading-screen">
        <div className="spinner"></div>
        <p>Загрузка...</p>
      </div>
    );
  }
  
  // 🔥 Если не авторизован - редирект на login
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

// 🔥 Компонент для публичных страниц (login/register)
const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="loading-screen">
        <div className="spinner"></div>
        <p>Загрузка...</p>
      </div>
    );
  }
  
  // 🔥 Если уже авторизован - редирект на главную
  if (user) {
    return <Navigate to="/" replace />;
  }
  
  return children;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Header />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<HomePage />} />
              
              {/* Публичные роуты */}
              <Route path="/login" element={
                <PublicRoute>
                  <LoginPage />
                </PublicRoute>
              } />
              <Route path="/register" element={
                <PublicRoute>
                  <RegisterPage />
                </PublicRoute>
              } />
              
              {/* Защищённые роуты */}
              <Route path="/store" element={
                <ProtectedRoute>
                  <StorePage />
                </ProtectedRoute>
              } />
              <Route path="/chat" element={
                <ProtectedRoute>
                  <ChatPage />
                </ProtectedRoute>
              } />
              <Route path="/profile" element={
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              } />
              <Route path="/library" element={
                <ProtectedRoute>
                  <LibraryPage />
                </ProtectedRoute>
              } />
              <Route path="/cart" element={
                <ProtectedRoute>
                  <CartPage />
                </ProtectedRoute>
              } />
              <Route path="/topup" element={
                <ProtectedRoute>
                  <TopUpPage />
                </ProtectedRoute>
              } />
              <Route path="/game/:id" element={
                <ProtectedRoute>
                  <GamePage />
                </ProtectedRoute>
              } />
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;