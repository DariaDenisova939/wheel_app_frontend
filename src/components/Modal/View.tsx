import React from 'react';
import { Modal, Button, Card } from 'antd';
import { GiftOutlined, TrophyOutlined } from '@ant-design/icons';
import { useSelector } from 'react-redux';
import '../../Styles/WinnerModal.scss';
import { setPrizeType } from '../SpinCounter/actions';

interface WinnerModalProps {
  isModalOpen: boolean;
  currentWinner: string;
  prizes: { value: string; imageUrl: string }[];
  onClose: () => void;
}

interface RootState {
  prizeType: string;
  // Add other state properties here if you have any
}

const WinnerModalComponent: React.FC<WinnerModalProps> = ({ isModalOpen, currentWinner, prizes, onClose }) => {
  // Access the prize type from the Redux store
  const prizeType = useSelector((state: RootState) => state.prizeType);

  // Function to get the icon based on the prize type
  const getIcon = () => {
    switch (prizeType) {
      case 'empty-prize':
        return <GiftOutlined style={{ fontSize: '40px', color: '#ccc', filter: 'drop-shadow(0 1px 20px rgba(0, 0, 0, 0.5))' }} />;
      case 'material-thing':
        return <GiftOutlined style={{ fontSize: '40px', color: '#ff6b6b', filter: 'drop-shadow(0 1px 20px rgba(0, 0, 0, 0.5))' }} />;
      case 'attempt':
        return <TrophyOutlined style={{ fontSize: '40px', color: '#ffd166', filter: 'drop-shadow(0 1px 20px rgba(0, 0, 0, 0.5))' }} />;
      case 'promocode':
        return <TrophyOutlined style={{ fontSize: '40px', color: '#06d6a0', filter: 'drop-shadow(0 1px 20px rgba(0, 0, 0, 0.5))' }} />;
      default:
        return <GiftOutlined style={{ fontSize: '40px', color: '#ccc', filter: 'drop-shadow(0 1px 20px rgba(0, 0, 0, 0.5))' }} />;
    }
  };

  // Function to get the title based on the prize type
  const getTitle = () => {
    switch (prizeType) {
      case 'empty-prize':
        return 'Не расстраивайся!';
      default:
        return 'Поздравляем!';
    }
  };

  return (
    <Modal
      title={
        <div className="winnerModalTitle">
          {getTitle()}
        </div>
      }
      visible={isModalOpen}
      onOk={onClose}
      onCancel={onClose}
      footer={[
        <Button
          key="back"
          onClick={onClose}
          className="closeButton"
        >
          Закрыть
        </Button>,
      ]}
      style={{ borderRadius: '10px', overflow: 'hidden' }}
    >
      {currentWinner && (
        <Card
          cover={
            <div
              style={{
                height: '200px',
                position: 'relative',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <div className="centerIcon">
                {getIcon()}
              </div>
            </div>
          }
          className={`winnerModalCard winnerModalCard-${prizeType}`}
        >
          <Card.Meta
            title={
              <div className="cardTitle">
                {currentWinner} {/* Display the prize type */}
              </div>
            }
          />
        </Card>
      )}
    </Modal>
  );
};

export default WinnerModalComponent;
