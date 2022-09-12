export const updateTransaction = transaction => {
    console.log("Inside action",transaction);
    return{
        type: "UPDATE_TRANSACTION",
        payload: transaction,
    }
}