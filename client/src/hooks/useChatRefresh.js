import { useEffect, useRef } from 'react';
import signalrService from '../services/signalrService';

/**
 * Хук для авто-обновления чата при новых сообщениях
 * @param {Function} onNewMessage - Callback при новом сообщении
 * @param {number} currentUserId - ID текущего пользователя
 * @param {number} selectedUserId - ID выбранного собеседника
 */
export const useChatRefresh = (onNewMessage, currentUserId, selectedUserId) => {
  const messageHandlerRef = useRef(null);

  useEffect(() => {
    if (!currentUserId) return;

    // Обработчик входящих сообщений
    const handleIncomingMessage = (message) => {
      console.log('🔔 [useChatRefresh] Новое сообщение:', message);
      
      const senderId = parseInt(message.senderId);
      const recipientId = parseInt(message.recipientId);
      const myId = parseInt(currentUserId);
      
      // Проверяем, относится ли сообщение к текущему чату
      const isInCurrentChat = selectedUserId && (
        (senderId === selectedUserId && recipientId === myId) ||
        (senderId === myId && recipientId === selectedUserId)
      );
      
      if (isInCurrentChat) {
        console.log('✅ [useChatRefresh] Сообщение в текущем чате, обновляем...');
        if (onNewMessage) {
          onNewMessage(message);
        }
      } else {
        console.log('📬 [useChatRefresh] Сообщение из другого чата');
      }
    };

    // Подписываемся на события
    signalrService.onMessage(handleIncomingMessage);
    
    messageHandlerRef.current = handleIncomingMessage;

    // Очистка при размонтировании
    return () => {
      if (messageHandlerRef.current) {
        console.log('🔕 [useChatRefresh] Отписка от событий');
      }
    };
  }, [currentUserId, selectedUserId, onNewMessage]);

  // Функция для принудительного обновления
  const forceRefresh = () => {
    console.log('🔄 [useChatRefresh] Принудительное обновление');
    window.location.reload();
  };

  return { forceRefresh };
};