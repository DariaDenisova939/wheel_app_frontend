import React from 'react';
import FortuneWheel from './pages/Wheel';
import backgroundImage from './Styles/gold-background.avif'; // Импорт изображения

const App = () => {
    return (
        <div style={{ 
              backgroundImage: `url(${backgroundImage})`, 
              backgroundSize: '100% 100%',
              backgroundRepeat: 'no-repeat',
              width: '1536px',
              height: '702px',
              display: 'flex', // Используем flexbox для центрирования
              alignItems: 'flex-start', // Выравнивание по верхнему краю
              justifyContent: 'center', // Центрирование по горизонтали
            }}>
            <div style={{ marginTop: '-25px' }}> {/* Сдвиг вверх */}
                <FortuneWheel />
            </div>
        </div>
    );
};


export default App;
