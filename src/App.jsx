import React from 'react';
import FortuneWheel from './pages/Wheel';

const App = () => {
    return (
        <div style={{
            background: 'linear-gradient(to bottom, #FFD700, #FFEC8B)', // Желтый градиент
            backgroundSize: 'cover',
            backgroundRepeat: 'no-repeat',
            minWidth: '100vw', // Используем minWidth и minHeight, чтобы контейнер мог расширяться
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
        }}>
            {/* Центральный градиент */}
            <div style={{
                position: 'absolute',
                width: '300px',
                height: '300px',
                background: 'radial-gradient(circle, white, transparent 70%)',
                zIndex: 1
            }}></div>

            {/* Белые лучи по всей окружности */}
            <div style={{
                position: 'absolute',
                width: '100%',
                height: '100%',
                background: 'repeating-conic-gradient(from 0deg, rgba(255, 255, 255, 0.3) 0deg 10deg, transparent 10deg 20deg)',
                zIndex: 0
            }}></div>

            <div style={{ marginTop: '-25px', zIndex: 2 }}>
                <FortuneWheel />
            </div>
        </div>
    );
};

export default App;