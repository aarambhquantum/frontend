import { all, takeLatest } from "redux-saga/effects";

function doSomething() {
    // code goes here
}

function* actionWatcher() {
  yield takeLatest("action-type", doSomething);
}

export function* sampleSaga() {
  yield all([actionWatcher()]);
}