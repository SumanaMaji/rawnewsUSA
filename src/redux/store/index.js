import { createStore, applyMiddleware, compose } from "redux";
import { batchedSubscribe } from "redux-batched-subscribe";
import createSagaMiddleware from "@redux-saga/core";
import thunk from "redux-thunk";
import { initSagas } from "redux/sagas";
import debounce from "lodash.debounce";
import rootReducer from "../reducers";

const sagaMiddleware = createSagaMiddleware();
const debounceNotify = debounce((notify) => notify());

const enhancer = compose(
  //applyMiddleware(thunk, sagaMiddleware),
  applyMiddleware(thunk),
  batchedSubscribe(debounceNotify)
);
const store = createStore(rootReducer, enhancer);

//initSagas(sagaMiddleware);

export default store;