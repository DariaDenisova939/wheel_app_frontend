import React, { useState } from 'react';
import View from './View'; // Убедитесь, что путь правильный
import { Form } from 'antd';

const Connector = () => {
    const [registrationSuccess, setRegistrationSuccess] = useState(false);
    const [registrationError, setRegistrationError] = useState('');
    const [form] = Form.useForm();

    const handleRegistration = async (values) => {
        console.log('Регистрация:', values);
        try {
            const response = await fetch('http://try-your-luck.worktools.space/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: values.login,
                    password: values.password,
                    surname: values.surname,
                    name: values.name,
                    patronymic: values.patronymic,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                if (response.status === 400 && errorData.message.includes('password')) {
                    setRegistrationError('Слишком короткий пароль');
                } else {
                    setRegistrationError('Ошибка регистрации. Попробуйте еще раз.');
                }
                throw new Error('Ошибка сети');
            }

            const data = await response.json();
            console.log('Ответ сервера:', data);
            setRegistrationSuccess(true);
            setRegistrationError('');
            form.resetFields();
        } catch (error) {
            console.error('Ошибка регистрации:', error);
            setRegistrationError('Ошибка регистрации. Пароль должен содержать от 6 до 20 символов');
        }
    };

    return (
        <div>
            <View
                form={form}
                onFinish={handleRegistration}
                registrationSuccess={registrationSuccess}
                registrationError={registrationError}
            />
        </div>
    );
};

export default Connector;
