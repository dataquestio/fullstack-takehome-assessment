import React from "react";

import "./NotThereSplash.scss";

export class NotThereSplash extends React.PureComponent {
  static defaultProps = {};

  render_text() {
    return <h1 className="text-white">Page not found</h1>
  }

  render() {
    return (
      <div styleName="root">
        <div styleName="sky">
          <div styleName="info">
            {this.render_text()}
          </div>
        </div>
      </div>
    );
  }
}

export default NotThereSplash;
