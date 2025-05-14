import React from 'react';

interface ControlButtonsProps {
  onSpin: () => void;
  onStop: () => void;
  isStarted: boolean;
}

const ControlButtons: React.FC<ControlButtonsProps> = ({ onSpin, onStop, isStarted }) => {
  return (
    <div style={{ textAlign: 'center' }}>
      <button className='button' onClick={onSpin} disabled={isStarted}>Крутить</button>
      <button className='button' onClick={onStop}>Стоп</button>
    </div>
  );
};

export default ControlButtons;
