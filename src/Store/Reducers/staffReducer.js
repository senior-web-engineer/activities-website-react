import { staffTypes } from "../action/actionTypes";
const initialState = {
  activityLists: [],
  staffLists: [],
};
const StaffReducer = (state = initialState, action) => {
  switch (action.type) {
    case staffTypes.GET_ACTIVITY_LISTS:
      return { ...state, activityLists: action.payload };
    case staffTypes.STAFF_LISTS:
      return { ...state, staffLists: action.payload };
    default:
      return state;
  }
};
export default StaffReducer;
