import React from 'react';
import { Carousel, Card, Row, Col, Button } from 'antd';
import { LeftCircleOutlined, RightCircleOutlined, GiftOutlined } from '@ant-design/icons';
import '../../Styles/GiftListComponent.scss';

const GiftListComponent = ({ prizes, carouselRef, next, prev }) => {
    // Reverse the prizes array to start from the last element
    const reversedPrizes = [...prizes].reverse();
    //console.log(reversedPrizes);

    return (
        <Row gutter={16} className="giftListContainer">
            <Col span={24} style={{ display: 'flex', justifyContent: 'center', userSelect: 'none' }}>
                <Card
                    title={
                        <>
                            <GiftOutlined /> Мои подарки
                        </>
                    }
                    className="giftListCard"
                >
                    <div className="giftListCarousel">
                        {reversedPrizes.length > 0 && (
                            <Button
                                onClick={prev}
                                className="carouselButton"
                                style={{ marginRight: '10px' }}
                            >
                                <LeftCircleOutlined />
                            </Button>
                        )}
                        <div className="carouselContainer">
                            {reversedPrizes.length > 0 ? (
                                <Carousel ref={carouselRef} dots={false} style={{ height: '260px' }}>
                                    {reversedPrizes.map((prize, index) => (
                                        <div key={index} className="carouselItem">
                                            <Card
                                                title={prize.type} // Display the prize type in the card header
                                                className="prizeCard"
                                            >
                                                <p className="prizeDescription">
                                                    {prize.value} {/* Display the prize name in the card body */}
                                                </p>
                                            </Card>
                                        </div>
                                    ))}
                                </Carousel>
                            ) : (
                                <div className="noPrizes">
                                    <p>Пока нет подарков. Зарегистрируйтесь и крутите колесо, чтобы начать получать призы!</p>
                                </div>
                            )}
                        </div>
                        {reversedPrizes.length > 0 && (
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
