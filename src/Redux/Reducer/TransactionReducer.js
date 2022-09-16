// import { act } from "@testing-library/react";

import { act } from "@testing-library/react";

const initialState = {
    transactionList: [],
    isMerchantPaymentCompleted: false,
    merchantPaymentMessage:"",
    custId:""
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
                merchantPaymentMessage:state.merchantPaymentMessage,
                custId:state.custId
            }
        case "UPDATE_COMPLETED_PAYMENT":
            console.log("State will be updated to ", action.payload);
            return {
                isMerchantPaymentCompleted: action.payload[0],
                transactionList: state.transactionList,
                merchantPaymentMessage:action.payload[1],
                custId : state.custId
            }
        case "SET_LOGGEDIN_USER":
            console.log("State will be updated to ", action.payload);
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
