import React, { useState, useEffect } from 'react';
import LoginForm from './View'; // Ensure the path is correct
import { Form } from 'antd';

const LoginConnector = ({ onLoginSuccess }) => {
    const [loginError, setLoginError] = useState(false);
    const [form] = Form.useForm();

    const onFinish = async (values) => {
        //console.log('Авторизация:', values);
        try {
            const response = await fetch('http://try-your-luck.worktools.space/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    username: values.login,
                    password: values.password,
                }),
            });

            if (!response.ok) {
                throw new Error('Неверный логин или пароль');
            }

            const data = await response.json();
            //console.log('Ответ сервера:', data);

            if (data.access_token) {
                // Store the access token
                localStorage.setItem('token', data.access_token);
                const event = new Event('tokenChanged');
            window.dispatchEvent(event);
                // Store the refresh token if it exists
                if (data.refresh_token) {
                    localStorage.setItem('refreshToken', data.refresh_token);
                }

                setLoginError(false);
                form.resetFields();
                if (onLoginSuccess) {
                    onLoginSuccess();
                }
            } else {
                console.log('Токен не получен.');
            }
        } catch (error) {
            console.error('Ошибка авторизации:', error);
            setLoginError(true);
        }
    };

    return (
        <div>
            <LoginForm
                form={form}
                onFinish={onFinish}
                loginError={loginError}
            />
        </div>
    );
};

export default LoginConnector;
