import React, { Component, Fragment } from 'react'
import ModalPopup from '../Models/modal-popup';
import CryptoJS from 'crypto-js'
import axios from "axios";
import { Button } from 'react-bootstrap';
import 'react-bootstrap';
import '../styles/splitit.css'


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
            owesYou: "",
            owingOption: 1,
            showTransaction: false
            // you owe people - split equally -- 1
            // people owe you - split equally -- 2
            // you owe people full amount -- 3
            // people owe you full amount -- 4
        }


        this.handleChange = this.handleChange.bind(this);
        this.createSplit = this.createSplit.bind(this);
        this.handleClickAmount = this.handleClickAmount.bind(this);
        this.getTransactions = this.getTransactions.bind(this);
        this.makeRequest = this.makeRequest.bind(this);
        this.checkOwes = this.checkOwes.bind(this);
        this.showName = this.showName.bind(this);
        this.handleShowTransactions = this.handleShowTransactions.bind(this);
    }
    owingList = [
        "paid by you split equally",
        "paid by people split equally",
        "paid by someone, you owe full amount",
        "paid by you take full amount"
    ]

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
            if (customer.ewallet != "" && customer.id != "cus_5dedc9d323b7928b256317886173bbca") {
                responsecustomers.push(customer)
            }
        });

        this.setState({ customerslist: responsecustomers }, () => {
            console.log("csutomers = ", this.state.customerslist)
        })
    }


    showName(x) {
        var custDetails = this.state.customerslist
        for (var ele in custDetails) {
            if (custDetails[ele].id == x) {
                return custDetails[ele].name
            }
        }
    }

    createSplit = async () => {
        var owingOption = this.state.owingOption;
        var totalCustomerCount = this.state.selectedIds.length + 1;
        if (owingOption == 1) {
            var individualAmount = ((this.state.amount) / (totalCustomerCount))
        }
        else if (owingOption == 2) {
            var individualAmount = -((this.state.amount) / (totalCustomerCount))
        }
        else if (owingOption == 3) {
            var individualAmount = -(this.state.amount)
        }
        else {
            var individualAmount = (this.state.amount)
        }
        var finalbody = [];

        this.state.selectedIds.forEach((x) => {
            var name = this.showName(x);
            console.log("SHow name is ***********", name)
            var individualBody = {
                source: x,
                amount: individualAmount,
                destination: "cus_5dedc9d323b7928b256317886173bbca",
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
        if (response.status == 201) {
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

    handleClickOwingOption = (e) => {
        e.preventDefault();
        console.log(e.target.value);
        this.setState({
            owingOption: e.target.value
        }, () => (console.log('owing option is 👉️', this.state.owingOption)))
    }

    handleClickAmount = (e) => {
        e.preventDefault();
        this.setState({
            amount: e.target.value
        })
        console.log('handleClick 👉️', this.state.amount);
    }
    handleShowTransactions = (e) => {
        e.preventDefault();
        var showHide = this.state.showTransaction
        this.setState({
            showTransaction:!showHide
        })
        // console.log('handleClick 👉️', this.state.amount);
    }

    checkOwes(sentAmount) {
        if (parseInt(sentAmount) > 0) {
            return " owes you "
        }
        else {
            return " is owed "
        }
    }


    render() {
        console.log(this.state.customerslist);
        let merchants;
        let clickedMerchant;
        let makePaymentEwallet;
        let transactionsSplit;
        let splitType;
        let showOrHideTransactions = this.state.showTransaction;
        if (this.state.transactionList.length <= 0) {
            transactionsSplit = <div>No transactions yet</div>
        }
        else {
            
            showOrHideTransactions ? transactionsSplit = <div className='transaction_list_wrapper'><h2>Transaction List</h2>
                <ul>
                    {this.state.transactionList.map((transaction) =>
                        <li
                            className='single_transaction'
                            name="lang"
                            value={transaction.source}
                            onChange={this.handleChange}
                        >
                            <p className='p'><strong>{transaction.name}</strong> {this.checkOwes(transaction.amount)} {Math.abs(transaction.amount.toFixed(2))} USD</p>
                        </li>
                    )}
                </ul>
            </div> : transactionsSplit = <div></div>
        }
        splitType = <div className='transaction_list_wrapper' style={{padding:'2px'}}><h5>Select SPLIT Type</h5>
            <select className='dropdown_splitoption'  onChange={this.handleClickOwingOption}>
                {this.owingList.map((opt, idx) =>
                    <option
                    className='dropdown_splitoption'
                        key={opt}
                        type="radio"
                        name="lang"
                        value={idx + 1}
                        >
                            {opt}
                    </option>
                )}
            </select>
        </div>
        clickedMerchant = <div className='form-group'>
            <input
                type="number"
                id="amountTotal"
                onChange={this.handleClickAmount}
                className="form-control"
                placeholder='Enter Amount'
            />
        </div>

        let button;
        if (this.state.selectedIds.length > 0) {
            button = <button className='button_primary' onClick={this.createSplit}> Split It! </button>;
        }
        console.log("button value is :", this.state.selectedIds > 0);
        let finalamount;
        // if (this.state.amount > 0) {
        finalamount = <div className='transaction_list_wrapper'><h5>Select Friends</h5>
            <ul className='grid_listcustomers'>
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
            <div className='container' style={{ padding: '2rem', width: '60%' }}>
                <div>
                    {clickedMerchant}
                    {splitType}
                    {merchants}
                    {finalamount}
                    <button className='button_primary' onClick={this.handleShowTransactions}>{!this.state.showTransaction ? "View Transactions" : "Hide Transactions"}</button>
                    {transactionsSplit}

                </div>
                <div>
                </div>
            </div>
        )
    }
}
