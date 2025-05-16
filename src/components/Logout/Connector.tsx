import React from 'react';
import LogoutButton from './View'; // Убедитесь, что путь правильный
import { message } from 'antd';

const LogoutConnector = ({ onLogoutSuccess }) => {
    const handleLogout = async () => {
        const token = localStorage.getItem('token'); // Получаем токен из localStorage

        try {
            const response = await fetch('http://try-your-luck.worktools.space/api/auth/logout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`, // Добавляем токен в заголовок
                },
            });

            if (!response.ok) {
                throw new Error('Ошибка сети');
            }

            const data = await response.json();
            console.log('Ответ сервера:', data); // Выводим ответ сервера в консоль

            // Удаляем токен из localStorage после успешного выхода
            localStorage.removeItem('token');
            const event = new Event('tokenChanged');
            window.dispatchEvent(event);
            if (onLogoutSuccess) {
                onLogoutSuccess();
            }
            message.success('Вы успешно вышли из системы.');
        } catch (error) {
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
