import React from 'react';
import { Form, Input, Button, Alert } from 'antd';
import { LoginOutlined } from '@ant-design/icons';

const View = ({ form, onFinish, loginError }) => {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            {localStorage.getItem('token') && (
                <div style={{ position: 'fixed', top: '-10px', width: '100%' }}>
                    <Alert
                        message="Вы успешно авторизованы!"
                        type="success"
                        showIcon
                        style={{ margin: '100px' }}
                    />
                </div>
            )}
            <div style={{ width: '100%', maxWidth: '400px', marginTop: localStorage.getItem('token') ? '70px' : 0 }}>
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
                ) : null}
                {loginError && (
                    <Alert
                        message="Неверный логин или пароль"
                        type="error"
                        showIcon
                    />
                )}
            </div>
        </div>
    );
};

export default View;
