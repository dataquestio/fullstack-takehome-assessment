import { default as createStore } from "store/createStore";
import { routerReducer as routing } from "react-router-redux";

describe("(Store) createStore", () => {
  let store;

  before(() => {
    store = createStore();
  });

  it("should have an asyncReducers object with just routing", () => {
    expect(store.asyncReducers).to.be.eql({ routing });
  });
});
