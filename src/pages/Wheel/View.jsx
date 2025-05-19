import React, { useState, useRef, useEffect } from 'react';
import { Typography, Layout, Modal, Button, Alert } from 'antd';
import FortuneWheelComponent from '@components/FortuneWheel';
import GiftListComponent from '@components/GiftList';
import SpinCounter from '@components/SpinCounter';
import WinnerModalComponent from '@components/Modal/View';
import { initialSegments, prizes } from '@models/wheelData';
import { segColors } from '@models/wheelData';
import RegistrationForm from '@components/Registration';
import LoginForm from '@components/Login';
import Logout from '@components/Logout';
import { UserAddOutlined, LoginOutlined } from '@ant-design/icons';
import { Provider } from 'react-redux';
import store from '../../components/store';

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
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

  // States for modal windows
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isRegistrationModalOpen, setIsRegistrationModalOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsAuthenticated(!!token);
    if (token) {
      fetchAvailableSpins();
    }
  }, []);

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
    setIsLoginModalOpen(false); // Close the login modal
    setAlertMessage('Авторизация прошла успешно!');
    setShowSuccessAlert(true);
    setTimeout(() => setShowSuccessAlert(false), 3000); // Hide alert after 3 seconds
    fetchAvailableSpins();
  };

  const handleRegistrationSuccess = () => {
    setIsRegistrationModalOpen(false); // Close the registration modal
    setAlertMessage('Регистрация прошла успешно!');
    setShowSuccessAlert(true);
    setTimeout(() => setShowSuccessAlert(false), 3000); // Hide alert after 3 seconds
  };

  const handleLogoutSuccess = () => {
    setIsAuthenticated(false);
  };

  const fetchAvailableSpins = () => {
    // Ваш код для получения доступных спинов
    // Например, запрос к API
  };

  const onFinished = (winner) => {
    setCurrentWinner(winner);
    setIsModalOpen(true);
    setSegments(segments);
    setIsSpinning(false);
    isStartedRef.current = false;
    console.log(winner);

    // Call fetchAvailableSpins when the wheel finishes spinning
    fetchAvailableSpins();
  };

  const toggleGiftsVisibility = () => {
    setIsGiftsVisible(prevState => !prevState);
  };

  const showLoginModal = () => {
    setIsLoginModalOpen(true);
    setLoginSuccess(false);
  };

  const handleLoginModalClose = () => setIsLoginModalOpen(false);

  const showRegistrationModal = () => setIsRegistrationModalOpen(true);
  const handleRegistrationModalClose = () => setIsRegistrationModalOpen(false);

  return (
    <div>
      {showSuccessAlert && (
        <Alert
          message={alertMessage}
          type="success"
          showIcon
          style={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            zIndex: 1000,
          }}
          onClose={() => setShowSuccessAlert(false)}
        />
      )}
      <Content style={{ display: 'flex', padding: '0px', alignItems: 'center' }}>
        {/* Authentication and registration buttons */}
        <div style={{ position: 'absolute', top: '15px', left: '70px', display: 'flex', gap: '10px' }}>
          {!localStorage.getItem('token') ? (
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

        {/* Component with the number of attempts */}
        <div style={{ flex: 1, textAlign: 'left', marginRight: '50px' }}>
          <SpinCounter onFetchAvailableSpins={fetchAvailableSpins} />
        </div>

        {/* Wheel component */}
        <div style={{ flex: 2, textAlign: 'center' }}>
          <Title level={1} style={{ color: '#ffcc00', textShadow: '2px 2px 4px #000', userSelect: 'none' }}>Колесо фортуны</Title>
          <FortuneWheelComponent
            onFinished={onFinished}
            winningSegment={winningSegment}
          />
        </div>

        {/* Component with gifts */}
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

      {/* Modal window for authorization */}
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

      {/* Modal window for registration */}
      <Modal
        title="Регистрация"
        visible={isRegistrationModalOpen}
        onCancel={handleRegistrationModalClose}
        footer={null}
      >
        <RegistrationForm onRegistrationSuccess={handleRegistrationSuccess} />
      </Modal>
    </div>
  );
};

export default AppController;
