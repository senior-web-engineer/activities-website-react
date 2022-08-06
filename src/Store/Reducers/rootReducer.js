import { combineReducers } from "redux";
import catReducer from "./catReducer";
import listReducer from "./listingReducer";
import testiReducer from "./testiReducer";
import logoReducer from "./logoReducer";
import authReducer from "./authReducer";
import appReducer from "./appReducer";
import imageReducer from "./imageReducer";
import chatReducer from "./chatReducer";
import { favouriteReducer } from "./favourite";
import { bankReducer } from "./bankReducer";
import widgetReducer from "./widgetReducer";
import staffReducer from "./staffReducer";
import blogReducer from "./blogReducer";
import basicReducer from "./basicReducer";
import dashboardReducer from "./dashboardReducer";

const rootReducer = combineReducers({
  app: appReducer,
  auth: authReducer,
  category: catReducer,
  staff: staffReducer,
  dashboard: dashboardReducer,
  list: listReducer,
  testimonial: testiReducer,
  logo: logoReducer,
  widget: widgetReducer,
  image: imageReducer,
  favourite: favouriteReducer,
  chat: chatReducer,
  bank: bankReducer,
  blog: blogReducer,
  basic: basicReducer,
});
export default rootReducer;
