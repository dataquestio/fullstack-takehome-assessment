// react
import React from "react";
import PropTypes from "prop-types";
// redux
import { Provider as ReduxProvider, connect } from "react-redux";
import { ConnectedRouter, replace as replace_route } from "react-router-redux";
// apollo
import ApolloClient from "apollo-client";
import { ApolloLink } from "apollo-link";
import { HttpLink } from "apollo-link-http";
import { InMemoryCache } from "apollo-cache-inmemory";
import { ApolloProvider } from "react-apollo";
// TODO verify that this different import doesn't break rest of the apollo usage
// utils
import Cookies from "js-cookie";
import get from "lodash/get";
// styles
import '../styles/tailwind.css';
import 'bootstrap/dist/css/bootstrap.css';

import { actions as container_status_actions } from "redux/modules/container_status_info";
import Routes from "routes/routes";


export const actions = {
  replace_route,
  start_container: container_status_actions.start_container
};

// set authorization header for graphql queries and mutations
class AuthLink extends ApolloLink {
  request(operation, forward) {
    // get user token from cookie
    const user_token = get(Cookies.getJSON("token"), ["token"], "");
    if (user_token) {
      // update context for current request
      operation.setContext(({ headers }) => ({
        headers: {
          ...headers,
          authorization: `Token ${user_token}`
        }
      }));
    }

    return forward(operation);
  }
}

// setup apollo middleware
const ApolloMiddleware = ApolloLink.from([
  new AuthLink(),
  new HttpLink({ uri: "/api/graphql" })
]);

// setup apollo cache
const cache = new InMemoryCache();

// create apollo client instance
export const client = new ApolloClient({
  link: ApolloMiddleware,
  cache
});

export class Root extends React.Component {
  static propTypes = {
    history: PropTypes.object.isRequired,
    store: PropTypes.object.isRequired,
    start_container: PropTypes.func.isRequired,
  };

  static defaultProps = {
    document_search_params: () => document.location.search
  };

  constructor(props) {
    super(props);
    this.props.start_container();
  }

  render() {
    const { store, history } = this.props;

    return (
      <ApolloProvider client={client}>
        <ReduxProvider store={store}>
          <ConnectedRouter history={history}>
            <div className="min-h-full">
              <Routes />
            </div>
          </ConnectedRouter>
        </ReduxProvider>
      </ApolloProvider>
    );
  }
}

export default connect(state => {return {}}, actions)(Root);
