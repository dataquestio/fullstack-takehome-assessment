import React from "react";
import PropTypes from "prop-types";
import cn from "classnames";
import { Spinner } from 'reactstrap';

export class LoadingWithMessage extends React.PureComponent {
  static propTypes = {
    message: PropTypes.string,
    className: PropTypes.string,
    style: PropTypes.string,
    smaller: PropTypes.bool,
    loaderColor: PropTypes.string
  };
  static defaultProps = {
    message: "Loading"
  };

  render() {
    return (
      <div
        className={cn(
          "meta-font absolute top-0 left-0 h-full w-full",
          "text-center text-gray-black leading-4r",
          "vertical-center !bg-light-purple-transparent",
          this.props.smaller ? "text-2r" : "text-4r",
          this.props.className
        )}
        style={this.props.style}
      >
        <div>{this.props.message}</div>
        <div>
          <Spinner type="grow" color="secondary" />
          <Spinner type="grow" color="secondary" />
          <Spinner type="grow" color="secondary" />
        </div>
      </div>
    );
  }
}

export default LoadingWithMessage;
