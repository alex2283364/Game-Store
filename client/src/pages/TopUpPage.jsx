import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import './TopUpPage.css';

const TopUpPage = () => {
  const { user, updateUserBalance } = useAuth();
  const navigate = useNavigate();
  
  const [amount, setAmount] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardHolder, setCardHolder] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Предопределённые суммы для быстрого выбора
  const predefinedAmounts = [100, 300, 500, 1000, 3000, 5000];

  const handleTopUp = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    // Валидация
    if (!amount || parseFloat(amount) < 10) {
      setError('Минимальная сумма пополнения: 10 ₽');
      setLoading(false);
      return;
    }

    if (!cardNumber || !cardHolder || !expiry || !cvv) {
      setError('Заполните все поля карты');
      setLoading(false);
      return;
    }

    try {
      const response = await api.post('/payment/topup', {
        amount: parseFloat(amount),
        cardNumber: `**** **** **** ${cardNumber.slice(-4)}`,
        cardHolder: cardHolder.toUpperCase()
      });

      setSuccess(response.data.message);
      updateUserBalance(response.data.newBalance);
      
      // Перенаправление через 2 секунды
      setTimeout(() => {
        navigate('/profile');
      }, 2000);

    } catch (err) {
      console.error('Ошибка пополнения:', err);
      setError(err.response?.data?.message || 'Ошибка пополнения счета');
    } finally {
      setLoading(false);
    }
  };

  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || '';
    const parts = [];

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }

    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  const formatExpiry = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return v.substring(0, 2) + '/' + v.substring(2, 4);
    }
    return v;
  };

  return (
    <div className="topup-page">
      <div className="topup-container">
        <h1>💳 Пополнение счета</h1>
        
        <div className="current-balance">
          <p>Текущий баланс:</p>
          <span className="balance-value">{user?.balance?.toFixed(2) || 0} ₽</span>
        </div>

        {error && <div className="error-message">❌ {error}</div>}
        {success && <div className="success-message">✅ {success}</div>}

        <form onSubmit={handleTopUp} className="topup-form">
          {/* Сумма пополнения */}
          <div className="form-section">
            <label className="section-label">💰 Сумма пополнения</label>
            
            <div className="amount-presets">
              {predefinedAmounts.map((val) => (
                <button
                  key={val}
                  type="button"
                  className={`preset-btn ${amount === val.toString() ? 'active' : ''}`}
                  onClick={() => setAmount(val.toString())}
                >
                  {val} ₽
                </button>
              ))}
            </div>

            <div className="custom-amount">
              <span>Или введите свою сумму:</span>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Минимум 10 ₽"
                min="10"
                max="100000"
                step="10"
              />
            </div>
          </div>

          {/* Данные карты */}
          <div className="form-section">
            <label className="section-label">💳 Данные карты (тестовые)</label>
            
            <div className="form-group">
              <label>Номер карты</label>
              <input
                type="text"
                value={cardNumber}
                onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                placeholder="0000 0000 0000 0000"
                maxLength="19"
                required
              />
            </div>

            <div className="form-group">
              <label>Владелец карты</label>
              <input
                type="text"
                value={cardHolder}
                onChange={(e) => setCardHolder(e.target.value)}
                placeholder="IVAN IVANOV"
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Срок действия</label>
                <input
                  type="text"
                  value={expiry}
                  onChange={(e) => setExpiry(formatExpiry(e.target.value))}
                  placeholder="MM/YY"
                  maxLength="5"
                  required
                />
              </div>

              <div className="form-group">
                <label>CVV</label>
                <input
                  type="text"
                  value={cvv}
                  onChange={(e) => setCvv(e.target.value.replace(/\D/g, '').slice(0, 3))}
                  placeholder="123"
                  maxLength="3"
                  required
                />
              </div>
            </div>
          </div>

          <button 
            type="submit" 
            className="btn-topup-submit"
            disabled={loading || !amount}
          >
            {loading ? '⏳ Обработка...' : `💰 Пополнить на ${amount || '0'} ₽`}
          </button>

          <div className="test-notice">
            <p>🔒 Это тестовая страница</p>
            <p>Данные карты не сохраняются и не проверяются</p>
            <p>Используйте любые тестовые данные</p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TopUpPage;