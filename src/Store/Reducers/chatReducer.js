import types from '../action/actionTypes'
const initState = {
  rooms: null,
  users: null,
  messages: null,
  unread: 0,
  groupChatRooms: null,
  block_flag: { flag: '0', type: 'private' },
  unreadMessage: '',
  sel_chatroomid: null,
}

const ChatReducer = (state = initState, action) => {
  switch (action.type) {
    case types.GET_CHAT_ROOMS_SUCCESS:
      return { ...state, rooms: action.payload }
    case types.GET_CHAT_ROOMS_ERROR:
      return { ...state, rooms: action.payload }
    case types.GET_CHAT_MESSAGE_SUCCESS:
      return { ...state, messages: action.payload }
    case types.GET_USER_SUCCESS:
      return { ...state, users: action.payload }
    case types.GET_UNREAD_MESSAGE_COUNT:
      return { ...state, unread: action.payload }
    case types.GET_GROUP_CHAT_ROOMS:
      return {
        ...state,
        groupChatRooms: action.payload,
      }
    case 'SET_BLOCK_FLAG':
      return {
        ...state,
        block_flag: action.payload,
      }
    case 'SET_SELECT_CHATROOMID': {
      return {
        ...state,
        sel_chatroomid: action.payload,
      }
    }
    case 'UNREAD_MESSAGE':
      return { ...state, unreadMessage: action.payload }
    default:
      return state
  }
}
export default ChatReducer
