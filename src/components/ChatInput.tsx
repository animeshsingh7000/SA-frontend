import React from 'react';

interface ChatInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSend: () => void;
  onAttach: () => void;
  disabled?: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({ value, onChange, onSend, onAttach, disabled }) => (
  <div className="chat-widget__input-area">
    <input
      type="text"
      placeholder="Write a message"
      value={value}
      onChange={onChange}
      aria-label="Message input"
      disabled={disabled}
    />
    <button className="attach" aria-label="Attach file" onClick={onAttach} disabled={disabled}>&#128206;</button>
    <button className="send" aria-label="Send message" onClick={onSend} disabled={disabled || !value.trim()}>&#10148;</button>
  </div>
);

export default ChatInput; 