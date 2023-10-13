import { TransactionImage } from "../../models/transactionimage-model";

const initialState = {
    transactionImage:TransactionImage,
    allTransactionImages:[]
}

const transactionImageReducer = (state = initialState, action) => {
    return state;
}

export default transactionImageReducer;