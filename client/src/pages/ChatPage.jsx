import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import signalrService from '../services/signalrService';
import UserSearch from '../components/Chat/UserSearch';
import MessageBubble from '../components/Chat/MessageBubble';
import MessageInput from '../components/Chat/MessageInput';
import './ChatPage.css';

const ChatPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [conversations, setConversations] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [selectedUserName, setSelectedUserName] = useState('');
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [onlineUsers, setOnlineUsers] = useState(new Set());
  const [showUserSearch, setShowUserSearch] = useState(false);
  
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);

  // 🔥 СКРОЛЛ ВНИЗ
  const scrollToBottom = () => {
    setTimeout(() => {
      if (messagesEndRef.current) {
        messagesEndRef.current.scrollIntoView({ behavior: 'auto' });
        console.log('📜 Скролл к последнему сообщению');
      }
    }, 100);
  };

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    loadConversations();
    connectSignalR();
    
    return () => {
      signalrService.stopConnection();
    };
  }, [user, navigate]);

  // 🔥 Прокрутка при изменении сообщений
  useEffect(() => {
    if (messages.length > 0 && selectedUserId) {
      scrollToBottom();
    }
  }, [messages, selectedUserId]);

  const loadConversations = async () => {
    try {
      const response = await api.get('/chat/conversations');
      setConversations(response.data);
      
      const online = new Set(response.data.filter(c => c.isOnline).map(c => c.userId));
      setOnlineUsers(online);
    } catch (error) {
      console.error('Error loading conversations:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadMessages = async (userId, userName) => {
    try {
      console.log('📚 Загрузка сообщений для:', userId);
      const response = await api.get(`/chat/messages/${userId}`);
      
      const messagesWithOwnFlag = response.data.map(msg => ({
        ...msg,
        isOwn: parseInt(msg.senderId) === parseInt(user?.id)
      }));
      
      console.log('📚 Загружено сообщений:', messagesWithOwnFlag.length);
      
      setMessages(messagesWithOwnFlag);
      setSelectedUserId(userId);
      setSelectedUserName(userName);
      
      setTimeout(() => {
        scrollToBottom();
      }, 150);
      
      await api.post(`/chat/mark-read/${userId}`);
    } catch (error) {
      console.error('Error loading messages:', error);
    }
  };

  const connectSignalR = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    const connected = await signalrService.startConnection(token);
    
    if (connected) {
      signalrService.onMessage((message) => {
        console.log('📨 Новое сообщение:', message);
        
        const senderId = parseInt(message.senderId);
        const recipientId = parseInt(message.recipientId);
        const myId = parseInt(user?.id);
        
        const isInCurrentChat = selectedUserId !== null && (
          (senderId === selectedUserId && recipientId === myId) ||
          (senderId === myId && recipientId === selectedUserId)
        );
        
        if (isInCurrentChat) {
          setMessages(prev => {
            const exists = prev.some(m => m.id === message.id);
            if (exists) return prev;
            
            const isOwn = senderId === myId;
            
            return [...prev, {
              ...message,
              isOwn: isOwn,
              isRead: isOwn ? message.isRead : true
            }];
          });
          
          setTimeout(() => {
            scrollToBottom();
          }, 100);
          
          if (senderId !== myId && selectedUserId) {
            api.post(`/chat/mark-read/${selectedUserId}`).catch(console.error);
          }
        }
        
        loadConversations();
      });

      signalrService.onMessageSent((message) => {
        console.log('✅ Сообщение отправлено:', message);
        
        setMessages(prev => {
          const tempIndex = prev.findIndex(m => 
            typeof m.id === 'string' && 
            m.id.startsWith('temp-') && 
            m.content === message.content
          );
          
          if (tempIndex === -1) {
            return [...prev, {
              ...message,
              isOwn: true,
              isRead: message.isRead
            }];
          }
          
          const updated = [...prev];
          updated[tempIndex] = {
            ...message,
            isOwn: true,
            isRead: message.isRead
          };
          return updated;
        });
        
        setTimeout(() => {
          scrollToBottom();
        }, 100);
      });

      signalrService.onConversationUpdate(() => {
        loadConversations();
      });

      signalrService.onUserStatus((userId, isOnline) => {
        setOnlineUsers(prev => {
          const next = new Set(prev);
          if (isOnline) next.add(parseInt(userId));
          else next.delete(parseInt(userId));
          return next;
        });
      });
    }
  };

  const selectConversation = async (conversation) => {
    setSelectedUserId(conversation.userId);
    setSelectedUserName(conversation.username);
    await loadMessages(conversation.userId, conversation.username);
    setShowUserSearch(false);
  };

  const startNewConversation = async (foundUser) => {
    setSelectedUserId(foundUser.id);
    setSelectedUserName(foundUser.username);
    await loadMessages(foundUser.id, foundUser.username);
    setShowUserSearch(false);
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedUserId) return;

    const messageContent = newMessage.trim();
    
    const tempMessage = {
      id: `temp-${Date.now()}`,
      senderId: user?.id,
      recipientId: selectedUserId,
      content: messageContent,
      sentAt: new Date().toISOString(),
      isRead: false,
      isOwn: true
    };
    
    setMessages(prev => [...prev, tempMessage]);
    setNewMessage('');
    
    setTimeout(() => {
      scrollToBottom();
    }, 100);

    try {
      await signalrService.sendMessage(selectedUserId, messageContent);
    } catch (error) {
      console.error('Ошибка отправки:', error);
      setMessages(prev => prev.filter(m => m.id !== tempMessage.id));
      setNewMessage(messageContent);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
  };

  if (!user) return null;

  return (
    <div className="chat-page">
      <div className="conversations-panel">
        <div className="conversations-header">
          <h2>💬 Сообщения</h2>
          <span className="online-indicator">🟢 {onlineUsers.size} онлайн</span>
        </div>

        <div className="new-chat-button-container">
          {!showUserSearch ? (
            <button className="btn-new-chat" onClick={() => setShowUserSearch(true)}>
              ✏️ Новый чат
            </button>
          ) : (
            <button className="btn-cancel-search" onClick={() => setShowUserSearch(false)}>
              ✕ Отмена
            </button>
          )}
        </div>
        
        {showUserSearch && (
          <div className="user-search-container">
            <UserSearch onSelectUser={startNewConversation} currentUserId={user?.id} />
          </div>
        )}
        
        {!showUserSearch && (
          <>
            {loading ? (
              <div className="loader">Загрузка...</div>
            ) : conversations.length > 0 ? (
              <div className="conversations-list">
                {conversations.map(conv => (
                  <div
                    key={conv.userId}
                    className={`conversation-item ${selectedUserId === conv.userId ? 'active' : ''}`}
                    onClick={() => selectConversation(conv)}
                  >
                    <div className={`avatar ${onlineUsers.has(conv.userId) ? 'online' : 'offline'}`}>
                      {conv.avatar ? (
                        <img src={conv.avatar} alt={conv.username} />
                      ) : (
                        conv.username.charAt(0).toUpperCase()
                      )}
                    </div>
                    <div className="conversation-info">
                      <div className="conversation-header">
                        <span className="username">{conv.username}</span>
                        {conv.unreadCount > 0 && (
                          <span className="unread-badge">{conv.unreadCount}</span>
                        )}
                      </div>
                      <div className="last-message">
                        {conv.lastMessage?.substring(0, 30)}
                        {conv.lastMessage?.length > 30 && '...'}
                      </div>
                      <div className="message-time">
                        {conv.lastMessageAt && formatTime(conv.lastMessageAt)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="no-conversations">
                <p>😕 Нет диалогов</p>
                <p className="hint">Нажмите "Новый чат" для поиска</p>
              </div>
            )}
          </>
        )}
      </div>

      <div className="messages-panel">
        {selectedUserId ? (
          <>
            <div className="chat-header">
              <div className={`avatar ${onlineUsers.has(selectedUserId) ? 'online' : 'offline'}`}>
                {conversations.find(c => c.userId === selectedUserId)?.avatar ? (
                  <img 
                    src={conversations.find(c => c.userId === selectedUserId)?.avatar} 
                    alt={selectedUserName} 
                  />
                ) : (
                  selectedUserName.charAt(0).toUpperCase()
                )}
              </div>
              <div className="chat-info">
                <h3>{selectedUserName}</h3>
                <span className={`status ${onlineUsers.has(selectedUserId) ? 'online' : 'offline'}`}>
                  {onlineUsers.has(selectedUserId) ? 'В сети' : 'Был(а) недавно'}
                </span>
              </div>
            </div>

            <div className="messages-container" ref={messagesContainerRef}>
              {messages.map((msg) => (
                <MessageBubble
                  key={msg.id}
                  message={msg.content}
                  isOwn={msg.isOwn}
                  timestamp={formatTime(msg.sentAt)}
                  isRead={msg.isRead}
                />
              ))}
              <div ref={messagesEndRef} />
            </div>

            <MessageInput
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onSend={handleSendMessage}
              onKeyPress={handleKeyPress}
              disabled={!signalrService.isConnected()}
            />
          </>
        ) : (
          <div className="no-chat-selected">
            <div className="chat-icon">💬</div>
            <p>Выберите диалог или начните новый чат</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatPage;