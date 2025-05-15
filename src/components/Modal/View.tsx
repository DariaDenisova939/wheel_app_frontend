import React from 'react';
import { Modal, Button, Card } from 'antd';
import { GiftOutlined } from '@ant-design/icons';
import { useSelector } from 'react-redux'; // Import useSelector
import '../../Styles/WinnerModal.scss';
import { setPrizeType } from '../SpinCounter/actions'; // Import the action

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

  // Function to get the image URL based on the prize type
  const getImageUrl = () => {
    switch (prizeType) {
      case 'empty_prize':
        return './img4.jpg'; // Replace with the actual path
      case 'material_thing':
        return './img2.png'; // Replace with the actual path
      case 'attempt':
        return './img3.png'; // Replace with the actual path
      case 'promocode':
        return './image.png'; // Replace with the actual path
      default:
        return './img3.png'; // Replace with the actual path
    }
  };

  return (
    <Modal
      title={
        <div className="winnerModalTitle">
          <GiftOutlined className="giftIcon" />
          Поздравляем!
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
            <img
              alt={currentWinner}
              src={getImageUrl()} // Use the image URL based on the prize type
              className="cardImage"
            />
          }
          className="winnerModalCard"
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
