const initState = {
  lineChartData: {},
  barChartData: null,
  reviewsData: [],
  balance: {},
  activities: [],
  cntActivities: null,
};

const dashboardReducer = (state = initState, action) => {
  switch (action.type) {
    case "SET_LINE_CHART":
      return {
        ...state,
        lineChartData: action.payload,
      };
    case "SET_BAR_CHART_DATA":
      return {
        ...state,
        barChartData: action.payload,
      };
    case "SET_MY_REVIEWS":
      return {
        ...state,
        reviewsData: action.payload,
      };
    case "SET_BALANCE_INFO": {
      return {
        ...state,
        balance: action.payload,
      };
    }
    case "SET_DASHBOARD_INFO": {
      return {
        ...state,
        activities: action.payload,
      };
    }
    case "SET_CLAIM_LIST": {
      return {
        ...state,
        cntActivities: action.payload,
      };
    }
    default:
      return state;
  }
};
export default dashboardReducer;
