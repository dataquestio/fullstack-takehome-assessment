// dependencies
import React from "react";
import {connect} from "react-redux";
import {createStructuredSelector} from "reselect";
import {replace as replace_route} from "react-router-redux";
import {FaCode} from "react-icons/fa";

// components
import {
  Card, CardBody,
} from 'reactstrap';
import {Link} from "react-router-dom";

// select pieces of redux state
export const selectors = {};

// select redux actions
export const actions = {
  replace_route
};

const mapStateToProps = createStructuredSelector(selectors);

/**
 * CodeSandboxView
 *
 * An internal sketchpad to build components and test ideas
 */
class CodeSandboxView extends React.Component {
  render() {
    return (
      <div className="p-4">
        <div className="w-1/4">
          <Card>
            <CardBody>
              <div className="flex items-center">
                <FaCode className="text-xl mr-1"/>
                <a
                  href="https://github.com/dataquestio/test-app/blob/master/src/views/CodeSandboxView/CodeSandboxView.js"
                  className="font-body text-emerald-green text-xl font-medium m-0"
                  target="_blank"
                  rel="noopener"
                >
                  Code Sandbox
                </a>
              </div>
            </CardBody>
          </Card>
        </div>
        <Link
          to="/"
          className="inline-block mt-3"
        >
          View Main Page
        </Link>
      </div>
    );
  }
}

export default connect(
  mapStateToProps,
  actions
)(CodeSandboxView);
