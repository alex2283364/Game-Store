import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import './LibraryPage.css';

const LibraryPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    loadLibrary();
  }, [user, navigate]);

  const loadLibrary = async () => {
    try {
      const response = await api.get('/users/profile/games');
      setGames(response.data);
    } catch (error) {
      console.error('Ошибка загрузки библиотеки:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredGames = games.filter(game => {
    const matchesFilter = filter === 'all' || game.genre === filter;
    const matchesSearch = game.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const genres = ['all', ...new Set(games.map(g => g.genre))];

  if (loading) {
    return (
      <div className="library-page">
        <div className="loading">Загрузка библиотеки...</div>
      </div>
    );
  }

  return (
    <div className="library-page">
      <div className="library-header">
        <h1>📚 Моя библиотека</h1>
        <p className="library-count">
          Игр: <strong>{games.length}</strong>
        </p>
      </div>

      {/* Панель фильтров */}
      <div className="library-controls">
        <input
          type="text"
          placeholder="🔍 Поиск игр..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-input"
        />
        
        <div className="genre-filters">
          {genres.map(genre => (
            <button
              key={genre}
              className={`genre-btn ${filter === genre ? 'active' : ''}`}
              onClick={() => setFilter(genre)}
            >
              {genre === 'all' ? 'Все' : genre}
            </button>
          ))}
        </div>
      </div>

      {/* Сетка игр */}
      {filteredGames.length > 0 ? (
        <div className="games-grid">
          {filteredGames.map(game => (
            <div key={game.id} className="game-card">
              <div className="game-image">
                <img 
                  src={game.imageUrl?.startsWith('/') 
                    ? `http://localhost:5000${game.imageUrl}` 
                    : game.imageUrl || 'https://via.placeholder.com/300x200'} 
                  alt={game.title}
                />
                <div className="owned-badge">✓</div>
              </div>
              
              <div className="game-info">
                <h3 className="game-title">{game.title}</h3>
                <span className="game-genre">{game.genre}</span>
                
                <p className="game-description">
                  {game.description?.length > 80 
                    ? game.description.substring(0, 80) + '...' 
                    : game.description}
                </p>
                
                <div className="game-meta">
                  <span className="game-rating">⭐ {game.rating}</span>
                  <span className="game-date">
                    {new Date(game.purchasedAt).toLocaleDateString('ru-RU')}
                  </span>
                </div>
                
                <button 
                  className="btn-play"
                  onClick={() => alert(`Запуск игры "${game.title}"...`)}
                >
                  🎮 Играть
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="no-games">
          <div className="empty-icon">📚</div>
          <h3>Библиотека пуста</h3>
          <p>У вас пока нет купленных игр</p>
          <button 
            className="btn-go-store"
            onClick={() => navigate('/store')}
          >
            🛒 Перейти в магазин
          </button>
        </div>
      )}
    </div>
  );
};

export default LibraryPage;