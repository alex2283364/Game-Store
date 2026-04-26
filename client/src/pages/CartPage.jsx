import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import './CartPage.css';

const CartPage = () => {
    const { user, updateUserBalance } = useAuth();
    const navigate = useNavigate();
    const [cart, setCart] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }
        loadCart();
    }, [user, navigate]);

    const loadCart = async () => {
        try {
            const response = await api.get('/cart');
            setCart(response.data);
        } catch (error) {
            console.error('Ошибка загрузки корзины:', error);
        } finally {
            setLoading(false);
        }
    };

    const removeFromCart = async (gameId) => {
        try {
            await api.delete(`/cart/remove/${gameId}`);
            loadCart();
            
            // Обновляем счётчик
            const event = new CustomEvent('cartUpdated');
            window.dispatchEvent(event);
        } catch (error) {
            alert(error.response?.data?.message || 'Ошибка удаления');
        }
    };

    const checkout = async () => {
        if (!cart || cart.items.length === 0) return;
        
        if (!confirm(`Оформить заказ на ${cart.totalPrice.toFixed(2)} ₽?`)) return;

        try {
            const response = await api.post('/cart/checkout');
            alert(response.data.message);
            updateUserBalance(response.data.newBalance);
            navigate('/profile');
        } catch (error) {
            alert(error.response?.data?.message || 'Ошибка оформления');
        }
    };

    if (loading) return <div className="loading">Загрузка...</div>;

    return (
        <div className="cart-page">
            <h1>🛒 Корзина</h1>
            
            {cart?.items?.length > 0 ? (
                <>
                    <div className="cart-items">
                        {cart.items.map(item => (
                            <div key={item.gameId} className="cart-item">
                                <h3>{item.title}</h3>
                                <span>{item.price.toFixed(2)} ₽</span>
                                <button onClick={() => removeFromCart(item.gameId)}>✕</button>
                            </div>
                        ))}
                    </div>
                    
                    <div className="cart-summary">
                        <p>Итого: <strong>{cart.totalPrice.toFixed(2)} ₽</strong></p>
                        <button className="btn-checkout" onClick={checkout}>
                            Оформить заказ
                        </button>
                    </div>
                </>
            ) : (
                <div className="cart-empty">
                    <p>Корзина пуста</p>
                    <button onClick={() => navigate('/store')}>Перейти в магазин</button>
                </div>
            )}
        </div>
    );
};

export default CartPage;