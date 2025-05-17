import React from 'react';
import ChatMessage from './ChatMessage';

interface Message {
  sender?: string;
  message: string | JSX.Element;
  timestamp?: string;
  type: 'bot' | 'user';
}

interface ChatMessageListProps {
  messages: Message[];
}

const ChatMessageList: React.FC<ChatMessageListProps> = ({ messages }) => (
  <div className="chat-widget__messages">
    {messages.map((msg, idx) => (
      <ChatMessage key={idx} {...msg} />
    ))}
  </div>
);

export default ChatMessageList; 