// spinReducer.js

const initialState = {
  availableSpins: 0,
  prizeType: null, // Add prizeType to the initial state
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
    default:
      return state;
  }
};

export default spinReducer;
