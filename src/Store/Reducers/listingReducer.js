const initState = {
  // ...initState1[0].listing,
  listing: [],
  advListing: [],
  myListing: [],
  metaData: {},
  activity_image: null,
  merchantInfo: null
};
const listingReducer = (state = initState, action) => {
  switch (action.type) {
    case "SET_LISTING_DATA":
      return {
        ...state,
        listing: action.payload,
      };
    case "GET_ACTIVITY_LISTING":
      return {
        ...state,
        advListing: action.payload,
      };
    case "SET_MYLISTING":
      return {
        ...state,
        myListing: action.payload,
      };
    case "SET_META_DATA":
      return {
        ...state,
        metaData: action.payload,
      };
    case "SET_ACTIVITY_IMAGE": {
      return {
        ...state,
        activity_image: action.payload
      }
    }
    case "SET_MERCHANT_INFO": {
      return ({
        ...state,
        merchantInfo: action.payload
      });
    }
    default:
      return state;
  }
};
export default listingReducer;
