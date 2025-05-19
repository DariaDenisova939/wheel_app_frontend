export const setAvailableSpins = (attempts) => ({
    type: 'SET_AVAILABLE_SPINS',
    payload: attempts,
});
// Action to set prize type
export const setPrizeType = (prizeType) => ({
    type: 'SET_PRIZE_TYPE',
    payload: prizeType,
});
export const setUserPrizes = (prizes) => ({
    type: 'SET_USER_PRIZES',
    payload: prizes,
});