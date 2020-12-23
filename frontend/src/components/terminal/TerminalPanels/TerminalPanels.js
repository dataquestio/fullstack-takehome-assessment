import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";

import Terminal from "components/terminal/Terminal";

import {
  actions as terminal_actions,
  selectors as terminal_selectors
} from "redux/modules/terminal_info";

export const selectors = {
  shell_check: terminal_selectors.shell_check,
};
export const actions = {
  ...terminal_actions
};

const mapStateToProps = createStructuredSelector(selectors);

const KEEP_ALIVE_RATE = 10000; // 10 seconds

export class TerminalPanels extends React.Component {
  static propTypes = {
    // from redux
    shell_check: PropTypes.shape({
      running: PropTypes.bool.isRequired,
      success: PropTypes.bool.isRequired,
      has_result: PropTypes.bool.isRequired,
      failed_run: PropTypes.bool.isRequired
    }).isRequired,

    // actions
    reset_terminal: PropTypes.func.isRequired,
    // depedences
    get_appVersion: PropTypes.func.isRequired
  };
  static defaultProps = {
    get_appVersion: () => window.navigator.appVersion
  };

  componentWillUnmount() {
    window.clearInterval(this._keep_alive);
  }

  componentDidMount() {
    this._keep_alive = window.setInterval(
      this.props.keep_alive,
      KEEP_ALIVE_RATE
    );
  }

  onReset = () => {
    this.props.reset_terminal();
  };

  render() {
    return (
      <div
        className="bg-black flex flex-wrap h-full w-full absolute"
      >
        <div className="code flex-1 max-w-full">
          <Terminal/>
        </div>
      </div>
    );
  }
}

export default connect(
  mapStateToProps,
  actions
)(TerminalPanels);
