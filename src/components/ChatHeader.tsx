import React from 'react';
import attacheLogo from '../assets/images/attache-logo.svg';

interface ChatHeaderProps {
  onClose: () => void;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({ onClose }) => (
  <div
    className="chat-widget__header"
    style={{
      background: '#fff',
      borderBottom: '1px solid #e0e0e0',
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'flex-start',
      padding: '8px 20px',
      minHeight: 56,
    }}
  >
    <img
      src={attacheLogo}
      alt="Attache Logo"
      style={{ height: 40, width: 'auto', background: '#fff', borderRadius: 8, padding: 4 }}
    />
  </div>
);

export default ChatHeader; 