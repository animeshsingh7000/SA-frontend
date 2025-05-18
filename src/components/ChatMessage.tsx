import React from 'react';
import ReactMarkdown from 'react-markdown';

interface ChatMessageProps {
  sender?: string;
  message: string | JSX.Element;
  avatarUrl?: string;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ sender, message, avatarUrl }) => {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', marginBottom: 8 }}>
      {avatarUrl && (
        <img src={avatarUrl} alt={sender} style={{ width: 32, height: 32, borderRadius: '50%', marginRight: 8 }} />
      )}
      <div>
        {sender && <div style={{ fontWeight: 'bold', fontSize: 12 }}>{sender}</div>}
        <div>
          {typeof message === 'string' && sender === 'bot' ? (
            <ReactMarkdown>{message.replace(/^\s*```[\s\n]*/g, '').replace(/[\s\n]*```\s*$/g, '')}</ReactMarkdown>
          ) : typeof message === 'string' && sender === 'user' ? (
            <span><strong>User:</strong> {message}</span>
          ) : (
            message
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatMessage; 