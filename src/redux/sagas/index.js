import * as testSaga from "./test";

export function initSagas(sagaMiddleware) {
    Object.values(testSaga).forEach(sagaMiddleware.run.bind(sagaMiddleware));
}