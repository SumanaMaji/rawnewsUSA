import {delay} from "redux-saga/effects"

export function* testSaga(){
    while (true) {
        yield delay(1000);
        console.log("I am a saga function");
    }
    
}

export function* count(){
    yield 1;
    yield 2;
    return 3;
}