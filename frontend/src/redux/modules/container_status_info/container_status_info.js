import container_status_info, {
  actions as simple_actions,
  private_actions,
  selectors,
  BASE_SELECTOR_PATH,
  ACTION_TYPES
} from "./container_status_info_simple";
import * as thunk_actions from "./container_status_info_thunks";

export const actions = Object.assign({}, simple_actions, thunk_actions);

import { inject_reducers } from "store/inject_reducers";
export default inject_reducers({ container_status_info });

export { selectors, BASE_SELECTOR_PATH, ACTION_TYPES, private_actions };
