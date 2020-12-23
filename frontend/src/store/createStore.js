import { applyMiddleware, compose, createStore } from "redux";
import thunk from "redux-thunk";
import { routerMiddleware, routerReducer as routing } from "react-router-redux";
import createHistory from "history/createBrowserHistory";
import { make_root_reducer } from "store/inject_reducers";
import actionsBlacklist from "./redux_extension_blacklist";

export default (initialState = {}) => {
  const browserHistory = createHistory();

  // ======================================================
  // Middleware Configuration
  // ======================================================
  const middleware = [
    thunk,
    routerMiddleware(browserHistory),
  ];

  // ======================================================
  // Store Enhancers
  // ======================================================
  const enhancers = [];
  const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
    ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
        actionsBlacklist
      })
    : compose;

  // ======================================================
  // Store Instantiation and HMR Setup
  // ======================================================
  const init_reducers = { routing };
  const store = createStore(
    make_root_reducer(init_reducers),
    initialState,
    composeEnhancers(applyMiddleware(...middleware), ...enhancers)
  );
  store.asyncReducers = init_reducers;
  store.history = browserHistory;

  return store;
};
