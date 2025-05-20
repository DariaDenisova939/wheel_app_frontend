import React, { useEffect, useState, useRef } from 'react'
import '../../Styles/App.scss';
import { useSelector } from 'react-redux';
interface RootState {
  availableSpins: number;
  // Add other state properties here if you have any
}

export interface WheelComponentProps {
  segments: string[]
  segColors: string[]
  winningSegment: string
  onFinished: (winningSegment: string) => void; // Изменено
  primaryColor?: string
  contrastColor?: string
  buttonText?: string
  isOnlyOnce?: boolean
  size?: number
  upDuration?: number
  downDuration?: number
  fontFamily?: string
  fontSize?: string
  outlineWidth?: number
  countspin?: number
  isSpinning?: boolean; // Добавьте это свойство
  spin_view: (winningSegment: string) => void; // Добавьте это свойство
  stop: () => void; // Добавьте это свойство
  isStarted?: boolean; // Добавьте это свойство
}

const View = ({
  segments,
  segColors,
  winningSegment,
  onFinished,
  primaryColor = 'black',
  contrastColor = 'white',
  buttonText = 'Вращать',
  isOnlyOnce = true,
  size = window.innerWidth,
  upDuration = 100,
  downDuration = 1000,
  fontFamily = 'proxima-nova',
  fontSize = '1.5em',
  outlineWidth = 10,
  countspin,
  spin_view
}: WheelComponentProps) => {
  const randomString = () => {
    const chars =
      '0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz'.split('')
    const length = 8
    let str = ''
    for (let i = 0; i < length; i++) {
      str += chars[Math.floor(Math.random() * chars.length)]
    }
    return str
  }
  countspin = useSelector((state: RootState) => state.availableSpins);
  const canvasId = useRef(`canvas-${randomString()}`)
  const wheelId = useRef(`wheel-${randomString()}`)
  const contextRef = useRef<CanvasRenderingContext2D  | null>(null);
  const currentSegmentRef = useRef('');
  const winSegmentRef = useRef(winningSegment);
  const angleCurrentRef = useRef(0);
  const angleDeltaRef = useRef(0);
  const dimension = (size + 20) * 2
  const [showStopButton, setShowStopButton] = useState(false);
  let currentSegment = ''
  let currentSpeed = 0
  let isSpinning = false; // Флаг для отслеживания состояния вращения
  let stopTime = 0; // Время, когда было нажато "Стоп"
  let acceleration = 0.0001; // Настройте это значение по вашему усмотрению
  const [isStarted, setStarted] = useState(false)
  const isSlowingDown = useRef(false)
  const isStop = useRef(false)
  let countCircle = 6
  const countCircleRef = useRef(6);
  let hasEncounteredWinningSegment = false
  const [isFinished, setFinished] = useState(false)
  let timerHandle = 0
  const timerDelay = segments.length
  let canvasContext: CanvasRenderingContext2D | null = null
  const upTime = segments.length * upDuration
  const downTime = segments.length * downDuration
  let spinStart = 0
  let frames = 0
  const centerX = size + 20
  const centerY = size + 20
  const speedsBySegments = [
    Math.PI / 140, // для 1 сегмента (если нужно)
    Math.PI / 140, // для 2 сегментов (если нужно)
    Math.PI / 140, // для 3 сегментов (если нужно)
    Math.PI / 80, // для 4 сегментов
    Math.PI / 70, // для 5 сегментов
    Math.PI / 60, // для 6 сегментов
    Math.PI / 50, // для 7 сегментов
    Math.PI / 50, // для 8 сегментов
    Math.PI / 50, // для 9 сегментов
    Math.PI / 40, // для 10 сегментов
  ];
  let maxSpeed = speedsBySegments[segments.length-1]
  useEffect(() => {
    initCanvas()
     wheelDraw()
    
    setTimeout(() => {
      window.scrollTo(0, 1)
    }, 0)
  }, [segments])

  const initCanvas = () => {
    let canvas: HTMLCanvasElement | null = document.getElementById(
      canvasId.current
    ) as HTMLCanvasElement

    if (navigator.userAgent.indexOf('MSIE') !== -1) {
      canvas = document.createElement('canvas')
      canvas.setAttribute('width', `${dimension}`)
      canvas.setAttribute('height', `${dimension}`)
      canvas.setAttribute('id', canvasId.current)
      document.getElementById(wheelId.current)?.appendChild(canvas)
    }
    
    canvasContext = canvas?.getContext('2d')
    if (!canvasContext) return;
    contextRef.current = canvasContext;

  }
  
  const spin = () => {
    setStarted(true)
    setShowStopButton(false); // Скрываем кнопку "Стоп" перед запуском
    spin_view(currentSegmentRef.current)
    isStop.current = false;
    //angleCurrent = 0
    if (timerHandle === 0) {
      spinStart = new Date().getTime()
      maxSpeed = speedsBySegments[segments.length-1]
      //maxSpeed = Math.PI / 500
      frames = 0
      timerHandle = window.setInterval(onTimerTick, timerDelay)
      
    }
    
  }
  
var onTimerTick = function onTimerTick() {
  frames++;
  draw();
  var duration = new Date().getTime() - spinStart;
  var finished = false;
  var progress = 0;
  // Разгон колеса до максимальной скорости
  if (duration < upTime) {
    progress = duration / upTime;
    angleDeltaRef.current = maxSpeed * Math.sin(progress * Math.PI / 2);
  } else {
  // Если колесо уже достигло максимальной скорости
  
  if (!isStop.current) {
  // Продолжаем вращение с максимальной скоростью
  angleDeltaRef.current = Math.min(angleDeltaRef.current, maxSpeed);
  setShowStopButton(true);
    } else {
      if (currentSegmentRef.current === winSegmentRef.current){
        hasEncounteredWinningSegment = true;
        
      }
    
        if (isSlowingDown && hasEncounteredWinningSegment) {
        // Уменьшаем скорость
                hasEncounteredWinningSegment = true;
                const angularAcceleration = maxSpeed * maxSpeed / (countCircleRef.current * 2 * Math.PI); // Угловое ускорение для замедления
                const slowDownFactor = 1 - (angularAcceleration / angleDeltaRef.current);
                // Применяем множитель к текущей скорости
                angleDeltaRef.current *= slowDownFactor;
                //angleDeltaRef.current = 0
                if (angleDeltaRef.current <= 0) {
                  finished = true; // Завершаем вращение
                }
        }
    }
  }
  
  angleCurrentRef.current += angleDeltaRef.current;
  
  while (angleCurrentRef.current >= Math.PI * 2) {
    angleCurrentRef.current -= Math.PI * 2;
  }
  
  if (finished) {
  setFinished(true);
  onFinished(currentSegmentRef.current);
  setStarted(false)
  isStop.current = false
  clearInterval(timerHandle);
  timerHandle = 0;
  isSpinning = false; // Сброс флага вращения
  angleDeltaRef.current = 0
  countCircleRef.current = 6
  }
  };



  const wheelDraw = () => {
    clear()
    drawWheel()
    drawNeedle()
  }

  const draw = () => {
    clear()
    drawWheel()
    drawNeedle()
  }

  const drawSegment = (key: number, lastAngle: number, angle: number) => {
    const canvasContext = contextRef.current;
    if (!canvasContext) {
      return false;
    }
    const ctx = canvasContext;
    const value = segments[key];

    ctx.save();
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.arc(centerX, centerY, size, lastAngle, angle, false);
    ctx.lineTo(centerX, centerY);
    ctx.closePath();
    ctx.fillStyle = segColors[key % segColors.length];
    ctx.fill();
    ctx.stroke();

    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.rotate((lastAngle + angle) / 2);
    ctx.fillStyle = contrastColor;
    ctx.font = `bold ${17}px ${fontFamily}`;
    ctx.textBaseline = 'middle'; // Центрирование текста

    const displayText = value.length > 21 ? value.substring(0, 18) + '...' : value.substring(0, 21);

    // Добавление тени для улучшения контрастности
    ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
    ctx.shadowOffsetX = 1;
    ctx.shadowOffsetY = 1;
    ctx.shadowBlur = 2;

    ctx.fillText(displayText, size / 2 + 10, 0);
    ctx.restore();
};

  

const drawWheel = () => {
  const canvasContext = contextRef.current;
  if (!canvasContext) {
    return false;
  }
  const ctx = canvasContext;
  const len = segments.length;
  const PI2 = Math.PI * 2;
  var lastAngle = angleCurrentRef.current;
  ctx.lineWidth = 0.1;
  ctx.strokeStyle = primaryColor;
  ctx.textBaseline = 'middle';
  ctx.textAlign = 'center';
  ctx.font = '1em ' + fontFamily;
  for (var i = 1; i <= len; i++) {
    var angle = PI2 * (i / len) + angleCurrentRef.current;
    drawSegment(i - 1, lastAngle, angle);
    lastAngle = angle;
  }

  // Добавляем тени для эффекта выпуклости
  ctx.shadowColor = 'rgba(0, 0, 0, 0.5)'; // Темно-серый цвет тени
  ctx.shadowOffsetX = 2; // Смещение тени по горизонтали
  ctx.shadowOffsetY = 2; // Смещение тени по вертикали
  ctx.shadowBlur = 5; // Размытие тени

  // Создаем линейный градиент для рамки с более светлыми золотыми оттенками
  const rimRadius = 250; // Радиус рамки
  const gradient = ctx.createLinearGradient(centerX - rimRadius, centerY - rimRadius, centerX + rimRadius, centerY + rimRadius);
  gradient.addColorStop(0, '#FFD700'); // Светло-золотой цвет (начальный)
  gradient.addColorStop(0.5, '#FFA500'); // Светло-золотой цвет (середина)
  gradient.addColorStop(1, '#FFD700'); // Светло-золотой цвет (конечный)

  ctx.lineWidth = 17; // Толщина рамки
  ctx.strokeStyle = gradient; // Устанавливаем градиент для рамки

  ctx.beginPath();
  ctx.arc(centerX, centerY, rimRadius, 0, PI2, false); // Нарисовать круг
  ctx.stroke();

  // Белые кружки с градиентом
  const numCircles = 10;
  const circleRadius = 5;
  const circleSpacing = (rimRadius * 2) / numCircles;

  for (let i = 0; i < numCircles; i++) {
    const angle = i * (PI2 / numCircles);
    const x = centerX + rimRadius * Math.cos(angle);
    const y = centerY + rimRadius * Math.sin(angle);

    // Создаем радиальный градиент для кружка
    const circleGradient = ctx.createRadialGradient(x, y, 0, x, y, circleRadius);
    circleGradient.addColorStop(0, 'white'); // Белый цвет (центр)
    circleGradient.addColorStop(1, '#FFD700'); // Золотой цвет (край)

    ctx.beginPath();
    ctx.arc(x, y, circleRadius, 0, PI2, false);
    ctx.fillStyle = circleGradient; // Устанавливаем градиент для заливки круга
    ctx.fill();
    ctx.closePath();
  }

  ctx.shadowColor = 'transparent'; // Сбрасываем тени
};

const drawNeedle = () => {
  const ctx = contextRef.current;
  if (!ctx) {
    return false;
  }

    // Основной цвет стрелки
  const mainColor = '#FFD700'; 
  // Радиус рамки
  const rimRadius = 250;
  const outlineColor = '#FF8C00'; // Цвет обводки
  const outlineWidth = 1.5; // Ширина обводки

  // Начинаем рисовать обводку стрелки
  ctx.lineWidth = outlineWidth; // Устанавливаем ширину линии для обводки
  ctx.strokeStyle = outlineColor; // Устанавливаем цвет обводки
  
  ctx.beginPath();
  ctx.moveTo(centerX, centerY - rimRadius + 40); // Верхняя точка стрелки
  ctx.bezierCurveTo(centerX - 30, centerY - rimRadius - 30, centerX + 30, centerY - rimRadius - 30, centerX, centerY - rimRadius + 40); // Острая каплевидная форма
  ctx.closePath(); // Закрываем путь
  ctx.stroke(); // Рисуем обводку

  // Начинаем рисовать саму стрелку
  ctx.lineWidth = 2; // Устанавливаем ширину линии для стрелки
  ctx.fillStyle = mainColor; // Устанавливаем цвет заливки стрелки

  ctx.beginPath();
  ctx.moveTo(centerX, centerY - rimRadius + 40); // Верхняя точка стрелки
  ctx.bezierCurveTo(centerX - 30, centerY - rimRadius - 30, centerX + 30, centerY - rimRadius - 30, centerX, centerY - rimRadius + 40); // Острая каплевидная форма
  ctx.closePath(); // Закрываем путь
  ctx.fill(); // Заливаем стрелку

  // Добавляем тени только для круглой части капли сверху
  ctx.shadowColor = 'rgba(0, 0, 0, 0.5)'; // Цвет тени
  ctx.shadowOffsetX = 1; // Смещение тени по горизонтали
  ctx.shadowOffsetY = 1; // Смещение тени по вертикали
  ctx.shadowBlur = 8; // Размытие тени

  // Рисуем только круглую часть с тенью
  ctx.beginPath();
  ctx.moveTo(centerX, centerY - rimRadius + 40); // Верхняя точка стрелки
  ctx.bezierCurveTo(centerX - 30, centerY - rimRadius - 30, centerX + 30, centerY - rimRadius - 30, centerX, centerY - rimRadius + 40); // Острая каплевидная форма
  ctx.closePath(); // Закрываем путь
  ctx.fill(); // Заливаем стрелку с тенью
  
    // Убираем тени для других элементов
    ctx.shadowColor = 'transparent';
  // Добавляем блики
  ctx.globalAlpha = 0.5; // Устанавливаем прозрачность для бликов
  ctx.strokeStyle = 'white'; // Цвет бликов
  ctx.lineWidth = 1; // Ширина линии для бликов
  // Рисуем блики
  ctx.beginPath();
  ctx.moveTo(centerX - 5, centerY - rimRadius - 35); // Начальная точка первого блика
  ctx.lineTo(centerX + 5, centerY - rimRadius - 35); // Конечная точка первого блика
  ctx.stroke(); // Рисуем первый блик
  ctx.beginPath();
  ctx.moveTo(centerX - 3, centerY - rimRadius - 30); // Начальная точка второго блика
  ctx.lineTo(centerX + 3, centerY - rimRadius - 30); // Конечная точка второго блика
  ctx.stroke(); // Рисуем второй блик

  ctx.globalAlpha = 1; // Сбрасываем прозрачность

  // Создаем радиальный градиент для кружка с красно-белыми оттенками
  const circleGradient = ctx.createRadialGradient(centerX, centerY, 2, centerX, centerY, 12);
  circleGradient.addColorStop(0, '#FFFFFF'); // Белый цвет (центр)
  circleGradient.addColorStop(1, '#FFD700'); // Красный цвет (край)

  // Добавляем тени для кружка
  ctx.shadowColor = 'rgba(0, 0, 0, 0.5)'; // Цвет тени
  ctx.shadowOffsetX = 1; // Смещение тени по горизонтали
  ctx.shadowOffsetY = 1; // Смещение тени по вертикали
  ctx.shadowBlur = 5; // Размытие тени

  // Рисуем кружок с градиентом и тенями
  const circleRadius = 10; // Радиус круга
  ctx.beginPath();
  ctx.arc(centerX, centerY, circleRadius, 0, Math.PI * 2); // Рисуем круг
  ctx.fillStyle = circleGradient; // Устанавливаем градиент для заливки круга
  ctx.fill(); // Заливаем круг градиентом
  ctx.stroke(); // Обводим круг цветом

  // Сбрасываем тени
  ctx.shadowColor = 'transparent';

  let currentIndex = 0;
  for (let i = 0; i < segments.length; i++) {
    if (segments[i] === currentSegmentRef.current) {
      currentIndex = i;
      break
    }
  }
  var change = angleCurrentRef.current + Math.PI / 2;
  var i = segments.length - Math.floor(change / (Math.PI * 2) * segments.length) - 1;
  if (i < 0) i = i + segments.length;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = primaryColor;
  ctx.font = 'bold 1.5em ' + fontFamily;
  currentSegmentRef.current = segments[i];
  isStarted && ctx.fillText(currentSegmentRef.current, centerX + 10, centerY + size + 90);
};

  const clear = () => {
    if (!canvasContext) {
      return false
    }
    const ctx = canvasContext
    ctx.clearRect(0, 0, dimension, dimension)
  }
  const stop = () => {
    setShowStopButton(false);
     // Скрываем кнопку "Стоп" после остановки
    //setStarted(false);
    isStop.current = true
    isSpinning = true; // Устанавливаем флаг, что колесо сейчас вращается
    isSlowingDown.current=true // Устанавливаем флаг замедления
    currentSegment = currentSegmentRef.current;
    
  if (currentSegmentRef.current !== winSegmentRef.current){
    // Рандомим угол от 0 до 2*пи/segments.length
    const randomAngle =  0.01 + Math.random() * ((2 * Math.PI / segments.length / 3) - 0.1);
    // Добавляем рандомизированный угол к countCircle
    countCircleRef.current += (randomAngle) //* (2 * Math.PI / segments.length / 3);
  }
 
  };
  winSegmentRef.current = winningSegment
  return (
    <div id={wheelId.current}>
      <canvas
        id={canvasId.current}
        width={dimension}
        height={dimension}
        style={{
          pointerEvents: isFinished && isOnlyOnce ? 'none' : 'auto'
        }}
      />
      <div style={{ textAlign: 'center', userSelect: 'none' }}>
            <button
                className='button'
                onClick={isStarted ? stop : spin}
                disabled={(isStarted && !showStopButton) || (countspin === 0 && !isStarted)} // Кнопка "Крутить" неактивна, пока не появится "Стоп"
            >
                {isStarted ? 'Стоп' : 'Крутить'}
            </button>
        </div>
    </div>
  )
}
export default View