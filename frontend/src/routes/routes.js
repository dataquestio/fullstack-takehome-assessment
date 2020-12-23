import React from "react";
import { Route, Switch} from "react-router-dom";

import NonLandingRoutes from "./NonLandingRoutes";

export class LandingRoutes extends React.Component {
  // cannot be Pure or router stops

  render() {
    return (
      <Switch>
        <Route>
          <Switch>
            <Route
              exact
              path="/"
              component={props => {
                props.history.push("/cli-sandbox");
                return null;
              }}
            />

            <Route component={NonLandingRoutes} />
          </Switch>
        </Route>
      </Switch>
    );
  }
}
export default LandingRoutes;
