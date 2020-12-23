import React from "react";
import PropTypes from "prop-types";
import debounce from "lodash/debounce";

// from https://github.com/jehoshua02/react-resize-sensor/blob/master/ResizeSensor.js

export class ResizeSensor extends React.PureComponent {
  static propTypes = {
    onResize: PropTypes.func.isRequired,
    debounce: PropTypes.bool
  };

  componentDidMount = () => {
    const wait = 200; // ms
    this._first_call_timer = window.setTimeout(this._handleResize, wait);

    let resizeHandler = this._handleResize;
    if (this.props.debounce) {
      resizeHandler = debounce(this._handleResize, wait);
    }

    this.refs.iframe.contentWindow.addEventListener("resize", resizeHandler);
  };

  componentWillUnmount = () => {
    window.clearTimeout(this._first_call_timer);
    this.refs.iframe.contentWindow.removeEventListener(
      "resize",
      this._handleResize
    );
  };

  _handleResize = () => {
    if (this.refs.iframe == null) return;
    // this approach stops react from outputing: Do not access .props of a DOM node
    const size = {
      height: this.refs.iframe.clientHeight,
      width: this.refs.iframe.clientWidth
    };

    window.requestAnimationFrame(() => this.props.onResize(size));
  };

  render() {
    return (
      <iframe
        ref="iframe"
        style={{
          height: "100%",
          width: "100%",
          border: "none",
          background: "transparent",
          position: "absolute",
          zIndex: -1,
          top: 0,
          left: 0
        }}
      />
    );
  }
}

export default ResizeSensor;
