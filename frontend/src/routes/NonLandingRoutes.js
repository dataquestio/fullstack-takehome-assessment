import React from "react";
import { Route, Switch } from "react-router-dom";

import page_not_found from "views/PageNotFoundView";
import CodeSandboxView from "views/CodeSandboxView";
import CLIView from "views/CLIView";

const NonLoadingRoutes = () => (
  <Switch>
    <Route path="/cli-sandbox" component={CLIView} />
    <Route path="/code-sandbox" component={CodeSandboxView} />

    <Route component={page_not_found} />
  </Switch>
);

export default NonLoadingRoutes;
