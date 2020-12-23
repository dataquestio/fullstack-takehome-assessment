import { REDIRECT_AFTER_LOGOUT_URL } from "./constants";

const window_location = {
  redirect: path => window.location.replace(path),

  open_in_new_tab: (path = "") => {
    window.open(path, "_blank");
  },

  get_query_variable: variable => {
    var query = window.location.search.substring(1);
    var vars = query.split("&");
    for (var i = 0; i < vars.length; i++) {
      var pair = vars[i].split("=");
      if (decodeURIComponent(pair[0]) === variable) {
        return decodeURIComponent(pair[1]);
      }
    }
    if (__DEV__) console.warn("Query variable %s not found", variable);
    return null;
  },

  get_path: () => {
    return window.location.pathname;
  },

  get_path_and_query: () => {
    return window.location.pathname + window.location.search;
  },

  redirect_to_path: (path = "") => {
    window.location = path;
  },

  redirect_grandparent: url => {
    window.parent.parent.location = url;
  },

  get_hash: () => {
    return window.location.hash;
  },

  redirect_after_logout: () => {
    window.location.replace(REDIRECT_AFTER_LOGOUT_URL);
  },

  isIframe: () => {
    return window_location.get_hash() === "#iframe";
  }
};

export { window_location };
