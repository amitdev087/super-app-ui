export const updateTransaction = transaction => {
    console.log("Inside action",transaction);
    return{
        type: "UPDATE_TRANSACTION",
        payload: transaction,
    }
}

export const updateCompletedMerchantPayment = iscompleted => {
    console.log("Inside action",iscompleted);
    return{
        type: "UPDATE_COMPLETED_PAYMENT",
        payload: iscompleted,
    }
}

export const setLoggedInCustomer = custId => {
    console.log("Inside action",custId);
    return{
        type: "SET_LOGGEDIN_USER",
        payload: custId,
    }
}