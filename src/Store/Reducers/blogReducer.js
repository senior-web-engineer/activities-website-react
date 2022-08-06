const initState = {
  // ...initState1[0].blog
  blog_list: [],
  press_data: null,
}
const blogReducer = (state = initState, action) => {
  switch (action.type) {
    case 'SET_BLOG_LIST':
      return {
        ...state,
        blog_list: action.payload,
      }
    case 'SET_PRESS_DATA': {
      return {
        ...state,
        press_data: action.payload,
      }
    }
    default:
      return state
  }
}
export default blogReducer
