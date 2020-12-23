import Immutable from "seamless-immutable";
import { createSelector } from "reselect";
import toString from "lodash/toString";
import { make_simple_selectors, make_reducer_n_actions } from "redux_helpers";

import { CONNECTED_STATUS_READY } from "../../../helpers/constants";

// -------
// Initial State
// --------

const initial_state = {
  connected: false,
  connected_since: null,
  retry_count: 0,
  state: "starting",
  error_message: "",
  requesting_setup: false
};

// -------
// Selectors
// --------
const BASE = "container_status_info";
export { BASE as BASE_SELECTOR_PATH };

const simple_selectors = make_simple_selectors(initial_state, BASE);

export const selectors = {
  ...simple_selectors,
};

// ------------------------------------
// Reducer and Actions
// ------------------------------------
const action_types_prefix = "container_status_info/";

const public_handlers = {
  reset: () => Immutable(initial_state)
};

const private_handlers = {
  start_setup: state =>
    state.merge({
      ...initial_state,
      requesting_setup: true,
      retry_count: state.retry_count + 1
    }),
  update: (state, { payload }) =>
    state.merge({
      state: payload.status,
      connected: payload.status === CONNECTED_STATUS_READY,
      connected_since: Date.now(),
      requesting_setup: false
    }),
  legacy_update: (state, { payload }) =>
    state.merge({
      status: payload.runner.status,
      requesting_setup: false
    }),
  error: (state, { payload }) => {
    return state.merge({
      connected: false,
      error_message: payload.message,
      state: "dead",
      requesting_setup: false
    });
  }
};

export const {
  reducer,
  private_actions,
  actions,
  ACTION_TYPES
} = make_reducer_n_actions({
  public_handlers,
  private_handlers,
  action_types_prefix,
  initial_state,
  Immutable
});
export default reducer;
