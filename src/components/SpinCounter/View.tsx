import React, { useState, useEffect } from 'react';
import { Typography, Card } from 'antd';

const { Text } = Typography;

const SpinCounterComponent = ({ availableSpins }) => {
    const [spins, setSpins] = useState(localStorage.getItem('availableSpins'));

    useEffect(() => {
        setSpins(availableSpins);
    }, [availableSpins]); // Обновляем состояние при изменении пропса availableSpins

    return (
        <div style={{ textAlign: 'center', width: '350px', margin: '0 auto' }}>
            <Card
                style={{
                    backgroundColor: 'rgba(205, 205, 221, 0.27)', // Полупрозрачный фон
                    borderRadius: '50px', // Овальная форма
                    padding: '5px', // Отступы для создания овала
                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.85)', // Легкая тень
                    border: 'none', // Убираем границу
                    height: '100px', // Фиксированная высота
                }}
            >
                <Text style={{ fontSize: '24px', color: '#333', textShadow: '1px 1px 2px #000' }}>
                    Осталось вращений x{spins}
                </Text>
            </Card>
        </div>
    );
};

export default SpinCounterComponent;
