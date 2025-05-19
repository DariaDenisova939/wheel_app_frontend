import React, { useRef, useState, useEffect } from 'react';
import GiftListComponent from './View'; // Ensure the path is correct

const GiftListConnector = () => {
    const [prizes, setPrizes] = useState([]);
    const carouselRef = useRef(null);

    // Function to refresh token
    const refreshToken = async () => {
    const refreshToken = localStorage.getItem('token'); // Исправлено на 'refreshToken'

    if (!refreshToken) {
        throw new Error('No refresh token available');
    }

    try {
        const response = await fetch('http://try-your-luck.worktools.space/api/auth/refresh', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${refreshToken}`

            },
        });

        if (response.status === 401) {
            localStorage.removeItem('token')
            return;
        }

        const data = await response.json();

        if (!data.access_token) {
            throw new Error('Invalid token data received');
        }

        localStorage.setItem('token', data.access_token);

        return data.access_token;
    } catch (error) {
        console.error('Error refreshing token:', error);
        throw error;
    }
};


    // Function to fetch prizes from the server
    const fetchPrizes = async (retry = true) => {
        const token = localStorage.getItem('token');
        try {
            if (!token) {
                setPrizes([]); // Reset prizes if there is no token
                return;
            }
            const response = await fetch('http://try-your-luck.worktools.space/api/user-prizes', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (response.status === 401 && retry) {
                const newToken = await refreshToken();
                if (newToken) {
                    // Retry the request with the new token
                    await fetchPrizes(false);
                }
                return;
            }

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            console.log(data);

            // Map over the array of prizes to extract the necessary information
            const prizes = data.map(item => {
                let typeText;
                let valueText;

                // Determine the type text based on prize_type
                switch (item.prize_type) {
                    case 'empty_prize':
                        typeText = 'Пустой приз';
                        valueText = item.prize.name; // No additional value needed for empty prize
                        break;
                    case 'material_thing':
                        typeText = 'Подарок';
                        valueText = item.prize.name; // Assuming the prize name is available
                        break;
                    case 'attempt':
                        typeText = 'Попытка';
                        valueText = item.prize.name; // No additional value needed for attempt
                        break;
                    case 'promocode':
                        typeText = 'Промокод: '+ item.promocode_code.code;
                        valueText = item.prize.name; // Assuming the promocode is available in the prize object
                        break;
                    default:
                        typeText = 'Неизвестный тип';
                        valueText = '';
                }

                return {
                    value: valueText,
                    type: typeText
                    // Add any other properties you need
                };
            });

            setPrizes(prizes); // Set the prizes state with the array of prizes
        } catch (error) {
            console.error('Error fetching prizes:', error);
        }
    };

    // Fetch prizes when the component mounts
    useEffect(() => {
        fetchPrizes();
    }, []);

    // Add an effect to listen for changes in the token
    useEffect(() => {
        const handleTokenChange = () => {
            const token = localStorage.getItem('token');
            if (!token) {
                setPrizes([]); // Reset prizes if there is no token
            } else {
                fetchPrizes(); // Fetch prizes whenever the token changes
            }
        };

        // Listen for custom token change event
        window.addEventListener('tokenChanged', handleTokenChange);

        // Cleanup listener on component unmount
        return () => {
            window.removeEventListener('tokenChanged', handleTokenChange);
        };
    }, []); // Empty dependency array ensures this runs once on mount

    const handlePrizeAdded = () => {
        fetchPrizes(); // Fetch prizes again when a new prize is added
    };

    const next = () => {
        carouselRef.current.next();
        handlePrizeAdded(); // Call handlePrizeAdded when moving to the next prize
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
