import React, { useState } from 'react';
import View from './View'; // Убедитесь, что путь правильный
import { Form } from 'antd';

const Connector = () => {
    const [registrationSuccess, setRegistrationSuccess] = useState(false);
    const [registrationError, setRegistrationError] = useState('');
    const [form] = Form.useForm();

    const handleRegistration = async (values) => {
        //console.log('Регистрация:', values);
        try {
            const response = await fetch('http://try-your-luck.worktools.space/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    username: values.login,
                    password: values.password,
                    surname: values.surname,
                    name: values.name,
                    patronymic: values.patronymic,
                }),
            });
            //console.log('Ответ сервера:', response);
            if (!response.ok) {
                const errorData = await response.json();
                //console.log('Ответ сервера:', response.status);
                if (response.status === 422) {
                    setRegistrationError(errorData.message);
                }
                throw new Error('Ошибка сети');
            }
            const data = await response.json();
            
            setRegistrationSuccess(true);
            setRegistrationError('');
            form.resetFields();
        } catch (error) {
            console.error('Ошибка регистрации:', error);
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
