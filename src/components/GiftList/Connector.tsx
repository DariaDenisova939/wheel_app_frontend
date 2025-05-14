import React, { useRef } from 'react';
import GiftListComponent from './View'; // Убедитесь, что путь правильный

const GiftListConnector = ({ prizes }) => {
    const carouselRef = useRef(null);

    const next = () => {
        carouselRef.current.next();
    };

    const prev = () => {
        carouselRef.current.prev();
    };

    return (
        <GiftListComponent
            prizes={prizes}
            carouselRef={carouselRef}
            next={next}
            prev={prev}
        />
    );
};

export default GiftListConnector;
