import React from "react";
import DqLoadingComponent from "components/common/DqLoadingComponent";
import Loadable from "react-loadable";

export default Loadable({
  loader: () => import(/* webpackChunkName: "Terminal" */ "./Terminal"),
  loading: props => <DqLoadingComponent message="Loading" {...props} />
});
