import React, { useEffect } from 'react';
import { message } from 'antd';
import { useDispatch } from 'react-redux'; // Import useDispatch
import { setAvailableSpins } from './actions'; // Import the action
import SpinCounterComponent from './View'; // Import the component for displaying spins

const SpinCounter = ({ onFetchAvailableSpins }) => {
    const dispatch = useDispatch(); // Get access to dispatch

    const fetchAvailableSpins = async () => {
        const token = localStorage.getItem('token');

        try {
            if (!token) {
                return;
            }
            const response = await fetch('http://try-your-luck.worktools.space/api/user/attempts', {
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
            console.log('Ответ сервера:', data);
            message.success('Получены попытки');

            // Dispatch the action to set available spins
            dispatch(setAvailableSpins(data.attempts));

        } catch (error) {
            console.error('Ошибка:', error);
            message.error('Ошибка. Попробуйте еще раз.');
        }
    };

    useEffect(() => {
        fetchAvailableSpins();
    }, []);

    // Pass fetchAvailableSpins to the parent component
    useEffect(() => {
        if (onFetchAvailableSpins) {
            onFetchAvailableSpins(fetchAvailableSpins);
        }
    }, [onFetchAvailableSpins]);

    return (
        <div>
            <SpinCounterComponent />
        </div>
    );
};

export default SpinCounter;
