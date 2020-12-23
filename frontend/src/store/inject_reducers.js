import { combineReducers } from "redux";

export const make_root_reducer = asyncReducers => {
  return combineReducers(asyncReducers);
};

export const inject_reducers = reducer_map => {
  const store = window.__STORE__;
  store.asyncReducers = {
    ...store.asyncReducers,
    ...reducer_map
  };

  const reducer = make_root_reducer(store.asyncReducers);
  store.replaceReducer(reducer);
  return reducer;
};
