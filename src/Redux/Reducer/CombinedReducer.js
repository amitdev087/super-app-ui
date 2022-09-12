import { combineReducers } from "redux";
import TransactionReducer from "./TransactionReducer";

const allReducers = combineReducers({
    transaction:TransactionReducer
})

export default allReducers;