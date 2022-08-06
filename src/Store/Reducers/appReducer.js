// var item = localStorage.getItem('user');
import USFlag from "assets/img/flag/svg/UnitedState.svg";

const initState = {
  currency: {
    ...(JSON.parse(localStorage.getItem("store"))?.currency || {
      value: "USD",
      title: "us_dollar",
      currency: "$",
    }),
  },
  language: {
    ...(JSON.parse(localStorage.getItem("store"))?.language || {
      icon: USFlag,
      title: "English",
    }),
  },
  appPrompt: JSON.parse(sessionStorage.getItem("store")?.appPrompt || true),
  header_messages: [],
};

const app = (state = initState, action) => {
  switch (action.type) {
    case "SET_APP":
      return {
        ...state,
        ...(action.payload ?? {}),
      };
    case "UPDATE_APP":
      return action?.payload(state);
    case "RESET_APP":
      return {};
    case "SET_PAGE_LOADING": {
      return {
        ...state,
        ...(action.payload ?? { isPageLoading: false }),
      };
    }
    case "SET_CURRENCY": {
      return {
        ...state,
        ...action.payload,
      };
    }
    case "SET_APP_PROMPT": {
      return {
        ...state,
        ...action.payload,
      };
    }
    case "SET_LANGUAGE": {
      return {
        ...state,
        ...action.payload,
      };
    }
    case "SET_HEADER_MESSAGE": {
      return {
        ...state,
        header_messages: action.payload,
      };
    }
    default:
      return state;
  }
};
export default app;
