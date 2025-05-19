// spinReducer.js

const initialState = {
  availableSpins: 0,
  prizeType: null,
  userPrizes: [], // Add userPrizes to the initial state
};

const spinReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_AVAILABLE_SPINS':
      return {
        ...state,
        availableSpins: action.payload,
      };
    case 'SET_PRIZE_TYPE':
      return {
        ...state,
        prizeType: action.payload,
      };
    case 'SET_USER_PRIZES':
      return {
        ...state,
        userPrizes: action.payload,
      };
    default:
      return state;
  }
};

export default spinReducer;
