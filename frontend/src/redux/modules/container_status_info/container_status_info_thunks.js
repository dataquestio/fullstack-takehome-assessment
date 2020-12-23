import {
  private_actions,
  selectors,
  ACTION_TYPES
} from "./container_status_info_simple";

import {
  messageEndpoint,
  processMessage,
  processMessageResults
} from "../code-runner-interface/process-message";

const MESSAGE_TYPE_START = "post/setup";
const MESSAGE_TYPE_RESET = "post/reset";
const ACTION_TYPE_MAP = {
  "push/status": ACTION_TYPES.update,
  "push/connect/data": ACTION_TYPES.legacy_update,
  "error/validation": ACTION_TYPES.error,
  "error/runtime": ACTION_TYPES.error
};

export const start_container = payload => (dispatch, getState) => {
  dispatch(private_actions.start_setup());
  processMessage(messageEndpoint(), {
    type: MESSAGE_TYPE_START,
    payload
  })
    .then(responses => {
      processMessageResults(dispatch, responses, ACTION_TYPE_MAP);
    })
    .catch(() => {
      dispatch({
        type: ACTION_TYPES.error,
        payload: {
          message: "There was an error starting the container"
        }
      });
    });
};

export const reset_container = () => (dispatch, getState) => {
  if (selectors.requesting_setup(getState())) return; // already doing something

  dispatch(private_actions.start_setup());
  processMessage(messageEndpoint(), {
    type: MESSAGE_TYPE_RESET,
  })
    .then(responses => {
      processMessageResults(dispatch, responses, ACTION_TYPE_MAP);
    })
    .catch(() => {
      dispatch({
        type: ACTION_TYPES.error,
        payload: {
          message: "There was an error resetting the container"
        }
      });
    });
};
