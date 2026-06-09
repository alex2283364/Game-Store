import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import './ProfilePage.css';

const ProfilePage = () => {
  const { user, updateUserBalance } = useAuth();  // ✅ Правильно деструктуризируем
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [ownedGames, setOwnedGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('profile');


  const [friends, setFriends] = useState([]);
  const [friendRequests, setFriendRequests] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showAddFriend, setShowAddFriend] = useState(false);

  const loadFriends = async () => {
  try {
    const response = await api.get('/friends');
    setFriends(response.data);
  } catch (error) {
    console.error('Ошибка загрузки друзей:', error);
  }
};

const loadFriendRequests = async () => {
  try {
    const response = await api.get('/friends/requests');
    setFriendRequests(response.data);
  } catch (error) {
    console.error('Ошибка загрузки заявок:', error);
  }
};

const searchFriends = async (query) => {
  setSearchQuery(query);
  
  if (query.length < 2) {
    setSearchResults([]);
    return;
  }
  
  try {
    const response = await api.get(`/friends/search?query=${query}`);
    setSearchResults(response.data);
  } catch (error) {
    console.error('Ошибка поиска:', error);
  }
};

const addFriend = async (userId) => {
  try {
    await api.post(`/friends/request/${userId}`);
    alert('Заявка в друзья отправлена');
    setSearchResults([]);
    setSearchQuery('');
  } catch (error) {
    alert(error.response?.data?.message || 'Ошибка отправки заявки');
  }
};

const acceptFriendRequest = async (userId) => {
  try {
    await api.post(`/friends/accept/${userId}`);
    loadFriends();
    loadFriendRequests();
  } catch (error) {
    alert('Ошибка принятия заявки');
  }
};

const removeFriend = async (userId) => {
  if (!confirm('Удалить из друзей?')) return;
  
  try {
    await api.delete(`/friends/${userId}`);
    loadFriends();
  } catch (error) {
    alert('Ошибка удаления друга');
  }
};

  useEffect(() => {
  if (!user) {
    navigate('/login');
    return;
  }
  loadProfile();
  loadOwnedGames();
  loadFriends();
  loadFriendRequests();
}, [user, navigate]);

  const loadProfile = async () => {
    try {
      const response = await api.get('/users/profile');
      setProfile(response.data);
      
      // ✅ Вызываем updateUserBalance если он существует
      if (updateUserBalance && typeof updateUserBalance === 'function') {
        updateUserBalance(response.data.balance);
      }
      
      setError('');
    } catch (error) {
      console.error('Ошибка загрузки профиля:', error);
      setError('❌ Ошибка загрузки профиля: ' + (error.message || 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  const loadOwnedGames = async () => {
    try {
      const response = await api.get('/users/profile/games');
      setOwnedGames(response.data);
    } catch (error) {
      console.error('Ошибка загрузки игр:', error);
    }
  };

  if (loading) {
    return (
      <div className="profile-page">
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Загрузка профиля...</p>
        </div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="profile-page">
        <div className="error-container">
          <p className="error-message">{error || '❌ Ошибка загрузки профиля'}</p>
          <button onClick={() => navigate('/')} className="btn-home">
            На главную
          </button>
          <button onClick={() => window.location.reload()} className="btn-retry">
            🔄 Повторить
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <div className="profile-container">
        {/* Header */}
        <div className="profile-header">
          <div className="profile-avatar-section">
            <div className="profile-avatar-large">
              {profile.avatar ? (
                <img src={profile.avatar} alt={profile.username} />
              ) : (
                <div className="avatar-placeholder">
                  {profile.username.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
          </div>
          
          <div className="profile-info-section">
            <h1 className="profile-username">{profile.username}</h1>
            <p className="profile-email">📧 {profile.email}</p>
            <p className="profile-member-since">
              📅 На сайте с {new Date(profile.createdAt).toLocaleDateString('ru-RU', {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
              })}
            </p>
          </div>

          <div className="profile-balance-section">
            <div className="balance-card">
              <span className="balance-label">💰 Баланс</span>
              <span className="balance-value">{profile.balance.toFixed(2)} ₽</span>
            </div>
            <button 
              className="btn-topup"
              onClick={() => navigate('/topup')}
            >
              ➕ Пополнить
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="profile-tabs">
          <button 
            className={`tab-btn ${activeTab === 'profile' ? 'active' : ''}`}
            onClick={() => setActiveTab('profile')}
          >
            👤 Профиль
          </button>
          <button 
            className={`tab-btn ${activeTab === 'games' ? 'active' : ''}`}
            onClick={() => setActiveTab('games')}
          >
            📚 Библиотека ({ownedGames.length})
          </button>
          <button 
            className={`tab-btn ${activeTab === 'friends' ? 'active' : ''}`}
            onClick={() => setActiveTab('friends')}
          >
            👥 Друзья ({friends.length})
          </button>
        </div>

        {/* Content */}
        <div className="profile-content">
          {activeTab === 'profile' && (
            <div className="tab-content">
              <h2>📋 Информация о профиле</h2>
              <div className="info-grid">
                <div className="info-item">
                  <label>ID пользователя</label>
                  <span>#{profile.id}</span>
                </div>
                <div className="info-item">
                  <label>Имя пользователя</label>
                  <span>{profile.username}</span>
                </div>
                <div className="info-item">
                  <label>Email</label>
                  <span>{profile.email}</span>
                </div>
                <div className="info-item">
                  <label>Баланс</label>
                  <span className="balance-highlight">{profile.balance.toFixed(2)} ₽</span>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'games' && (
            <div className="tab-content">
              <h2>📚 Моя библиотека</h2>
              {ownedGames.length > 0 ? (
                <div className="games-grid">
                  {ownedGames.map(game => (
                   <div 
                   key={game.id} 
                   className="game-card"
                   onClick={() => navigate(`/game/${game.id}`)}
                   style={{ cursor: 'pointer' }}
               >
                      <img src={`http://localhost:5000${game.imageUrl}`} alt={game.title} />
                      <div className="game-card-info">
                        <h3>{game.title}</h3>
                        <p>{game.genre}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p>У вас пока нет игр</p>
              )}
            </div>
          )}

          {activeTab === 'stats' && (
            <div className="tab-content">
              <h2>📊 Статистика</h2>
              <div className="stats-grid">
                <div className="stat-card">
                  <div className="stat-value">{profile.totalSpent?.toFixed(2) || 0} ₽</div>
                  <div className="stat-label">Всего потрачено</div>
                </div>
                <div className="stat-card">
                  <div className="stat-value">{ownedGames.length}</div>
                  <div className="stat-label">Игр в библиотеке</div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'friends' && (
            <div className="tab-content friends-tab">
              <div className="friends-header">
                <h2>👥 Мои друзья</h2>
                <button 
                  className="btn-add-friend"
                  onClick={() => setShowAddFriend(!showAddFriend)}
                >
                  ➕ Добавить друга
                </button>
              </div>

              {/* Поиск друзей */}
              {showAddFriend && (
                <div className="add-friend-section">
                  <input
                    type="text"
                    placeholder="🔍 Поиск по имени или email..."
                    value={searchQuery}
                    onChange={(e) => searchFriends(e.target.value)}
                    className="friend-search-input"
                  />
                  
                  {searchResults.length > 0 && (
                    <div className="search-results">
                      {searchResults.map(user => (
                        <div key={user.id} className="search-result-item">
                          <div className="user-avatar">
                            {user.avatar ? (
                              <img src={user.avatar} alt={user.username} />
                            ) : (
                              user.username.charAt(0).toUpperCase()
                            )}
                          </div>
                          <div className="user-info">
                            <span className="username">{user.username}</span>
                            <span className={`status ${user.isOnline ? 'online' : 'offline'}`}>
                              {user.isOnline ? '🟢 Онлайн' : '⚫ Оффлайн'}
                            </span>
                          </div>
                          <button 
                            className="btn-add"
                            onClick={() => addFriend(user.id)}
                          >
                            Добавить
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Входящие заявки */}
              {friendRequests.length > 0 && (
                <div className="friend-requests">
                  <h3>📩 Входящие заявки ({friendRequests.length})</h3>
                  <div className="requests-list">
                    {friendRequests.map(request => (
                      <div key={request.id} className="request-item">
                        <div className="user-avatar">
                          {request.avatar ? (
                            <img src={request.avatar} alt={request.username} />
                          ) : (
                            request.username.charAt(0).toUpperCase()
                          )}
                        </div>
                        <div className="user-info">
                          <span className="username">{request.username}</span>
                        </div>
                        <div className="request-actions">
                          <button 
                            className="btn-accept"
                            onClick={() => acceptFriendRequest(request.userId)}
                          >
                            ✓ Принять
                          </button>
                          <button className="btn-decline">✗ Отклонить</button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Список друзей */}
              <div className="friends-list">
                {friends.length > 0 ? (
                  friends.map(friend => (
                    <div key={friend.id} className="friend-item">
                      <div className={`avatar ${friend.isOnline ? 'online' : 'offline'}`}>
                        {friend.avatar ? (
                          <img src={friend.avatar} alt={friend.username} />
                        ) : (
                          friend.username.charAt(0).toUpperCase()
                        )}
                      </div>
                      <div className="friend-info">
                        <span className="username">{friend.username}</span>
                        <span className={`status ${friend.isOnline ? 'online' : 'offline'}`}>
                          {friend.isOnline ? '🟢 В сети' : '⚫ Не в сети'}
                        </span>
                      </div>
                      <button 
                        className="btn-remove-friend"
                        onClick={() => removeFriend(friend.id)}
                      >
                        ✕
                      </button>
                    </div>
                  ))
                ) : (
                  <div className="no-friends">
                    <p>😕 У вас пока нет друзей</p>
                    <p className="hint">Используйте поиск чтобы добавить друзей</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;