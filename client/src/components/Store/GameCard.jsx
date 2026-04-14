import React from 'react';
import './GameCard.css';

const GameCard = ({ game }) => {
    return (
        <div className="game-card">
            <div className="game-image">
                <img 
                    src={game.imageUrl || 'https://via.placeholder.com/300x200?text=No+Image'} 
                    alt={game.title}
                    onError={(e) => e.target.src = 'https://via.placeholder.com/300x200?text=No+Image'}
                />
            </div>
            <div className="game-info">
                <h3 className="game-title">{game.title}</h3>
                <p className="game-genre">{game.genre}</p>
                <p className="game-description">{game.description?.substring(0, 80)}...</p>
                <div className="game-footer">
                    <span className="game-price">{game.price} ₽</span>
                    <span className="game-rating">⭐ {game.rating}</span>
                </div>
            </div>
        </div>
    );
};

export default GameCard;