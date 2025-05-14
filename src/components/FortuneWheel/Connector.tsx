import React, { useState, useRef, useEffect } from 'react';
import Wheel from './View'; // Убедитесь, что путь правильный
import { Form } from 'antd';
import { segColors } from '@models/wheelData';
import { initialSegments, prizes } from '@models/wheelData';

const WheelConnector = () => {
    const [form] = Form.useForm();
    const [segments, setSegments] = useState(initialSegments);
    const [winningSegment, setWinningSegment] = useState(segments[3]?.value || '');
    const [isSpinning, setIsSpinning] = useState(false);
    const [currentWinner, setCurrentWinner] = useState(segments[3]?.value || '');
    const isStartedRef = useRef(false);

    useEffect(() => {
        const token = localStorage.getItem('token');
        const fetchSegments = async () => {
            try {
                const response = await fetch('http://try-your-luck.worktools.space/api/wheel-fortune/active-wheel', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                });

                if (!response.ok) {
                    throw new Error('Ошибка сети');
                }

                const data = await response.json();
                // Извлекаем сегменты из ответа сервера
                const sectors = data.sectors.map(sector => ({
                    value: sector.prize.name, // Используем имя приза как значение сегмента
                    ...sector
                }));

                setSegments(sectors);
                setWinningSegment(sectors[0]?.value || ''); // Устанавливаем начальный выигрышный сектор
            } catch (error) {
                console.error('Ошибка при получении секторов:', error);
                localStorage.setItem('availableSpins', '5');
            }
        };

        fetchSegments();
    }, []);

    const onFinished = (winner) => {
        setCurrentWinner(winner);

        const prizeWithDate = {
            name: winningSegment,
            date: new Date().toLocaleString()
        };

        const updatedPrizes = [...prizes, prizeWithDate];
        localStorage.setItem('prizes', JSON.stringify(updatedPrizes));

        setIsSpinning(false);
        isStartedRef.current = false;
    };

    const spin = () => {
        isStartedRef.current = true;
        setIsSpinning(true);
    };

    const stop = () => {
        isStartedRef.current = false;
        setIsSpinning(false);
    };

    return (
        <div>
            <Wheel
                segments={segments.map(segment => segment.value)}
                segColors={segColors}
                winningSegment={winningSegment}
                onFinished={onFinished}
                primaryColor="black"
                contrastColor="white"
                buttonText="Вращать"
                isOnlyOnce={false}
                size={250}
                upDuration={100}
                downDuration={800}
                fontFamily="Arial"
                isSpinning={isSpinning}
                spin={spin}
                stop={stop}
                isStarted={isStartedRef.current}
            />
        </div>
    );
};

export default WheelConnector;
