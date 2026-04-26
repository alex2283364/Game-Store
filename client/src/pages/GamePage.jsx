import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import './GamePage.css';

const GamePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, updateUserBalance } = useAuth();
  const [game, setGame] = useState(null);
  const [loading, setLoading] = useState(true);
  const [purchasing, setPurchasing] = useState(false);
  const [alreadyOwned, setAlreadyOwned] = useState(false);

  useEffect(() => {
    loadGame();
  }, [id]);

  const getImageUrl = (game) => {
  if (game.imageUrl?.startsWith('/')) {
    return `http://localhost:5000${game.imageUrl}`;
  }
  if (game.imageUrl?.startsWith('http')) {
    return game.imageUrl;
  }
  return `https://via.placeholder.com/600x400?text=${encodeURIComponent(game.title)}`;
};

  const loadGame = async () => {
    try {
      const response = await api.get(`/games/${id}`);
      setGame(response.data);
      
      // Проверяем, есть ли игра у пользователя
      if (user) {
        const ownedGames = await api.get('/users/profile/games');
        const isOwned = ownedGames.data.some(g => g.id === parseInt(id));
        setAlreadyOwned(isOwned);
      }
    } catch (error) {
      console.error('Ошибка загрузки игры:', error);
      navigate('/store');
    } finally {
      setLoading(false);
    }
  };

  const handleBuy = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    if (alreadyOwned) {
      alert('У вас уже есть эта игра');
      return;
    }

    if (user.balance < game.price) {
      alert('Недостаточно средств на балансе');
      navigate('/topup');
      return;
    }

    setPurchasing(true);

    try {
      const response = await api.post(`/store/purchase/${id}`);
      alert(response.data.message);
      updateUserBalance(response.data.newBalance);
      setAlreadyOwned(true);
    } catch (error) {
      alert(error.response?.data?.message || 'Ошибка покупки');
    } finally {
      setPurchasing(false);
    }
  };

  if (loading) {
    return (
      <div className="game-page">
        <div className="loading">Загрузка...</div>
      </div>
    );
  }

  if (!game) {
    return (
      <div className="game-page">
        <div className="error">Игра не найдена</div>
      </div>
    );
  }

  return (
    <div className="game-page">
      <div className="game-container">
        {/* Обложка игры */}
        <div className="game-hero">
          <div className="game-cover">
            <img 
              src={getImageUrl(game)} 
              alt={game.title}
              onError={(e) => {
                e.target.src = `https://via.placeholder.com/600x400?text=${encodeURIComponent(game.title)}`;
              }}
          />
          </div>
          
          <div className="game-info">
            <h1 className="game-title">{game.title}</h1>
            
            <div className="game-meta">
              <span className="genre-tag">{game.genre}</span>
              <span className="rating">⭐ {game.rating || 'N/A'}</span>
              <span className="release-date">
                📅 {new Date(game.releaseDate).toLocaleDateString('ru-RU')}
              </span>
            </div>

            <div className="game-price-block">
              {game.price === 0 ? (
                <span className="price-free">Бесплатно</span>
              ) : (
                <span className="price">{game.price.toFixed(2)} ₽</span>
              )}
            </div>

            {alreadyOwned ? (
              <button className="btn-owned" disabled>
                ✓ В вашей библиотеке
              </button>
            ) : (
              <button 
                className="btn-buy"
                onClick={handleBuy}
                disabled={purchasing || (user && user.balance < game.price)}
              >
                {purchasing ? '⏳ Покупка...' : 
                 user && user.balance < game.price ? '❌ Недостаточно средств' : 
                 `💰 Купить`}
              </button>
            )}

            {!alreadyOwned && user && user.balance < game.price && (
              <button 
                className="btn-topup"
                onClick={() => navigate('/topup')}
              >
                ➕ Пополнить баланс
              </button>
            )}
          </div>
        </div>

        {/* Описание */}
        <div className="game-description-section">
          <h2>📖 Описание</h2>
          <p className="game-description">
            {game.description || 'Описание отсутствует'}
          </p>
        </div>

        {/* Дополнительная информация */}
        <div className="game-details">
          <h2>📋 Информация</h2>
          <div className="details-grid">
            <div className="detail-item">
              <label>Жанр</label>
              <span>{game.genre}</span>
            </div>
            <div className="detail-item">
              <label>Рейтинг</label>
              <span>⭐ {game.rating || 'N/A'}/5</span>
            </div>
            <div className="detail-item">
              <label>Дата выхода</label>
              <span>{new Date(game.releaseDate).toLocaleDateString('ru-RU')}</span>
            </div>
            <div className="detail-item">
              <label>Цена</label>
              <span>{game.price === 0 ? 'Бесплатно' : `${game.price.toFixed(2)} ₽`}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GamePage;