import * as signalR from '@microsoft/signalr';

class SignalRService {
  constructor() {
    this.connection = null;
    this.onMessageCallback = null;
    this.onMessageSentCallback = null;
    this.onConversationUpdateCallback = null;
    this.onUserStatusCallback = null;
  }

  async startConnection(token, baseUrl = 'http://localhost:5000') {
    if (this.connection?.state === signalR.HubConnectionState.Connected) {
      return true;
    }

    this.connection = new signalR.HubConnectionBuilder()
      .withUrl(`${baseUrl}/chathub`, {
        accessTokenFactory: () => token
      })
      .withAutomaticReconnect([0, 2000, 5000, 10000, 30000])
      .build();

    // Входящие сообщения
    this.connection.on('ReceiveMessage', (message) => {
      console.log('📩 ReceiveMessage:', message);
      if (this.onMessageCallback) {
        this.onMessageCallback(message, false);
      }
    });

    // Подтверждение отправки
    this.connection.on('MessageSent', (message) => {
      console.log('✅ MessageSent:', message);
      if (this.onMessageSentCallback) {
        this.onMessageSentCallback(message, true);
      }
    });

    // Обновление диалога
    this.connection.on('ConversationUpdated', (message) => {
      console.log('🔄 ConversationUpdated:', message);
      if (this.onConversationUpdateCallback) {
        this.onConversationUpdateCallback(message);
      }
    });

    // Статус пользователя
    this.connection.on('UserStatusChanged', (userId, isOnline) => {
      console.log('🟢 UserStatusChanged:', userId, isOnline);
      if (this.onUserStatusCallback) {
        this.onUserStatusCallback(userId, isOnline);
      }
    });

    this.connection.onreconnecting((error) => {
      console.log('🔄 Reconnecting...', error);
    });

    this.connection.onreconnected((connectionId) => {
      console.log('✅ Reconnected:', connectionId);
    });

    this.connection.onclose((error) => {
      console.log('❌ Closed:', error);
    });

    try {
      await this.connection.start();
      console.log('✅ SignalR connected');
      return true;
    } catch (err) {
      console.error('❌ SignalR error:', err);
      setTimeout(() => this.startConnection(token, baseUrl), 5000);
      return false;
    }
  }

  async sendMessage(recipientId, content) {
    if (!this.connection || this.connection.state !== signalR.HubConnectionState.Connected) {
      throw new Error('SignalR not connected');
    }
    await this.connection.invoke('SendMessage', recipientId.toString(), content);
  }

  onMessage(callback) {
    this.onMessageCallback = callback;
  }

  onMessageSent(callback) {
    this.onMessageSentCallback = callback;
  }

  onConversationUpdate(callback) {
    this.onConversationUpdateCallback = callback;
  }

  onUserStatus(callback) {
    this.onUserStatusCallback = callback;
  }

  async stopConnection() {
    if (this.connection) {
      await this.connection.stop();
      this.connection = null;
      console.log('SignalR disconnected');
    }
  }

  isConnected() {
    return this.connection?.state === signalR.HubConnectionState.Connected;
  }
}

export default new SignalRService();