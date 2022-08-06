const initState = {
  //   ...initState1[0].category,
  categories: [],
  groupData: [],
  hero_image: "",
};
const catReducer = (state = initState, action) => {
  switch (action.type) {
    case "SET_CATEGORY_DATA":
      return {
        ...state,
        categories: action.payload.categories,
        groupData: action.payload.groupData,
      };
    case "SET_HERO_IMAGE": {
      return {
        ...state,
        hero_image: action.payload,
      };
    }
    default:
      return state;
  }
};
export default catReducer;
