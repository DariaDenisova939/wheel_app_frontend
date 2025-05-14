import React from 'react';
import { Button } from 'antd';
import { LogoutOutlined } from '@ant-design/icons'; // Импортируем иконку

const LogoutButton = ({ onLogout }) => {
    return (
        <Button
            type="primary" danger
            onClick={onLogout}
            icon={<LogoutOutlined />}
        >
            Выйти
        </Button>
    );
};

export default LogoutButton;
