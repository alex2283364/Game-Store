import React from 'react';
import './MessageInput.css';

const MessageInput = ({ value, onChange, onSend, onKeyPress, disabled }) => {
    return (
        <div className="message-input">
            <textarea
                value={value}
                onChange={onChange}
                onKeyPress={onKeyPress}
                placeholder="Введите сообщение..."
                rows={1}
                disabled={disabled}
                className="message-textarea"
            />
            <button
                onClick={onSend}
                disabled={disabled || !value.trim()}
                className="send-button"
            >
                ➤
            </button>
        </div>
    );
};

export default MessageInput;