import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';  // 🔥 Добавлено
import api from '../services/api';
import './StorePage.css';
// 🔥 Убран неиспользуемый импорт: import GameCard from '../components/Store/GameCard';

const StorePage = () => {
    const { user } = useAuth();  // 🔥 Добавлено для проверки isOwned
    const [games, setGames] = useState([]);
    const [filteredGames, setFilteredGames] = useState([]);
    const [ownedGames, setOwnedGames] = useState([]);  // 🔥 Добавлено
    const [loading, setLoading] = useState(true);
    const [genres, setGenres] = useState([]);
    const [selectedGenre, setSelectedGenre] = useState('All');
    const [sortBy, setSortBy] = useState('rating');
    const [searchQuery, setSearchQuery] = useState('');
    const [cartCount, setCartCount] = useState(0);  // 🔥 Добавлено

    const navigate = useNavigate();

    useEffect(() => {
        loadGames();
        if (user) {
            loadOwnedGames();  // 🔥 Загружаем купленные игры
        }
    }, [user]);

    useEffect(() => {
        filterAndSortGames();
    }, [games, selectedGenre, sortBy, searchQuery]);

    const loadGames = async () => {
        try {
            const response = await api.get('/games');
            setGames(response.data);
            
            // Получаем уникальные жанры
            const uniqueGenres = [...new Set(response.data.map(g => g.genre))];
            setGenres(['All', ...uniqueGenres]);
            
            setLoading(false);
        } catch (error) {
            console.error('Ошибка загрузки игр:', error);
            setLoading(false);
        }
    };

    const loadOwnedGames = async () => {
        try {
            const response = await api.get('/users/profile/games');
            setOwnedGames(response.data);
        } catch (error) {
            console.error('Ошибка загрузки библиотеки:', error);
        }
    };

    const filterAndSortGames = () => {
        let result = [...games];

        // Фильтр по жанру
        if (selectedGenre !== 'All') {
            result = result.filter(game => game.genre === selectedGenre);
        }

        // Поиск по названию
        if (searchQuery) {
            result = result.filter(game => 
                game.title.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        // Сортировка
        result.sort((a, b) => {
            switch(sortBy) {
                case 'rating':
                    return b.rating - a.rating;
                case 'price-asc':
                    return a.price - b.price;
                case 'price-desc':
                    return b.price - a.price;
                case 'name':
                    return a.title.localeCompare(b.title);
                default:
                    return 0;
            }
        });

        setFilteredGames(result);
    };

    const addToCart = async (gameId) => {
        try {
            await api.post(`/cart/add/${gameId}`);
            alert('✅ Добавлено в корзину');
            setCartCount(prev => prev + 1);  // 🔥 Теперь cartCount определён
        } catch (error) {
            alert(error.response?.data?.message || 'Ошибка добавления');
        }
    };

    // 🔥 Удалена неиспользуемая функция handleAddToCart

    if (loading) {
        return (
            <div className="store-page">
                <div className="loader">Загрузка игр...</div>
            </div>
        );
    }

    return (
        <div className="store-page">
            <div className="store-header">
                <h1>🛒 Магазин игр</h1>
                <p className="store-subtitle">
                    Найдено игр: <strong>{filteredGames.length}</strong> из {games.length}
                </p>
            </div>

            {/* Панель фильтров */}
            <div className="filters-panel">
                <div className="filter-group">
                    <label>🔍 Поиск:</label>
                    <input
                        type="text"
                        placeholder="Название игры..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="search-input"
                    />
                </div>

                <div className="filter-group">
                    <label>🎮 Жанр:</label>
                    <select 
                        value={selectedGenre} 
                        onChange={(e) => setSelectedGenre(e.target.value)}
                        className="filter-select"
                    >
                        {genres.map(genre => (
                            <option key={genre} value={genre}>
                                {genre === 'All' ? 'Все жанры' : genre}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="filter-group">
                    <label>📊 Сортировка:</label>
                    <select 
                        value={sortBy} 
                        onChange={(e) => setSortBy(e.target.value)}
                        className="filter-select"
                    >
                        <option value="rating">⭐ По рейтингу</option>
                        <option value="price-asc">💰 По цене (возрастание)</option>
                        <option value="price-desc">💰 По цене (убывание)</option>
                        <option value="name">🔤 По названию</option>
                    </select>
                </div>
            </div>

            {/* Сетка игр */}
            {filteredGames.length > 0 ? (
                <div className="games-grid">
                    {filteredGames.map(game => {
                        // 🔥 Проверяем, куплена ли игра
                        const isOwned = ownedGames.some(og => og.id === game.id);
                        
                        return (
                            <div key={game.id} className="game-card">
                                <div className="game-image">
                                    <img 
                                        src={`http://localhost:5000${game.imageUrl}`} 
                                        alt={game.title}
                                    
                                    />
                                </div>
                                <div className="game-info">
                                    <h3 className="game-title">{game.title}</h3>
                                    <span className="game-genre">{game.genre}</span>
                                    <p className="game-description">
                                        {game.description?.length > 100 
                                            ? game.description.substring(0, 100) + '...' 
                                            : game.description}
                                    </p>
                                    <div className="game-meta">
                                        <span className="game-rating">⭐ {game.rating}</span>
                                        <span className="game-date">
                                            {new Date(game.releaseDate).getFullYear()}
                                        </span>
                                    </div>
                                    <div className="game-footer">
                                        <span className="game-price">{game.price} ₽</span>
                                        <button 
                                            className="btn-add-cart"
                                            onClick={() => addToCart(game.id)}
                                            disabled={isOwned}  // 🔥 Теперь isOwned определён
                                        >
                                            {isOwned ? '✓ В библиотеке' : '🛒 В корзину'}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            ) : (
                <div className="no-games">
                    <p>😕 Игры не найдены</p>
                    <p className="hint">Попробуйте изменить фильтры или поиск</p>
                </div>
            )}
        </div>
    );
};

export default StorePage;