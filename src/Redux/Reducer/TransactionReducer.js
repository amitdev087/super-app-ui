// import { act } from "@testing-library/react";

import { act } from "@testing-library/react";

const initialState = {
    transactionList : []
}

export default function(state = initialState, action){
    console.log("INside reducer",action.type);
    console.log("State inside reducer is ",state.transactionList);
    console.log("received state is ",action.payload);
    switch(action.type){
        case "UPDATE_TRANSACTION":
            return {transactionList: action.payload}

        default:
            return state;
    }
}