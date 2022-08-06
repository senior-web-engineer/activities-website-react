import React from "react";
import ReactDOM from "react-dom";
import App from "./components/App";
import { createStore, applyMiddleware, compose } from "redux";
import rootReducers from "./Store/Reducers/rootReducer";
import { Provider } from "react-redux";
import thunk from "redux-thunk";
import { reactReduxFirebase } from "react-redux-firebase";
import firebase from "./services/firebase";
import { unregister } from "./serviceWorker";
import { ThemeProvider } from "@material-ui/styles";
import Themes from "./themes";
import "./i18n.js";

const createStoreWithFirebase = compose(reactReduxFirebase(firebase))(
  createStore
);

const store = createStoreWithFirebase(
  rootReducers,
  compose(applyMiddleware(thunk))
);

store.subscribe(() => {
  localStorage.setItem("store", JSON.stringify(store.getState().app));
  sessionStorage.setItem("store", JSON.stringify(store.getState().app));
});

unregister();

ReactDOM.render(
  <Provider store={store}>
    <ThemeProvider theme={Themes.default}>
      <App />
    </ThemeProvider>
  </Provider>,
  document.getElementById("root")
);
