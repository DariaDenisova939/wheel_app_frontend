import React from 'react';
import { Form, Input, Button, Alert } from 'antd';
import { LoginOutlined } from '@ant-design/icons';

const View = ({ form, onFinish, loginError }) => {
    return (
        <div>
            {!localStorage.getItem('token') ? (
                <Form
                    form={form}
                    name="login"
                    onFinish={onFinish}
                    layout="vertical"
                >
                    <Form.Item
                        name="login"
                        label="Логин"
                        rules={[{ required: true, message: 'Пожалуйста, введите ваш логин!' }, { message: 'Введите корректный логин!' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="password"
                        label="Пароль"
                        rules={[{ required: true, message: 'Пожалуйста, введите пароль!' }]}
                    >
                        <Input.Password />
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit" icon={<LoginOutlined />}>
                            Войти
                        </Button>
                    </Form.Item>
                </Form>
            ) : (
                <Alert
                    message="Вы успешно авторизованы!"
                    type="success"
                    showIcon
                    style={{ marginTop: '10px' }}
                />
            )}
            {loginError && (
                <Alert
                    message="Неверный логин или пароль"
                    type="error"
                    showIcon
                    style={{ marginTop: '10px' }}
                />
            )}
        </div>
    );
};

export default View;
