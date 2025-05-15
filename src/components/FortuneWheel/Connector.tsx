import React, { useState, useRef, useEffect } from 'react';
import Wheel from './View'; // Ensure the path is correct
import { Form } from 'antd';
import { segColors, initialSegments } from '@models/wheelData'; // Import initialSegments
import { useDispatch } from 'react-redux'; // Import useDispatch
import { setPrizeType } from '../SpinCounter/actions'; // Import the action

const FortuneWheelComponent = ({ onFinished, winningSegment }) => {
    const [form] = Form.useForm();
    const [segments, setSegments] = useState([]);
    const [isSpinning, setIsSpinning] = useState(false);
    const [currentWinner, setCurrentWinner] = useState('');
    const [isDataLoaded, setIsDataLoaded] = useState(false); // State to track data loading
    const [isWinnerFetched, setIsWinnerFetched] = useState(false); // State to track fetching the winning segment
    const isStartedRef = useRef(false);
    const dispatch = useDispatch(); // Get access to dispatch

    useEffect(() => {
        const fetchData = async () => {
            await fetchSegments();
            setIsDataLoaded(true); // Set that data is loaded
        };
        fetchData();
    }, []);

    const fetchSegments = async () => {
        const token = localStorage.getItem('token');
        try {
            if (!token) {
                // If there's no token, use the default segments
                setSegments(initialSegments);
                return;
            }

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
            const sectors = data.sectors.map(sector => ({
                value: sector.prize.name,
                ...sector
            }));

            setSegments(sectors);
            console.log(data);
        } catch (error) {
            console.error('Ошибка при получении секторов:', error);
            // Optionally, set default segments if there's an error
            setSegments(initialSegments);
        }
    };

    const fetchWinningSegment = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://try-your-luck.worktools.space/api/wheel-fortune/win-sector', {
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
            setCurrentWinner(data.prize.name);
            setIsWinnerFetched(true); // Set that the winning segment is obtained
            console.log('Выигрышный сегмент:', data.prize_type);
            dispatch(setPrizeType(data.prize_type));
        } catch (error) {
            console.error('Ошибка при получении выигрышного сегмента:', error);
        }
    };

    const handleFinished = (winner) => {
        setCurrentWinner(winner);
        if (onFinished) {
            onFinished(winner);
        }
    };

    const spin = () => {
        fetchWinningSegment(); // Fetch the winning segment before starting the spin
        isStartedRef.current = true;
        setIsSpinning(true);
        console.log('spin');
    };

    const stop = () => {
        isStartedRef.current = false;
        setIsSpinning(false);
    };

    // Do not render the Wheel component until segments are obtained
    if (!isDataLoaded) {
        return <div>Загрузка...</div>;
    }

    return (
        <div>
            <Wheel
                segments={segments.map(segment => segment.value)}
                segColors={segColors}
                winningSegment={currentWinner}
                onFinished={handleFinished}
                primaryColor="black"
                contrastColor="white"
                buttonText="Вращать"
                isOnlyOnce={false}
                size={250}
                upDuration={100}
                downDuration={800}
                fontFamily="Arial"
                isSpinning={isSpinning}
                spin_view={spin}
                stop={stop}
                isStarted={isStartedRef.current}
            />
        </div>
    );
};

export default FortuneWheelComponent;
