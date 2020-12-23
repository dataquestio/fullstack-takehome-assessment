import React from "react";

import TerminalPanels from "components/terminal/TerminalPanels";

export const selectors = {};

export default class CLIView extends React.PureComponent {
  render() {
    return <div><TerminalPanels/></div>;
  }
}
