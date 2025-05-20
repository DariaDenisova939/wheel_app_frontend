import React from 'react';
import LogoutButton from './View'; // Убедитесь, что путь правильный
import { message } from 'antd';

const LogoutConnector = ({ onLogoutSuccess }) => {
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
    const handleLogout = async (retry = true) => {
        const token = localStorage.getItem('token'); // Получаем токен из localStorage

        try {
            const response = await fetch('http://try-your-luck.worktools.space/api/auth/logout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${token}`, // Добавляем токен в заголовок
                },
            });

            if (response.status === 401 && retry) {
                const newToken = await refreshToken();
                if (newToken) {
                    // Retry the request with the new token
                    await handleLogout(false);
                }
                return;
            }
            
            const data = await response.json();
            //console.log('Ответ сервера:', data); // Выводим ответ сервера в консоль

            // Удаляем токен из localStorage после успешного выхода
            localStorage.removeItem('token');
            const event = new Event('tokenChanged');
            window.dispatchEvent(event);
            if (onLogoutSuccess) {
                onLogoutSuccess();
            }
            message.success('Вы успешно вышли из системы.');
        } catch (error) {
            //console.log("token")
            //console.log(token)
            console.error('Ошибка:', error);
            message.error('Ошибка при выходе. Попробуйте еще раз.');
        }
    };

    return (
        <div>
            <LogoutButton onLogout={handleLogout} />
        </div>
    );
};

export default LogoutConnector;
