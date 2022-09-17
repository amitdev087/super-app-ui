
import { act } from "@testing-library/react";

const initialState = {
    transactionList: [],
    isMerchantPaymentCompleted: false,
    merchantPaymentMessage:"",
    custId:""
}

export default function (state = initialState, action) {
    switch (action.type) {
        case "UPDATE_TRANSACTION":
            return {
                transactionList: action.payload,
                isMerchantPaymentCompleted: state.isMerchantPaymentCompleted,
                merchantPaymentMessage:state.merchantPaymentMessage,
                custId:state.custId
            }
        case "UPDATE_COMPLETED_PAYMENT":
            return {
                isMerchantPaymentCompleted: action.payload[0],
                transactionList: state.transactionList,
                merchantPaymentMessage:action.payload[1],
                custId : state.custId
            }
        case "SET_LOGGEDIN_USER":
            return {
                isMerchantPaymentCompleted: state.isMerchantPaymentCompleted,
                transactionList: state.transactionList,
                merchantPaymentMessage:state.merchantPaymentMessage,
                custId:action.payload
            }

        default:
            return state;
    }
}
