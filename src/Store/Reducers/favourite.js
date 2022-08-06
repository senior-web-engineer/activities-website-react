const initialState = {
  favouriteList: [],
};
export const favouriteReducer = (state = initialState, action) => {
  switch (action.type) {
    case "GET_FAVOURITE_DATA":
      return {
        favouriteList: action.payload,
      };
    default:
      return state;
  }
};
