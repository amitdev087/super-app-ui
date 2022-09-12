// import { act } from "@testing-library/react";

import { act } from "@testing-library/react";

const initialState = {
    transactionList: [],
    isMerchantPaymentCompleted: false,
    merchantPaymentMessage:""
}

export default function (state = initialState, action) {
    console.log("INside reducer", action.type);
    console.log("State inside reducer is ", state.transactionList);
    console.log("received state is ", action.payload);
    switch (action.type) {
        case "UPDATE_TRANSACTION":
            return {
                transactionList: action.payload,
                isMerchantPaymentCompleted: state.isMerchantPaymentCompleted,
                merchantPaymentMessage:state.merchantPaymentMessage
            }
        case "UPDATE_COMPLETED_PAYMENT":
            console.log("State will be updated to ", action.payload);
            return {
                isMerchantPaymentCompleted: action.payload[0],
                transactionList: state.transactionList,
                merchantPaymentMessage:action.payload[1]
            }

        default:
            return state;
    }
}