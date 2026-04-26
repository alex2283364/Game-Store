import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import './UserSearch.css';

const UserSearch = ({ onSelectUser, currentUserId }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (query.length < 2) {
      setResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const response = await api.get(`/users/search?query=${encodeURIComponent(query)}`);
        const filtered = response.data.filter(u => u.id !== currentUserId);
        setResults(filtered);
      } catch (error) {
        console.error('Ошибка поиска:', error);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query, currentUserId]);

  const handleSelect = (user) => {
    onSelectUser(user);
    setQuery('');
    setResults([]);
  };

  return (
    <div className="user-search">
      <input
        type="text"
        placeholder="🔍 Найти пользователя..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="search-input"
      />
      
      {loading && <div className="search-loading">Поиск...</div>}
      
      {results.length > 0 && (
        <div className="search-results">
          {results.map(user => (
            <div
              key={user.id}
              className="search-result-item"
              onClick={() => handleSelect(user)}
            >
              <div className={`avatar ${user.isOnline ? 'online' : 'offline'}`}>
                {user.avatar ? (
                  <img src={user.avatar} alt={user.username} />
                ) : (
                  user.username.charAt(0).toUpperCase()
                )}
              </div>
              <span className="username">{user.username}</span>
              <span className={`status ${user.isOnline ? 'online' : 'offline'}`}>
                {user.isOnline ? '●' : '○'}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserSearch;