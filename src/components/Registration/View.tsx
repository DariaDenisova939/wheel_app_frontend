import React from 'react';
import { Form, Input, Button, Alert } from 'antd';
import { UserAddOutlined } from '@ant-design/icons';

const View = ({ form, onFinish, registrationSuccess, registrationError }) => {
    return (
        <div>
            <Form
                form={form}
                name="registration"
                layout="vertical"
                onFinish={onFinish}
            >
                <Form.Item
                    name="surname"
                    label="Фамилия"
                    rules={[{ required: true, message: 'Пожалуйста, введите вашу фамилию!' }]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    name="name"
                    label="Имя"
                    rules={[{ required: true, message: 'Пожалуйста, введите ваше имя!' }]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    name="patronymic"
                    label="Отчество"
                    rules={[{ required: true, message: 'Пожалуйста, введите ваше отчество!' }]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    name="login"
                    label="Логин"
                    rules={[
                        { required: true, message: 'Пожалуйста, введите логин!' },
                        { min: 6, message: 'Логин должен содержать минимум 6 символов!' },
                        { max: 20, message: 'Логин должен содержать максимум 20 символов!' }
                    ]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    name="password"
                    label="Пароль"
                    rules={[
                        { required: true, message: 'Пожалуйста, введите пароль!' },
                        { min: 6, message: 'Пароль должен содержать минимум 6 символов!' },
                        { max: 20, message: 'Пароль должен содержать максимум 20 символов!' }
                    ]}
                >
                    <Input.Password />
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit" icon={<UserAddOutlined />}>
                        Зарегистрироваться
                    </Button>
                </Form.Item>
            </Form>
            {registrationSuccess && (
                <Alert
                    message="Успех!"
                    type="success"
                    showIcon
                    style={{ marginTop: '10px' }}
                />
            )}
            {registrationError && (
                <Alert
                    message={registrationError}
                    type="error"
                    showIcon
                    style={{ marginTop: '10px' }}
                />
            )}
        </div>
    );
};

export default View;
