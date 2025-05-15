import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Typography, Card } from 'antd';

const { Text } = Typography;

// Define the type for your Redux state
interface RootState {
  availableSpins: number;
  // Add other state properties here if you have any
}

const SpinCounterComponent = () => {
    // Use the RootState type in useSelector
    const availableSpins = useSelector((state: RootState) => state.availableSpins);

    useEffect(() => {
        localStorage.setItem('availableSpins', availableSpins.toString());
    }, [availableSpins]);

    return (
        <div style={{ textAlign: 'center', width: '350px', margin: '0 auto' }}>
            <Card
                style={{
                    backgroundColor: 'rgba(205, 205, 221, 0.27)',
                    borderRadius: '50px',
                    padding: '5px',
                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.85)',
                    border: 'none',
                    height: '100px',
                }}
            >
                <Text style={{ fontSize: '24px', color: '#333', textShadow: '1px 1px 2px #000' }}>
                    Осталось вращений x{availableSpins}
                </Text>
            </Card>
        </div>
    );
};

export default SpinCounterComponent;
