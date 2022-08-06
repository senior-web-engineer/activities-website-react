// var item = localStorage.getItem('login');
const initState = {
  payment_data: [],
  cartCnt: 0,
  calendar_data: [],
  myBooking_lists: [],
  adv_notification: [],
  unreadMsg: 0,
  cartData: [],
  orderList: [],
  userOrderList: [],
  activityData: [],
  admin_coupon: [],
};

const widgetReducer = (state = initState, action) => {
  switch (action.type) {
    case "GET_PAYMENT_METHOD":
      return {
        ...state,
        payment_data: action.payload,
      };
    case "GET_CART_INFO":
      return {
        ...state,
        cartData: action.payload,
      };
    case "SET_CALENDAR_DATA":
      return {
        ...state,
        calendar_data: action.payload,
      };
    case "MY_BOOKING_LISTS":
      return {
        ...state,
        myBooking_lists: action.payload,
      };
    case "ADVERTISER_NOTIFICATION":
      return {
        ...state,
        adv_notification: action.payload.notificationCnt,
        unreadMsg: action.payload.msgCnt,
      };
    case "SET_ORDER_LIST":
      return {
        ...state,
        orderList: action.payload.orderList,
        activityData: action.payload.activityData,
      };
    case "USER_ORDER_LIST":
      return {
        ...state,
        userOrderList: action.payload,
      };
    case "SET_ADMIN_COUPON":
      return {
        ...state,
        admin_coupon: action.payload,
      };
    default:
      return state;
  }
};
export default widgetReducer;
