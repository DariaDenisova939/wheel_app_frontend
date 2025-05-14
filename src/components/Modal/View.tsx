import React from 'react';
import { Modal, Button, Card } from 'antd';
import { GiftOutlined } from '@ant-design/icons';
import '../../Styles/WinnerModal.scss'
interface WinnerModalProps {
  isModalOpen: boolean;
  currentWinner: string;
  prizes: { value: string; imageUrl: string }[];
  onClose: () => void;
}

const WinnerModalComponent: React.FC<WinnerModalProps> = ({ isModalOpen, currentWinner, prizes, onClose }) => {
  const winnerPrize = prizes.find(prize => prize.value === currentWinner);

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
      {winnerPrize && (
        <Card
          cover={
            <img
              alt={winnerPrize.value}
              src={winnerPrize.imageUrl}
              className="cardImage"
            />
          }
          className="winnerModalCard"
        >
          <Card.Meta
            title={
              <div className="cardTitle">
                {winnerPrize.value}
              </div>
            }
          />
        </Card>
      )}
    </Modal>
  );
};

export default WinnerModalComponent;
