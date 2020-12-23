import fetchMock from "fetch-mock";
import Cookies from "js-cookie";
import isString from "lodash/isString";

const org_mock = fetchMock.mock;
fetchMock.mock = () => {
  throw new Error(
    "dq_fetch_mock needs dq_fetch_mock.setup(sandbox) called first"
  );
};

function setup(sandbox, cookie = { username: "testing" }) {
  const getJSON = sandbox.stub(Cookies, "getJSON");
  getJSON.withArgs("token").returns(cookie);
  sandbox.stub(fetchMock, "mock").callsFake(org_mock);
  sandbox.stub(console, "warn").callsFake(message => {
    if (!isString(message) || message.indexOf("unmatched call to") === -1) {
      return;
    }
    throw new Error(message);
  });
}

fetchMock.setup = setup;
fetchMock.url_on_call = call_num => {
  if (fetchMock.calls().matched[call_num] == null) {
    throw new Error(`call number ${call_num} did not happen`);
  }
  return fetchMock.calls().matched[call_num][0];
};
fetchMock.options_on_call = call_num => {
  if (fetchMock.calls().matched[call_num] == null) {
    throw new Error(`call number ${call_num} did not happen`);
  }
  return fetchMock.calls().matched[call_num][1];
};
fetchMock.graphql_on_call = call_num => {
  if (!fetchMock.url_on_call(call_num).includes("/graphql")) {
    throw new Error("Not a graphql call");
  }
  return JSON.parse(fetchMock.options_on_call(call_num).body).query;
};

export default fetchMock;
