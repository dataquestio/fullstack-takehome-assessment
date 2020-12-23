import { DEFAULT_TIMEOUT, dq_fetchTimeout } from "../../utils/dq_fetch";
import { TimingData } from "./TimingData";
import get from "lodash/get";


/**
 * Get url for https message handler
 *
 * @returns {string}
 */
export function messageEndpoint() {
  return "/api/v1/code/runner/process-message/";
}

/**
 * Checks to make sure a message as a type and payload property
 *
 * @param message
 * @returns {boolean}
 */
function validateMessage(message) {
  if (!message.hasOwnProperty("type")) {
    console.error("Cannot process message without a type");
    return false;
  }

  if (!message.hasOwnProperty("payload")) {
    console.error("Cannot process message without a payload");
    return false;
  }

  return true;
}


/**
 * Creates a standard analytics object for tracking
 *
 * @param message
 * @param startTime
 * @param response
 * @param error
 */

/**
 *
 * @param message
 * @param {TimingData} timing
 * @param response
 * @param error
 */
function recordAnalytics(message, timing, response = null, error = null) {
  const analyticsData = {
    message_type: message.type,
    startTime: timing.startTime,
    endTime: timing.endTime,
    totalTime: timing.totalTime,
    transport_strategy: "https",
    error
  };
}

/**
 *
 * Wraps fetch specifically for the purposes of sending
 * messages to the process-message API.
 *
 * Automatically manages all analytics and tracking associated with
 * code running times.
 *
 * The process message endpoint returns an array of potential
 * message responses as it is possible for one message to lead
 * to several notable actions. This is legacy architecture. For
 * analytics purposes, the first response is the only thing we
 * need to record.
 *
 * TODO: Ensure that each message sent to the API invokes a single response
 *
 * @param url
 * @param message
 * @returns {Promise}
 */
export function processMessage(url, message, timeout = DEFAULT_TIMEOUT) {
  if (!validateMessage(message)) {
    return Promise.reject("Invalid message");
  }

  const timing = new TimingData().start();

  return dq_fetchTimeout(
    url,
    {
      post_obj: message
    },
    timeout
  )
    .then(responses => {
      timing.end();
      recordAnalytics(message, timing, responses[0]);

      return responses;
    })
    .catch(error => {
      timing.end();

      console.error(error);

      recordAnalytics(message, timing, null, error);

      throw error;
    });
}

/**
 *
 * Processes responses of the `processMessage`.
 * Dispatches required action based on response type.
 * Mapping between types and actions is recorded for each module in actionTypeMap.
 *
 * @param dispatch
 * @param responses
 * @param actionTypeMap
 * @param key required in some cases to signify exact launch of the action
 */
export function processMessageResults(
  dispatch,
  responses,
  actionTypeMap,
  key = null
) {
  responses.forEach(response => {
    if (actionTypeMap[response.type] !== undefined) {
      let dispatchData = {
        type: actionTypeMap[response.type],
        payload: response.payload
      };
      if (key != null) dispatchData.key = key;

      dispatch(dispatchData);
    }
  });
}
