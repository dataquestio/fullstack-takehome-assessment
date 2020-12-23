import React, { Component, createRef } from "react";
import PropTypes from "prop-types";
import isEmpty from "lodash/isEmpty";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import { Terminal as Term } from "xterm";
import { FitAddon } from "xterm-addon-fit";
import * as SocketIO from "socket.io-client";
import LoadingWithMessage from "components/common/LoadingWithMessage";
import ResizeSensor from "components/common/ResizeSensor";
import "xterm/css/xterm.css";

import {
  selectors as terminal_selectors,
  actions as terminal_actions
} from "redux/modules/terminal_info";

export const selectors = {
  ...terminal_selectors,
};
export const actions = terminal_actions;

const mapStateToProps = createStructuredSelector(selectors);

/**
 * @param path
 * @param token
 * @param port
 * @param ip
 *
 * @returns {Socket}
 */
const createSocket = ({ path, token, port, ip }) => {
  return SocketIO.connect();
};

const initialState = {
  isConnected: false
};

class Terminal extends Component {
  constructor(props, context) {
    super(props, context);

    this.container = createRef();
    this.socket = null;
    this.xterm = null;
    this.fitAddon = null;
  }

  state = initialState;

  componentDidMount() {
    this.initializeTerminal();
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.readyForSocket()) {
      this.connectSocket();
    }

    if (this.requiresDisconnect()) {
      this.resetTerminal();
    }
  }

  componentWillUnmount() {
    this.xterm.dispose();
    this.destroySocket();
  }

  /**
   *
   * @returns {boolean}
   */
  readyForSocket = () => {
    return this.props.connection_info && this.socket === null;
  };

  /**
   *
   * @returns {boolean}
   */
  requiresDisconnect = () => {
    return this.props.connection_info === null && this.socket !== null;
  };

  initializeTerminal = () => {
    this.xterm = new Term({
      cursorBlink: true,
      fontFamily: "source-code-pro,Menlo,Monaco,Ubuntu Mono,Consolas,monospace",
      rendererType: "dom"
    });
    this.fitAddon = new FitAddon();

    this.xterm.loadAddon(this.fitAddon);
    this.xterm.open(this.container);
    this.fitAddon.fit();
  };

  /**
   * 1) Recreate the xterm instance
   * 2) Destroy the currently open socket
   * 3) Reset the initial state of the component.
   */
  resetTerminal = () => {
    // This needs to go first so that we reset connection info
    this.props.reset_terminal();

    this.xterm.dispose();
    this.fitAddon = null;
    this.destroySocket();

    this.initializeTerminal();
    this.setState(initialState);
  };

  /**
   * Creates a socket to our xterm backend.
   *
   * Adds handlers for sending data between xterm and the backend.
   *
   */
  connectSocket = () => {
    const socket = createSocket(this.props.connection_info);

    socket.on("connect", () => {
      this.setIsConnected(true);

      // This ensures that a student is always greeted with a prompt
      // If we don't do this, the terminal appears blank until the student
      // creates input
      this.xterm.focus();
      socket.on("xterm_data", data => {
        if (isEmpty(data)) {
          return;
        }
        this.xterm.write(data);
      });
    });

    socket.on("reconnect_failed", () => {
      this.destroySocket();
    });

    this.xterm.onData(data => {
      socket.emit("xterm_input", data);
    });

    this.socket = socket;
  };

  /**
   * Destroys an open socket to the backend.
   *
   * Removes local listeners.
   *
   * Updates the connected status of the application
   *
   *
   */
  destroySocket = () => {
    if (this.socket === null) {
      return;
    }

    this.socket.removeAllListeners();
    this.socket.disconnect();

    this.socket = null;

    this.setIsConnected(false);
  };

  /**
   * Set the connected state as stipulated
   *
   * @param connected
   */
  setIsConnected = connected => {
    this.setState({
      isConnected: connected
    });
  };

    /**
   *
   * Fit terminal to container size
   *
   */
  onResize = () => {
    this.fitAddon.fit();
  };

  renderLoadingMessage = () => {
    const { isConnected } = this.state;

    return (
      !isConnected && (
        <LoadingWithMessage
          className="z-10 bg-light-purple"
          style={{ background: "#d1d1e1" }}
          message="Initializing the command line terminal"
        />
      )
    );
  };

  render() {
    return (
      <>
        <p className="bg-white">Status: {this.state.isConnected ? <span className="text-success">connected</span> :
          <span className="text-danger">disconnected</span>}</p>
        <div className="h-full">
          <div
            className="h-full p-0.5r"
            ref={ref => (this.container = ref)}
          />
          {this.renderLoadingMessage()}
          <ResizeSensor debounce onResize={this.onResize}/>
        </div>
      </>
    );
  }
}

Terminal.propTypes = {
  // socket
  connection_info: PropTypes.shape({
    status: PropTypes.string,
  }),

  shell_check: PropTypes.shape({
    success: PropTypes.bool.isRequired
  }).isRequired,

  // Dispatches
  reset_terminal: PropTypes.func.isRequired,
};

export default connect(
  mapStateToProps,
  actions
)(Terminal);
