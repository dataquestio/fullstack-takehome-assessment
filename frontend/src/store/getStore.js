import createStore from "./createStore.js";

// ========================================================
// Store Instantiation
// ========================================================
const initialState = window.___INITIAL_STATE__;
window.__STORE__ = createStore(initialState);

export default () => window.__STORE__;
