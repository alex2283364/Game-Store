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
            console.log('✅ SignalR уже подключён');
            return true;
        }

        console.log('🔌 Подключение к SignalR с токеном...');

        // 🔥 ВАЖНО: Токен передаём через accessTokenFactory
        this.connection = new signalR.HubConnectionBuilder()
            .withUrl(`${baseUrl}/chathub`, {
                accessTokenFactory: () => {
                    console.log('🔑 Передаю токен:', token ? 'есть' : 'нет');
                    return token;
                },
                // 🔥 Используем WebSockets + LongPolling
                transport: signalR.HttpTransportType.WebSockets | 
                          signalR.HttpTransportType.LongPolling,
                skipNegotiation: false
            })
            .withAutomaticReconnect([0, 2000, 5000])
            .configureLogging(signalR.LogLevel.Information)
            .build();

        this.connection.on('ReceiveMessage', (message) => {
            console.log('📩 ReceiveMessage:', message);
            if (this.onMessageCallback) {
                this.onMessageCallback(message, false);
            }
        });

        this.connection.on('MessageSent', (message) => {
            console.log('✅ MessageSent:', message);
            if (this.onMessageSentCallback) {
                this.onMessageSentCallback(message, true);
            }
        });

        this.connection.on('ConversationUpdated', () => {
            console.log('🔄 ConversationUpdated');
            if (this.onConversationUpdateCallback) {
                this.onConversationUpdateCallback();
            }
        });

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
            console.log('✅ SignalR connected successfully');
            return true;
        } catch (err) {
            console.error('❌ SignalR connection error:', err);
            console.error('Error details:', err.message);
            
            // Пробуем переподключиться через 3 секунды
            setTimeout(() => {
                console.log('🔄 Повторная попытка подключения...');
                this.startConnection(token, baseUrl);
            }, 3000);
            
            return false;
        }
    }

    async sendMessage(recipientId, content) {
        if (!this.connection || this.connection.state !== signalR.HubConnectionState.Connected) {
            throw new Error('SignalR not connected');
        }
        console.log('📤 Отправка сообщения:', recipientId, content);
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