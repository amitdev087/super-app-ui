export const updateTransaction = transaction => {
    return{
        type: "UPDATE_TRANSACTION",
        payload: transaction,
    }
}

export const updateCompletedMerchantPayment = iscompleted => {
    return{
        type: "UPDATE_COMPLETED_PAYMENT",
        payload: iscompleted,
    }
}

export const setLoggedInCustomer = custId => {
    return{
        type: "SET_LOGGEDIN_USER",
        payload: custId,
    }
}