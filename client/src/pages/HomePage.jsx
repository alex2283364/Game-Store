import React, { useState, useEffect } from 'react';
import api from '../services/api';
import GameCard from '../components/Store/GameCard';
import './HomePage.css';

const HomePage = () => {
    const [games, setGames] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [connectionStatus, setConnectionStatus] = useState('checking');

    useEffect(() => {
        testConnection();
    }, []);

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

    return (
        <div className="home-page">
            {/* Баннер проверки подключения */}
            <div className={`connection-banner ${connectionStatus}`}>
                <div className="banner-content">
                    {connectionStatus === 'checking' && (
                        <>
                            <span className="status-icon">⏳</span>
                            <span>Подключение к серверу...</span>
                        </>
                    )}
                    {connectionStatus === 'connected' && (
                        <>
                            <span className="status-icon">✅</span>
                            <span>Сервер подключён! API работает корректно.</span>
                        </>
                    )}
                    {connectionStatus === 'error' && (
                        <>
                            <span className="status-icon">❌</span>
                            <span>Ошибка подключения: {error}</span>
                            <button onClick={testConnection} className="retry-btn">
                                Повторить
                            </button>
                        </>
                    )}
                </div>
            </div>

            {/* Статистика */}
            <div className="stats-section">
                <div className="stat-card">
                    <h3>🎮 Игр доступно</h3>
                    <p className="stat-number">{games.length}</p>
                </div>
                <div className="stat-card">
                    <h3>🖥️ Статус сервера</h3>
                    <p className={`stat-number ${connectionStatus}`}>
                        {connectionStatus === 'connected' ? 'Онлайн' : 'Оффлайн'}
                    </p>
                </div>
                <div className="stat-card">
                    <h3>🌐 API URL</h3>
                    <p className="stat-url">http://localhost:5000/api</p>
                </div>
            </div>

            {/* Список игр */}
            <section className="games-section">
                <h2>🔥 Доступные игры</h2>
                {loading ? (
                    <div className="loader">Загрузка...</div>
                ) : games.length > 0 ? (
                    <div className="games-grid">
                        {games.map(game => (
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

            {/* Информация для разработчика */}
            <section className="dev-info">
                <h2>🛠️ Информация для разработки</h2>
                <div className="info-grid">
                    <div className="info-card">
                        <h4>Frontend</h4>
                        <p>React 18</p>
                        <p>Порт: 3000</p>
                    </div>
                    <div className="info-card">
                        <h4>Backend</h4>
                        <p>ASP.NET Core 10</p>
                        <p>Порт: 5000</p>
                    </div>
                    <div className="info-card">
                        <h4>Database</h4>
                        <p>PostgreSQL</p>
                        <p>Порт: 5432</p>
                    </div>
                    <div className="info-card">
                        <h4>Swagger</h4>
                        <p><a href="http://localhost:5000/swagger" target="_blank" rel="noreferrer">
                            http://localhost:5000/swagger
                        </a></p>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default HomePage;