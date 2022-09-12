// import { act } from "@testing-library/react";

import { act } from "@testing-library/react";

const initialState = {
    transactionList: [],
    isMerchantPaymentCompleted: false
}

export default function (state = initialState, action) {
    console.log("INside reducer", action.type);
    console.log("State inside reducer is ", state.transactionList);
    console.log("received state is ", action.payload);
    switch (action.type) {
        case "UPDATE_TRANSACTION":
            return {
                transactionList: action.payload,
                isMerchantPaymentCompleted: state.isMerchantPaymentCompleted
            }
        case "UPDATE_COMPLETED_PAYMENT":
            console.log("State will be updated to ", action.payload);
            return {
                isMerchantPaymentCompleted: action.payload,
                transactionList: state.transactionList
            }

        default:
            return state;
    }
}