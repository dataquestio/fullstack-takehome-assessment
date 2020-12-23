import {
  private_actions,
  selectors,
  ACTION_TYPES
} from "./terminal_info_simple";

import { actions as container_actions } from "redux/modules/container_status_info";
import {
  messageEndpoint,
  processMessage
} from "../code-runner-interface/process-message";

const MESSAGE_TYPE_RESIZE = "post/term_js/events/resize";
const MESSAGE_TYPE_CHECKING = "post/term_js/events/check";

export const resize = size => (dispatch, getState) => {
  processMessage(
    messageEndpoint(),

    {
      type: MESSAGE_TYPE_RESIZE,
      payload: {
        data: size,
      }
    }
  )
    .then(() => {
      dispatch(
        private_actions.resize_event({
          data: size
        })
      );
    })
    .catch(err => {
      console.error(err);
    });
};

export const reset_terminal = () => (dispatch, getState) => {
  dispatch(private_actions.reset_connection_info());
  dispatch(private_actions.setup_shell());

  dispatch(container_actions.reset_container());
};
