import { all } from "redux-saga/effects";
import { sampleSaga } from "./sample";

export default function* rootSaga() {
  yield all([
    sampleSaga()
  ])
}