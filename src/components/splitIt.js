import React, { Component, Fragment } from 'react'
import ModalPopup from '../Models/modal-popup';
import CryptoJS from 'crypto-js'
import axios from "axios";
import 'react-bootstrap';


export default class SplitIt extends Component {
    constructor(props) {
        super(props);
        this.state = {
            customerslist: [],
            selectedIds: [],
            amount: 0,
            showModalPopup: false,
            pendingResponse: {},
            transactionList: [],
            owesYou:""
        }

        this.handleChange = this.handleChange.bind(this);
        this.createSplit = this.createSplit.bind(this);
        this.handleClickAmount = this.handleClickAmount.bind(this);
        this.getTransactions = this.getTransactions.bind(this);
        this.makeRequest = this.makeRequest.bind(this);
        this.checkOwes = this.checkOwes.bind(this);
        this.showName = this.showName.bind(this);
    }

    componentDidMount() {
        this.getTransactions();
        this.makeRequest();
    }


    async getTransactions() {
        const headers = {
            "Content-Type": `application/json`
        };

        const request = {
            baseURL: "http://127.0.0.1:8000/transactionList/",
            headers,
            method: 'get',
        };
        const response = await axios(request);
        console.log(response.data)
        var responseTransactions = []
        response.data.forEach(element => {
            var transaction = element
            responseTransactions.push(transaction)

        });

        this.setState({ transactionList: responseTransactions }, () => {
            console.log("transactions = ", this.state.transactionList)
        })
    }

    async makeRequest() {
        const headers = {
            "Content-Type": `application/json`
        };

        const request = {
            baseURL: "http://127.0.0.1:8000/customers/",
            headers,
            method: 'get',
        };
        const response = await axios(request);
        console.log(response.data)
        var responsecustomers = []
        response.data['data'].forEach(element => {
            var customer = element
            if (customer.ewallet != "") {
                responsecustomers.push(customer)
            }
        });

        this.setState({ customerslist: responsecustomers }, () => {
            console.log("csutomers = ", this.state.customerslist)
        })
    }

    
    showName(x){
        var custDetails = this.state.customerslist
        for(var ele in custDetails){
            if(custDetails[ele].id == x){
                return custDetails[ele].name
            }
        }
    }

    createSplit = async () => {
        var totalCustomerCount = this.state.selectedIds.length + 1;
        var individualAmount = ((this.state.amount) / (totalCustomerCount))
        var finalbody = [];

        this.state.selectedIds.forEach((x) => {
            var name = this.showName(x);
            console.log("SHow name is ***********",name)
            var individualBody = {
                source: x,
                amount: individualAmount.toString(),
                destination: "cus_79737ddadfa895a92de55d311b496cc2",
                name: this.showName(x)
            }
            finalbody.push(individualBody);
        })
        console.log("finalbody is ", finalbody);
        const headers = {
            "Content-Type": `application/json`
        };

        const request = {
            baseURL: "http://127.0.0.1:8000/transactionList/",
            headers,
            data: finalbody,
            method: 'post',
        };
        const response = await axios(request);
        console.log(response.data)
        if(response.status == 201){
            await this.getTransactions();
        }
    }

    handleChange = (e) => {
        const { value, checked } = e.target;
        var presentIds = this.state.selectedIds;

        if (checked) {
            presentIds = [...presentIds, value]
        } else {
            presentIds = presentIds.filter(x => x !== value)
        }
        console.log("present ids are ", presentIds);
        this.setState({
            selectedIds: presentIds
        })
    }
    handleClickAmount = (e) => {
        e.preventDefault();
        this.setState({
            amount: e.target.value
        })
        console.log('handleClick 👉️', this.state.amount);
    }

    checkOwes(sentAmount){
        if(parseInt(sentAmount)>0){
            // this.setState({
            return  " owes you "
            // })
        }
        else{
            // this.setState({
            return " is owed "
            // })
        }
    }

    render() {
        console.log(this.state.customerslist);
        let merchants;
        let clickedMerchant;
        let makePaymentEwallet;
        let transactionsSplit;
        if (this.state.transactionList.length <= 0) {
            transactionsSplit = <div>No transactions yet</div>
        }
        else {
            transactionsSplit = <div><div>TransactionList</div>
                <ul>
                    {this.state.transactionList.map((transaction) => <label key={transaction.name}>
                        <li
                            name="lang"
                            value={transaction.source}
                            onChange={this.handleChange}
                        > 
                        <p>{transaction.name} {this.checkOwes(transaction.amount)} {transaction.amount} USD</p>
                        </li>
                    </label>)}
                </ul>
                {/* <div>{button}</div> */}
            </div>
        }
        clickedMerchant = <div>
            <input
                type="number"
                id="amount"
                name="amount"
                onChange={this.handleClickAmount}
                autoComplete="off"
            />

            <h2>Amount: {this.state.amount}</h2>
        </div>

        let button;
        if (this.state.selectedIds.length > 0) {
            button = <button onClick={this.createSplit}> Create Group </button>;
        }
        console.log("button value is :", this.state.selectedIds > 0);
        let finalamount;
        // if (this.state.amount > 0) {
        finalamount = <div><div>ListCustomers</div>
            <ul>
                {this.state.customerslist.map((customer) => <label key={customer.id}>
                    <input
                        type="checkbox"
                        name="lang"
                        value={customer.id}
                        onChange={this.handleChange}
                    /> {customer.name}
                </label>)}
            </ul>
            <div>{button}</div>
        </div>
        // }
        return (
            <div>
                <div>
                    {transactionsSplit}
                    {merchants}
                    {clickedMerchant}
                    {finalamount}

                </div>
                <div>
                </div>
            </div>
        )
    }
}
