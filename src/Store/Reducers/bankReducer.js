const initialState = {
  bank_info: [],
  couponLists: [],
  total: 0,
};
export const bankReducer = (state = initialState, action) => {
  switch (action.type) {
    case "SET_BANK_INFO":
      return {
        ...state,
        bank_info: action.payload,
      };
    case "SET_TOTAL_MONEY": {
      return {
        ...state,
        total: action.payload,
      };
    }
    case "GET_COUPON_LIST":
      return {
        ...state,
        couponLists: action.payload,
      };
    default:
      return state;
  }
};
