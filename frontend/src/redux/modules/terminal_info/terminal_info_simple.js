import Immutable from "seamless-immutable";
import { make_simple_selectors, make_reducer_n_actions } from "redux_helpers";
import { ACTION_TYPES as CONTAINER_TYPES } from "../container_status_info";

// -------
// Initial State
// --------

const initial_state = {
  latest_data: {},
  size: {
    cols: 80,
    rows: 24
  },
  connection_info: null,
  shell_check: {
    start_time: null,
    running: false,
    success: false,
    has_result: false,
    failed_run: false,
  },
};

// -------
// Selectors
// --------
const BASE = "terminal_info";
export { BASE as BASE_SELECTOR_PATH };

const simple_selectors = make_simple_selectors(initial_state, BASE);

export const selectors = {
  ...simple_selectors
};

// ------------------------------------
// Reducer and Actions
// ------------------------------------
const action_types_prefix = "terminal_info/";

const public_handlers = {
  reset: () => {
    return Immutable(initial_state);
  },
};

const private_handlers = {
  resize_event: (state, { payload: { data } }) => {
    return state.merge({
      size: data
    });
  },
  check_result: (state, { payload: { check } }) => {
    const checkResult = {
      running: false,
      success: state.shell_check.success || check,
      has_result: true,
      failed_run: false,
    };

    let newState = {
      shell_check: checkResult
    };

    return state.merge(newState, { deep: true });
  },
  fail_shell_check: state =>
    state.merge(
      {
        shell_check: {
          running: false,
          has_result: state.shell_check.success || false,
          failed_run: true
        }
      },
      { deep: true }
    ),
  data_event: (state, { payload }) => {
    return state.merge({
      latest_data: payload
    });
  },
  reset_connection_info: (state, { payload }) => {
    return state.merge({
      connection_info: null
    });
  },
  setup_shell: (state, { payload }) => {
    return Immutable({
      ...initial_state,
      size: state.size,
      connection_info: state.connection_info
    });
  }};

const other_handlers = {
  [CONTAINER_TYPES.legacy_update]: (state, { payload }) => {
    return state.merge({
      connection_info: {
        status: payload.status,
      }
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
  other_handlers,
  action_types_prefix,
  initial_state,
  Immutable
});
export default reducer;
