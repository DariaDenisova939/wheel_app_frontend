// models/wheelData.js
export const initialSegments = [
    { value: "Приз", probability: 0.1 },
    { value: "Не повезло, тут пусто", probability: 0.2 },
    { value: "Попытка прокрутить еще раз", probability: 0.3 },
    { value: "Не повезло, тут пусто", probability: 0.1 },
    { value: "Приз", probability: 0.1 },
    { value: "Промокод", probability: 0.05 },
    { value: "Не повезло, тут пусто", probability: 0.05 },
    { value: "Промокод", probability: 0.05 },
    { value: "Попытка прокрутить еще раз", probability: 0.05 },
    { value: "Промокод", probability: 0.05 }
];

export const prizes = [
    { value: "123456789123456789123456789123456789123456789123456789", type: "promo", imageUrl: "./img3.png" },
    { value: "22", type: "promo", imageUrl: "./img2.png" },
    { value: "33", type: "promo", imageUrl: "./image.png" },
    { value: "44", type: "promo", imageUrl: "./img4.jpg" },
    { value: "55", type: "promo", imageUrl: "./image.png" },
    { value: "66", type: "promo", imageUrl: "./image.png" },
    { value: "77", type: "promo", imageUrl: "./image.png" },
    { value: "8", type: "promo", imageUrl: "./image.png" },
    { value: "9", type: "promo", imageUrl: "./image.png" },
    { value: "10", type: "promo", imageUrl: "./image.png" },

];

export const segColors = [
    "#BDB76B", // Красный
    "#BC8F8F", // Желтый
    "#FFA500", // Оранжевый
    "#32CD32", // Лаймовый зеленый
    "#3DA5E0", // Светло-синий
    "#34A24F", // Темно-зеленый
    "#FFD700", // Золотой
    "#FF4500", // Темно-оранжевый
    "#8A2BE2", // Сине-фиолетовый
    "#FF6347"  // Томатный
];
