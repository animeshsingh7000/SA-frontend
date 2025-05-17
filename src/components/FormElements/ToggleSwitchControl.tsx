import React, { useState } from 'react';

interface ToggleSwitchProps {
  name: string;
  label: string;
  checked: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const ToggleSwitchControl: React.FC<ToggleSwitchProps> = ({ name, label, checked, onChange }) => {
  return (
    <div style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
      <input
        name={name}
        type="checkbox"
        checked={checked}
        onChange={onChange}
        style={{ display: 'none' }} // Hide the default checkbox
      />
      <div
        className={`slider ${checked ? 'on' : 'off'}`}
        style={{
          width: '50px',
          height: '24px',
          backgroundColor: checked ? '#4CAF50' : '#ccc',
          borderRadius: '50px',
          position: 'relative',
          transition: 'background-color 0.2s',
        }}
      >
        <div
          className="toggle-circle"
          style={{
            width: '22px',
            height: '22px',
            backgroundColor: 'white',
            borderRadius: '50%',
            position: 'absolute',
            top: '1px',
            left: checked ? '26px' : '2px',
            transition: 'left 0.2s',
          }}
        />
      </div>
      <label style={{ marginLeft: '10px' }}>{label}</label>
    </div>
  );
};

export default ToggleSwitchControl;
