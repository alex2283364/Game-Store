import * as signalR from '@microsoft/signalr';

class SignalRService {
    constructor() {
        this.connection = null;
        this.onMessageCallback = null;
        this.onUserStatusCallback = null;
        this.onGroupMessageCallback = null;
    }

    async startConnection(token, baseUrl = 'http://localhost:5000') {
        if (this.connection?.state === signalR.HubConnectionState.Connected) {
            return;
        }

        this.connection = new signalR.HubConnectionBuilder()
            .withUrl(`${baseUrl}/chathub`, {
                accessTokenFactory: () => token
            })
            .withAutomaticReconnect([0, 2000, 5000, 10000, 30000])
            .configureLogging(signalR.LogLevel.Information)
            .build();

        // Подписка на события
        this.connection.on('ReceiveMessage', (message) => {
            if (this.onMessageCallback) {
                this.onMessageCallback(message, false); // false = входящее
            }
        });

        this.connection.on('MessageSent', (message) => {
            if (this.onMessageCallback) {
                this.onMessageCallback(message, true); // true = исходящее
            }
        });

        this.connection.on('UserStatusChanged', (userId, isOnline) => {
            if (this.onUserStatusCallback) {
                this.onUserStatusCallback(userId, isOnline);
            }
        });

        this.connection.on('ReceiveGroupMessage', (message) => {
            if (this.onGroupMessageCallback) {
                this.onGroupMessageCallback(message);
            }
        });

        // Обработка ошибок переподключения
        this.connection.onreconnecting((error) => {
            console.log('SignalR reconnecting...', error);
        });

        this.connection.onreconnected((connectionId) => {
            console.log('SignalR reconnected:', connectionId);
        });

        this.connection.onclose((error) => {
            console.log('SignalR closed:', error);
        });

        try {
            await this.connection.start();
            console.log('✅ SignalR connected');
            return true;
        } catch (err) {
            console.error('❌ SignalR connection error:', err);
            setTimeout(() => this.startConnection(token, baseUrl), 5000);
            return false;
        }
    }

    // Отправка личного сообщения
    async sendMessage(recipientId, content) {
        if (!this.connection || this.connection.state !== signalR.HubConnectionState.Connected) {
            throw new Error('SignalR not connected');
        }
        await this.connection.invoke('SendMessage', recipientId.toString(), content);
    }

    // Отправка сообщения в группу
    async sendGroupMessage(groupId, content) {
        if (!this.connection) return;
        await this.connection.invoke('SendGroupMessage', groupId, content);
    }

    // Присоединение к группе
    async joinGroup(groupId) {
        if (!this.connection) return;
        await this.connection.invoke('JoinGroup', groupId);
    }

    // Выход из группы
    async leaveGroup(groupId) {
        if (!this.connection) return;
        await this.connection.invoke('LeaveGroup', groupId);
    }

    // Запрос статуса пользователя
    async getUserStatus(userId) {
        if (!this.connection) return;
        await this.connection.invoke('GetUserStatus', userId.toString());
    }

    // Колбэки
    onMessage(callback) {
        this.onMessageCallback = callback;
    }

    onUserStatus(callback) {
        this.onUserStatusCallback = callback;
    }

    onGroupMessage(callback) {
        this.onGroupMessageCallback = callback;
    }

    // Остановка соединения
    async stopConnection() {
        if (this.connection) {
            await this.connection.stop();
            this.connection = null;
            console.log('SignalR disconnected');
        }
    }

    // Проверка состояния
    isConnected() {
        return this.connection?.state === signalR.HubConnectionState.Connected;
    }
}

export default new SignalRService();