import React from 'react';

interface ChatMessageProps {
  sender?: string;
  message: string | JSX.Element;
  avatarUrl?: string;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ sender, message, avatarUrl }) => (
  <div style={{ display: 'flex', alignItems: 'flex-start', marginBottom: 8 }}>
    {avatarUrl && (
      <img src={avatarUrl} alt={sender} style={{ width: 32, height: 32, borderRadius: '50%', marginRight: 8 }} />
    )}
    <div>
      {sender && <div style={{ fontWeight: 'bold', fontSize: 12 }}>{sender}</div>}
      <div style={{ background: '#f1f1f1', borderRadius: 8, padding: 8 }}>
        {typeof message === 'string' ? message : message}
      </div>
    </div>
  </div>
);

export default ChatMessage; 