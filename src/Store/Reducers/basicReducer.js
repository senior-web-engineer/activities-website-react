const initialState = {
  faq: [],
  aboutus: {},
  user_terms: {},
  advertiser_terms: {},
  privacy: {},
  support: null,
};

const basicReducer = (state = initialState, action) => {
  switch (action.type) {
    case "SET_FAQ_DATA": {
      return {
        ...state,
        faq: action.payload,
      };
    }
    case "SET_ABOUTUS": {
      return {
        ...state,
        aboutus: action.payload,
      };
    }
    case "SET_USER_TERMS_CONDITIONS": {
      return {
        ...state,
        user_terms: action.payload,
      };
    }
    case "SET_ADVERTISER_TERMS_CONDITIONS": {
      return {
        ...state,
        advertiser_terms: action.payload,
      };
    }
    case "SET_PRIVACY": {
      return {
        ...state,
        privacy: action.payload,
      };
    }
    case "SET_SUPPORT": {
      return {
        ...state,
        support: action.payload
      }
    }
    default:
      return state;
  }
};
export default basicReducer;
