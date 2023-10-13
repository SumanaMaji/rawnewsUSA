import { Transaction } from "../../models/transaction-model";

const initialState = {
    transaction:Transaction,
    allTransactions:[]
}

const transactionReducer = (state = initialState, action) => {
    return state;
}

export default transactionReducer;