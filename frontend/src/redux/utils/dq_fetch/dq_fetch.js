import Cookies from "js-cookie";
import defaultTo from "lodash/defaultTo";
import map from "lodash/map";
import merge from "lodash/merge";

export const DEFAULT_TIMEOUT = 90000;

const OK = 200;
const ERRORS = 300;
const UNAUTHORIZED = 401;
const FORBIDDEN = 403;
const NOT_FOUND = 404;

export function checkStatus(response = {}) {
  if (response.status >= OK && response.status < ERRORS) {
    return response;
  }

  if (response.status === UNAUTHORIZED || response.status === FORBIDDEN) {
    return response;
  }

  /**
   * Use normal object instead of error to reduce noise in our logs
   *
   * TODO: Exception passing for simple control flow is a bad code smell
   *
   */
  let throwable = {
    message: response.statusText,
    response: response,
    response_as_string: JSON.stringify(response)
  };
  throw throwable;
}

export function params_to_url(params) {
  const convert = (value, key) => key + "=" + window.encodeURIComponent(value);
  return "?" + map(params, convert).join("&");
}

export function ql_escape(text) {
  return text.replace(/"/g, '\\"');
}
// https://stackoverflow.com/questions/9577930/regular-expression-to-select-all-whitespace-that-isnt-in-quotes
const replace_spaces = /\s+(?=((\\[\\"]|[^\\"])*"(\\[\\"]|[^\\"])*")*(\\[\\"]|[^\\"])*$)/g;

export function dq_graphql(query, options = {}) {
  if (
    !query.includes("IntrospectionQuery") &&
    !query.includes("SendReferralInvite") &&
    !query.includes("SkipOnboarding")
  ) {
    // do not format these types
    query = query.replace(/{\n/g, "{");
    query = query.replace(/}\n/g, "}");
    query = query.replace(/\n/g, ",");
    query = query.replace(/\\"/g, '\\"');
    query = query.replace(replace_spaces, "");
  }
  options.post_obj = { query };
  const url = defaultTo(options.url, "/api/graphql/");
  return dq_fetch(url, options).then(response => {
    if (response.errors) {
      return Promise.reject(response.errors);
    }
    return response;
  });
}

/**
 * Wraps a list of queries (promises) and returns promise with
 * combined data once all queries are resolved
 *
 * Works best if data fields are not overlapping or have the same data for overlapping keys
 *
 * In case when a key has an array as a value, the arrays will be merged using index only
 * Thus it's important to be sure that data will arrive in the same order from API
 *
 * There are no safety checks added to avoid this as it will over-complicate the usage and
 * produce a deep-comparison of key-values between objects that can hinder the performance.
 * Such safety check also makes function less-generic.
 *
 * @param [{Promise<any>}] query_list
 * @returns {Promise<any>}
 */
export function dq_graphql_all(query_list) {
  return new Promise((resolve, reject) => {
    Promise.all(query_list.map(query => dq_graphql(query)))
      .then(results => {
        let data = results.length ? results[0] : {};

        if (results.length) {
          results.forEach((result, i) => {
            if (i !== 0) data = merge(data, result);
          });
        }

        resolve(data);
      })
      .catch(error => reject(error));
  });
}

/**
 * Wraps any promise and rejects automatically if the promise does not
 * resolve within the stipulated millisecond interval.
 *
 * @see https://stackoverflow.com/questions/46946380/fetch-api-request-timeout
 *
 * @param {number} ms
 * @param {Promise<any>} promise
 * @returns {Promise<any>}
 */
export function timeoutPromise(ms, promise) {
  return new Promise((resolve, reject) => {
    const timeoutId = setTimeout(() => {
      reject(new Error(`Timeout after ${ms} milliseconds`));
    }, ms);
    promise.then(
      res => {
        clearTimeout(timeoutId);
        resolve(res);
      },
      err => {
        clearTimeout(timeoutId);
        reject(err);
      }
    );
  });
}

/**
 * Wrapper to add a timeout parameter to fetch
 *
 * @param url
 * @param options
 * @param timeout
 */
export function dq_fetchTimeout(url, options = {}, timeout = DEFAULT_TIMEOUT) {
  return timeoutPromise(timeout, dq_fetch(url, options));
}

export default function dq_fetch(url, options = {}) {
  const {
    post_obj,
    get_params,
    redirect_url,
    type,
    return_raw,
    authorization,
    csrf,
    headers
  } = options;
  if (get_params) url = url + params_to_url(get_params);
  // the following is useful for testing
  const replace_url = options.replace_url || (r => window.location.replace(r));

  const p = new Promise((resolve, reject) => {
    const fetch_options = {
      credentials: "same-origin",
      headers: {}
    };

    if (headers) {
      fetch_options.headers = headers;
    }

    const outer_token = Cookies.getJSON("token");
    if (authorization) {
      fetch_options.headers.authorization = authorization;
    } else if (outer_token && outer_token.token) {
      fetch_options.headers.authorization = "Token " + outer_token.token;
    }

    if (post_obj) {
      fetch_options.method = "POST";
      fetch_options.body = JSON.stringify(post_obj);
      fetch_options.headers["Content-Type"] = "application/json";
    }
    if (type) {
      fetch_options.method = type.toUpperCase();
    }

    const csrf_token = Cookies.get("csrftoken");
    if (csrf && csrf_token) {
      fetch_options.headers["X-CSRFToken"] = csrf_token;
    }

    window
      .fetch(url, fetch_options)
      .then(checkStatus)
      .then(
        response => {
          if (return_raw) {
            resolve(response);
            return;
          }
          if (
            response.status !== UNAUTHORIZED &&
            response.status !== FORBIDDEN
          ) {
            response
              .json()
              .then(resolve)
              .catch(() => resolve({}));
          } else {
            // need for calls like reset_progress
            response
              .json()
              .then(data =>
                resolve({
                  unauthorized: true,
                  ...data.data
                })
              )
              .catch(reject);
          }
        },
        onError => {
          if (onError.response == null) {
            reject(onError);
            return;
          }

          const not_in_array = -1;
          const redirect =
            [NOT_FOUND].indexOf(onError.response.status) !== not_in_array;

          if (redirect_url && redirect) {
            replace_url(redirect_url);
          }
          reject(onError);
        }
      )
      .catch(reject);
  });
  return p;
}
