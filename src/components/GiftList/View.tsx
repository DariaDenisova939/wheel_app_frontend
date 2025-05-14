import React from 'react';
import { Carousel, Card, Row, Col, Button } from 'antd';
import { LeftCircleOutlined, RightCircleOutlined } from '@ant-design/icons';
import '../../Styles/GiftListComponent.scss';

const GiftListComponent = ({ prizes, carouselRef, next, prev }) => {
    return (
        <Row gutter={16} className="giftListContainer">
            <Col span={24} style={{ display: 'flex', justifyContent: 'center' }}>
                <Card
                    title="Мои подарки"
                    className="giftListCard"
                >
                    <div className="giftListCarousel">
                        {prizes.length > 0 && (
                            <Button
                                onClick={prev}
                                className="carouselButton"
                                style={{ marginRight: '10px' }}
                            >
                                <LeftCircleOutlined />
                            </Button>
                        )}
                        <div className="carouselContainer">
                            {prizes.length > 0 ? (
                                <Carousel ref={carouselRef} dots={true} style={{ height: '260px' }}>
                                    {prizes.map((prize, index) => (
                                        <div key={index} className="carouselItem">
                                            <Card
                                                title={prize.value}
                                                className="prizeCard"
                                            >
                                                <p className="prizeDescription">
                                                    {"Описание подарка"}
                                                </p>
                                            </Card>
                                        </div>
                                    ))}
                                </Carousel>
                            ) : (
                                <div className="noPrizes">
                                    <p>Пока нет подарков. Крутите колесо, чтобы начать получать призы!</p>
                                </div>
                            )}
                        </div>
                        {prizes.length > 0 && (
                            <Button
                                onClick={next}
                                className="carouselButton"
                                style={{ marginLeft: '10px' }}
                            >
                                <RightCircleOutlined />
                            </Button>
                        )}
                    </div>
                </Card>
            </Col>
        </Row>
    );
};

export default GiftListComponent;
