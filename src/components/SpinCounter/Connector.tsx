import React from 'react';
import { useSelector } from 'react-redux'; // Import useSelector
import SpinCounterComponent from './View'; // Import the component for displaying spins

export interface RootState {
  availableSpins: number;
  // Добавьте другие свойства состояния, если они есть
}

const SpinCounter = () => {
    // Получаем availableSpins из Redux
    const availableSpins = useSelector((state: RootState) => state.availableSpins);

    return (
        <div>
            <SpinCounterComponent availableSpins={availableSpins} />
        </div>
    );
};

export default SpinCounter;
