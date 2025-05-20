import React, { useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setUserPrizes } from '../SpinCounter/actions'; // Import the action to set user prizes
import GiftListComponent from './View'; // Ensure the path is correct
export interface RootState {
  userPrizes: [];
  // Добавьте другие свойства состояния, если они есть
}
const GiftListConnector = () => {
    const carouselRef = useRef(null);
    const dispatch = useDispatch(); // Initialize useDispatch

    // Get prizes from Redux store
    
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
                dispatch(setUserPrizes([])); // Reset prizes in Redux if there is no token
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
            //console.log(data);

            // Map over the array of prizes to extract the necessary information
            const prizes = data.map(item => {
                let typeText;
                let valueText;

                // Determine the type text based on prize_type
                switch (item.prize_type) {
                    case 'empty-prize':
                        typeText = 'Пустой приз';
                        valueText = item.prize.name; // No additional value needed for empty prize
                        break;
                    case 'material-thing':
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

            dispatch(setUserPrizes(prizes)); // Dispatch the action to update Redux store
            //console.log('призы')
            //console.log(prizes)
            
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
                dispatch(setUserPrizes([])); // Reset prizes in Redux if there is no token
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

    const next = () => {
        carouselRef.current.next();
    };

    const prev = () => {
        carouselRef.current.prev();
    };
    const prizesOutput = useSelector((state: RootState) => state.userPrizes);
    return (
        <GiftListComponent
            prizes={prizesOutput}
            carouselRef={carouselRef}
            next={next}
            prev={prev}
        />
    );
};

export default GiftListConnector;
