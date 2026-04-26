import React from 'react';
import { useNavigate } from 'react-router-dom';
import './GameCard.css';

const GameCard = ({ game, owned = false }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/game/${game.id}`);
  };
  const getImageUrl = (game) => {
   // Локальные картинки с backend
  if (game.imageUrl?.startsWith('/')) {
    return `http://localhost:5000${game.imageUrl}`;
  }
  
  // Внешние URL
  if (game.imageUrl?.startsWith('http')) {
    return game.imageUrl;
  }
  
};
  return (
    <div className="game-card" onClick={handleClick}>
      <div className="game-card-image">
        <img 
           src={getImageUrl(game)} 
  alt={game.title}
  onError={(e) => {
    console.error('Ошибка загрузки:', game.title, getImageUrl(game));
    e.target.src = `https://via.placeholder.com/300x200?text=${encodeURIComponent(game.title)}`;
  }}
        />
        {owned && <div className="owned-badge">✓</div>}
        {game.price === 0 && <div className="free-badge">FREE</div>}
      </div>
      
      <div className="game-card-content">
        <h3 className="game-card-title">{game.title}</h3>
        
        <div className="game-card-meta">
          <span className="game-card-genre">{game.genre}</span>
          {game.rating && (
            <span className="game-card-rating">⭐ {game.rating}</span>
          )}
        </div>

        <div className="game-card-footer">
          {game.price === 0 ? (
            <span className="game-card-price free">Бесплатно</span>
          ) : (
            <span className="game-card-price">{game.price.toFixed(2)} ₽</span>
          )}
          <button className="game-card-btn">
            {owned ? 'В библиотеке' : 'Подробнее'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default GameCard;