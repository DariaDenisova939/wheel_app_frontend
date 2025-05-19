import React, { useState, useRef, useEffect } from 'react';
import View from './View'; // Убедитесь, что путь правильный
import { Form } from 'antd';
import { segColors, initialSegments } from '@models/wheelData'; // Импортируем initialSegments
import { useDispatch, useSelector } from 'react-redux'; // Импортируем useDispatch и useSelector
import { setPrizeType, setAvailableSpins } from '../SpinCounter/actions'; // Импортируем действие

export interface RootState {
  prizeType: string,
  availableSpins: number;
  // Добавьте другие свойства состояния, если они есть
}

const FortuneWheelComponent = ({ onFinished}) => {
    const [form] = Form.useForm();
    const [segments, setSegments] = useState([]);
    const [isSpinning, setIsSpinning] = useState(false);
    const [currentWinner, setCurrentWinner] = useState('');
    const [isDataLoaded, setIsDataLoaded] = useState(false); // Состояние для отслеживания загрузки данных
    const [isWinnerFetched, setIsWinnerFetched] = useState(false); // Состояние для отслеживания получения выигрышного сегмента
    const [token, setToken] = useState(localStorage.getItem('token'));
    const isStartedRef = useRef(false);
    const dispatch = useDispatch(); // Получаем доступ к dispatch
    const prizeType = useSelector((state: RootState) => state.prizeType);
    const availableSpins = useSelector((state: RootState) => state.availableSpins);
    
    const refreshToken = async () => {
    const refreshToken = localStorage.getItem('token'); // Исправлено на 'refreshToken'

    if (!refreshToken) {
        throw new Error('No refresh token available');
    }

    try {
        const response = await fetch('http://try-your-luck.worktools.space/api/auth/refresh', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${refreshToken}`

            },
        });

        if (response.status === 401) {
            localStorage.removeItem('token')
            return;
        }

        const data = await response.json();

        if (!data.access_token) {
            throw new Error('Invalid token data received');
        }

        localStorage.setItem('token', data.access_token);

        return data.access_token;
    } catch (error) {
        console.error('Error refreshing token:', error);
        throw error;
    }
};
    const fetchSegments = async (retry = true, currentToken) => {
        try {
            const response = await fetch('http://try-your-luck.worktools.space/api/wheel-fortune/active-wheel', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${currentToken}`,
                },
            });

            if (response.status === 401 && retry) {
                const newToken = await refreshToken();
                if (newToken) {
                    // Retry the request with the new token
                    await fetchSegments(false, currentToken);
                }
                return;
            }

            const data = await response.json();
            const sectors = data.sectors.map(sector => ({
                value: sector.prize.name,
                ...sector
            }));
            
            if (sectors)
            setSegments(sectors);
        else
            setSegments(initialSegments)
            setIsDataLoaded(true); // Устанавливаем, что данные загружены
            console.log("Сегменты получены");
        } catch (error) {
            console.error('Ошибка при получении секторов:', error);
            // Опционально, устанавливаем сегменты по умолчанию, если произошла ошибка

            setSegments(initialSegments);
            setIsDataLoaded(true);
        }
    };
    const fetchAvailableSpins = async (retry = true) => {
        const currentToken = localStorage.getItem('token');

        try {
            if (!currentToken) {
                dispatch(setAvailableSpins(0)); // Reset available spins if there is no token
                return;
            }
            const response = await fetch('http://try-your-luck.worktools.space/api/user/attempts', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${currentToken}`,
                },
            });

            if (response.status === 401 && retry) {
                const newToken = await refreshToken();
                if (newToken) {
                    // Retry the request with the new token
                    await fetchAvailableSpins(false);
                }
                return;
            }

            const data = await response.json();
            console.log('Ответ сервера:', data);
            console.log('Получены попытки');

            // Dispatch the action to set available spins
            dispatch(setAvailableSpins(data.attempts));
        } catch (error) {
            console.error('Ошибка:', error);
        }
    };
    const fetchWinningSegment = async (retry = true) => {
        try {
            const currentToken = localStorage.getItem('token');
            const response = await fetch('http://try-your-luck.worktools.space/api/wheel-fortune/win-sector', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${currentToken}`,
                },
            });

            if (response.status === 401 && retry) {
                const newToken = await refreshToken();
                if (newToken) {
                    // Retry the request with the new token
                    await fetchWinningSegment(false);
                }
                return;
            }
            const data = await response.json();
            setCurrentWinner(data.prize.name);
            setIsWinnerFetched(true); // Устанавливаем, что выигрышный сегмент получен
            console.log('Выигрышный сегмент:', data);
            dispatch(setPrizeType(data.prize_type));
            fetchAvailableSpins()
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
        fetchWinningSegment(); // Получаем выигрышный сегмент перед началом вращения
        isStartedRef.current = true;
        setIsSpinning(true);
        console.log('spin');
    };

    const stop = () => {
        isStartedRef.current = false;
        setIsSpinning(false);
    };

    useEffect(() => {
        const handleTokenChange = () => {
            const currentToken = localStorage.getItem('token');
            if (currentToken !== token) {
                setToken(currentToken);
                if (currentToken) {
                    fetchSegments(false, currentToken);
                    fetchAvailableSpins()
                } else {
                    setSegments(initialSegments); // Используем сегменты по умолчанию, если токена нет
                    setIsDataLoaded(true);
                }
            }
        };

        // Listen for custom token change event
        window.addEventListener('tokenChanged', handleTokenChange);

        // Initial check
        if (token) {
            fetchSegments(false, token);
            fetchAvailableSpins()
        } else {
            setSegments(initialSegments); // Используем сегменты по умолчанию, если токена нет
            setIsDataLoaded(true);
            dispatch(setAvailableSpins(0));
        }

        return () => {
            window.removeEventListener('tokenChanged', handleTokenChange);
        };
    }, [token]);

    // Do not render the Wheel component until segments are obtained
    if (!isDataLoaded) {
        return <div>Загрузка...</div>;
    }

    return (
        <div>
            <View
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
