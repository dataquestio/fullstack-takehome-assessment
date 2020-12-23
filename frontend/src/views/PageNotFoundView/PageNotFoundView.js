import React from "react";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";

import NotThereSplash from "components/unique/NotThereSplash";


export const actions = {};
export const selectors = {};

const mapStateToProps = createStructuredSelector(selectors);

export class PageNotFoundView extends React.PureComponent {
  render() {
    return (
      <div className="scroller">
        <NotThereSplash />
      </div>
    );
  }
}

export default connect(
  mapStateToProps,
  actions
)(PageNotFoundView);
