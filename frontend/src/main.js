import React from "react";
import ReactDOM from "react-dom";
import getStore from "store/getStore";
const store = getStore();

// https://developers.google.com/search/docs/guides/debug-rendering
// window.addEventListener('error', function (e) {
//   var errorText = [
//     'version: ' + __VERSION__,
//     e.message,
//     'URL: ' + e.filename,
//     'Line: ' + e.lineno + ', Column: ' + e.colno,
//     'Stack: ' + ((e.error && e.error.stack) || '(no stack trace)'),
//   ].join('\n')

//   // Example: log errors as visual output into the host page.
//   // Note: you probably don’t want to show such errors to users, or
//   //       have the errors get indexed by Googlebot however, it may
//   //       be a useful feature while actively debugging the page.
//   var DOM_ID = 'rendering-debug-pre'
//   if (!document.getElementById(DOM_ID)) {
//     var log = document.createElement('pre')
//     log.id = DOM_ID
//     log.style.whiteSpace = 'pre-wrap'
//     log.textContent = errorText
//     if (!document.body) document.body = document.createElement('body')
//     document.body.insertBefore(log, document.body.firstChild)
//   } else {
//     document.getElementById(DOM_ID).textContent += '\n\n' + errorText
//   }
// })

// import(/* webpackMode: "eager" */ 'entry/Root').then((mod) => {
// const Root = mod.default
import Root from "entry/Root";

window.React = React; // needed for graphiql

// ========================================================
// Render Setup
// ========================================================
// TODO use https://github.com/gaearon/react-hot-loader

const MOUNT_NODE = document.getElementById("root");

let render = () => {
  ReactDOM.render(<Root store={store} history={store.history} />, MOUNT_NODE);
};

if (module.hot) {
  // Development render functions
  const renderApp = render;
  const renderError = error => {
    const RedBox = require("redbox-react").default;

    ReactDOM.render(<RedBox error={error} />, MOUNT_NODE);
  };

  // Wrap render in try/catch
  render = () => {
    try {
      renderApp();
    } catch (error) {
      renderError(error);
    }
  };

  // Setup hot module replacement
  module.hot.accept("./routes", () =>
    setImmediate(() => {
      ReactDOM.unmountComponentAtNode(MOUNT_NODE);
      render();
    })
  );
}

// ========================================================
// Go!
// ========================================================
render();
// })
