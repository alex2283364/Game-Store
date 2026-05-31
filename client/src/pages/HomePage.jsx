import React, { useState, useEffect } from 'react';
import api from '../services/api';
import GameCard from '../components/Store/GameCard';
import './HomePage.css';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState('checking');
  const navigate = useNavigate(); 
  
  // Состояния карусели
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const AUTO_PLAY_INTERVAL = 5000;

  useEffect(() => {
    testConnection();
  }, []);

  // Автопрокрутка
  useEffect(() => {
    if (!isAutoPlaying || games.length <= 1) return;
    
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % games.length);
    }, AUTO_PLAY_INTERVAL);
    
    return () => clearInterval(timer);
  }, [isAutoPlaying, games.length]);

  const testConnection = async () => {
    try {
      setConnectionStatus('checking');
      const response = await api.get('/games');
      setGames(response.data);
      setConnectionStatus('connected');
      setLoading(false);
    } catch (err) {
      setConnectionStatus('error');
      setError(err.message);
      setLoading(false);
    }
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % games.length);
    pauseAutoPlay();
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + games.length) % games.length);
    pauseAutoPlay();
  };

  const goToSlide = (index) => {
    setCurrentIndex(index);
    pauseAutoPlay();
  };

  const pauseAutoPlay = () => {
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 8000);
  };

  // 🔥 Берём только первые 10 игр для карусели
  const carouselGames = games.slice(0, 10);


  const handleGameDetails = (gameId) => {
    navigate(`/game/${gameId}`);
  };

  // Рендер карусели
  const renderCarousel = () => {
    if (loading || carouselGames.length === 0) {
      return (
        <div className="carousel-container carousel-loading">
          <p>{loading ? 'Загрузка баннеров...' : 'Нет игр для отображения'}</p>
        </div>
      );
    }

    // 🔥 Получаем текущую игру с проверкой
    const currentGame = carouselGames[currentIndex];
    
    // 🔥 Если игры нет - показываем первую
    if (!currentGame) {
      setCurrentIndex(0);
      return null;
    }

    const getImageUrl = (game) => {
      if (game.imageUrl?.startsWith('/')) {
        return `http://localhost:5000${game.imageUrl}`;
      }
      if (game.imageUrl?.startsWith('http')) {
        return game.imageUrl;
      }
      return `https://via.placeholder.com/600x400?text=${encodeURIComponent(game.title || 'Game')}`;
    };

    return (
      <div 
        className="carousel-container" 
        onMouseEnter={() => setIsAutoPlaying(false)}
        onMouseLeave={() => setIsAutoPlaying(true)}
      >
        <div className="carousel-slide active">
          <img src={getImageUrl(currentGame)} alt={currentGame.title || currentGame.name} className="carousel-image" />
          <div className="carousel-overlay">
            <div className="carousel-content">
              <h2>{currentGame.title || currentGame.name}</h2>
              <p className="carousel-desc">{currentGame.description?.slice(0, 120) || 'Описание недоступно'}...</p>
              <div className="carousel-actions">
                <span className="carousel-price">₽{currentGame.price ?? '0.00'}</span>
                <button className="carousel-cta-btn"  onClick={() => handleGameDetails(currentGame.id)} >Подробнее</button>
              </div>
            </div>
          </div>
        </div>

        {/* Стрелки */}
        <button className="carousel-btn prev" onClick={prevSlide} aria-label="Предыдущая игра">&#10094;</button>
        <button className="carousel-btn next" onClick={nextSlide} aria-label="Следующая игра">&#10095;</button>

        {/* Точки навигации - ТОЛЬКО для карусели (10 игр) */}
        <div className="carousel-dots">
          {carouselGames.map((_, idx) => (
            <button
              key={idx}
              className={`carousel-dot ${idx === currentIndex ? 'active' : ''}`}
              onClick={() => goToSlide(idx)}
              aria-label={`Перейти к игре ${idx + 1}`}
            />
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="home-page">
      {/* Карусель игр (ТОЛЬКО 10 ИГР) */}
      <section className="featured-carousel">
        {renderCarousel()}
      </section>

      {/* Список игр (ВСЕ ИГРЫ) */}
      <section className="games-section">
        <h2>🔥 Доступные игры</h2>
        {loading ? (
          <div className="loader">Загрузка...</div>
        ) : games.length > 0 ? (
          <div className="games-grid">
            {games.map((game) => (
              <GameCard key={game.id} game={game} />
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <p>📭 В базе данных пока нет игр</p>
            <p className="hint">Добавьте игры через PostgreSQL или Swagger</p>
          </div>
        )}
      </section>
    </div>
  );
};

export default HomePage;