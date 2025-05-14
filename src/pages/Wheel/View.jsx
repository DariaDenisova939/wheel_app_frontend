import React, { useState, useRef, useEffect } from 'react';
import { Typography, Layout, Modal, Button } from 'antd';
import FortuneWheelComponent from '@components/FortuneWheel';
import GiftListComponent from '@components/GiftList';
import SpinCounterComponent from '@components/SpinCounter/View';
import WinnerModalComponent from '@components/Modal/View';
import { initialSegments, prizes } from '@models/wheelData';
import { segColors } from '@models/wheelData';
import RegistrationForm from '@components/Registration';
import LoginForm from '@components/Login';
import Logout from '@components/Logout';
import { UserAddOutlined } from '@ant-design/icons'; // Импортируем иконку

import { LoginOutlined } from '@ant-design/icons'; // Импортируем иконку

const { Title } = Typography;
const { Content } = Layout;

const AppController = () => {
  const [segments, setSegments] = useState(initialSegments);
  const [winningSegment, setWinningSegment] = useState(segments[3].value);
  const [availableSpins, setAvailableSpins] = useState(localStorage.getItem('availableSpins'));
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentWinner, setCurrentWinner] = useState(segments[3].value);
  const [isSpinning, setIsSpinning] = useState(false);
  const [isGiftsVisible, setIsGiftsVisible] = useState(false);
  const isStartedRef = useRef(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginSuccess, setLoginSuccess] = useState(false);

  // Состояния для модальных окон
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isRegistrationModalOpen, setIsRegistrationModalOpen] = useState(false);

    useEffect(() => {
    const token = localStorage.getItem('token');
    setIsAuthenticated(!!token);
  }, []);

  useEffect(() => {
    // Запрос для получения секторов колеса
    const token = localStorage.getItem('token'); // Получаем токен из localStorage
    console.log(token)
    console.log('token')
    const fetchSegments = async () => {
      
    };

    fetchSegments();
  }, []);
  const handleLoginSuccess = () => {
    setIsAuthenticated(true); // Обновляем состояние после успешной авторизации
    setLoginSuccess(true);
  };
  const handleLogoutSuccess = () => {
    setIsAuthenticated(false); // Обновляем состояние после успешного выхода
  };
  const onFinished = (winner) => {
    setCurrentWinner(winner);
    setIsModalOpen(true);

    const prizeWithDate = {
      name: winningSegment,
      date: new Date().toLocaleString()
    };

    const updatedPrizes = [...prizes, prizeWithDate];
    localStorage.setItem('prizes', JSON.stringify(updatedPrizes));

    setIsSpinning(false);
    isStartedRef.current = false;
  };

  

  const toggleGiftsVisibility = () => {
    setIsGiftsVisible(prevState => !prevState);
  };

  const spin = () => {
    isStartedRef.current = true;
    setIsSpinning(true);
  };

  const stop = () => {
    isStartedRef.current = false;
    setIsSpinning(false);
  };

  // Обработчики для модальных окон
const showLoginModal = () => {
    setIsLoginModalOpen(true);
    setLoginSuccess(false); // Сбрасываем состояние успешной авторизации при открытии модального окна
  };
  const handleLoginModalClose = () => setIsLoginModalOpen(false);

  const showRegistrationModal = () => setIsRegistrationModalOpen(true);
  const handleRegistrationModalClose = () => setIsRegistrationModalOpen(false);

  return (
    <div>
      <Content style={{ display: 'flex', padding: '0px', alignItems: 'center' }}>
        {/* Кнопки авторизации и регистрации */}
        <div style={{ position: 'absolute', top: '15px', left: '70px', display: 'flex', gap: '10px' }}>
            {!isAuthenticated ? (
                <>
                    <Button type="primary" onClick={showLoginModal} icon={<LoginOutlined />}>
                        Вход
                    </Button>
                    <Button type="primary" onClick={showRegistrationModal} icon={<UserAddOutlined />}>
                        Регистрация
                    </Button>
                </>
            ) : (
                <Logout onLogoutSuccess={handleLogoutSuccess} />
            )}
        </div>

        {/* Компонент с количеством попыток */}
        <div style={{ flex: 1, textAlign: 'left', marginRight: '50px' }}>
          <SpinCounterComponent availableSpins={localStorage.getItem('availableSpins')} />
        </div>

        {/* Компонент колеса */}
        <div style={{ flex: 2, textAlign: 'center' }}>
          <Title level={1} style={{ color: '#ffcc00', textShadow: '2px 2px 4px #000' }}>Колесо фортуны</Title>
          <FortuneWheelComponent
            
          />
        </div>

        {/* Компонент с подарками */}
        <div style={{ flex: 1, marginLeft: '20px' }}>
          <GiftListComponent
            prizes={prizes}
            isGiftsVisible={isGiftsVisible}
            toggleGiftsVisibility={toggleGiftsVisibility}
          />
        </div>
      </Content>

      <WinnerModalComponent
        isModalOpen={isModalOpen}
        currentWinner={currentWinner}
        prizes={prizes}
        onClose={() => setIsModalOpen(false)}
      />

      {/* Модальное окно для авторизации */}
      <Modal
        title="Авторизация"
        visible={isLoginModalOpen}
        onCancel={handleLoginModalClose}
        footer={null}
      >
        <LoginForm
          onLoginSuccess={handleLoginSuccess}
          loginSuccess={loginSuccess}
          setLoginSuccess={setLoginSuccess}
        />
      </Modal>

      {/* Модальное окно для регистрации */}
      <Modal
        title="Регистрация"
        visible={isRegistrationModalOpen}
        onCancel={handleRegistrationModalClose}
        footer={null}
      >
        <RegistrationForm />
      </Modal>
    </div>
  );
};

export default AppController;
