// var item = localStorage.getItem('user');

const initState = {
  isLogin: false,
  currentUser: JSON.parse(localStorage.getItem("user")) ?? null,
};

const AuthReducer = (state = initState, action) => {
  switch (action.type) {
    case "CREATE_USER":
      localStorage.setItem("user", action.user);
      return JSON.parse(localStorage.getItem("user"));
    case "CREATE_USER_ERROR":
      return {
        successMessage: false,
      };
    case "GOOGLE_SIGN_SUCCESS":
      return {
        isLogin: true,
      };
    case "SET_CURRENT_USER": {
      return {
        ...state,
        currentUser: action.payload,
      };
    }
    default:
      return state;
  }
};
export default AuthReducer;
