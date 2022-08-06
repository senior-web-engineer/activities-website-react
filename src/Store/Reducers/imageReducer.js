// var item = localStorage.getItem('login');
const initState = {
  image_data: [],
  activityLists: [],
  child_image: [],
};

const imageReducer = (state = initState, action) => {
  switch (action.type) {
    case "SET_IMAGE":
      return {
        image_data: action.payload,
      };
    case "CHILD_IMAGE":
      return {
        child_image: [...state.child_image, action.payload],
      };
    default:
      return state;
  }
};
export default imageReducer;
