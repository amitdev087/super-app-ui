import React, { Component } from 'react'
import CryptoJS from 'crypto-js'
import axios from "axios";

export default class ListCustomers extends Component {

    constructor(props) {
        super(props);

        this.state = {
            customerslist: [],
            selectedIds: [],
            amount: 0,
            merchantsList: [],
            selectedMerchant: ""
        }
        this.makeRequest = this.makeRequest.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.createGroup = this.createGroup.bind(this);
        this.handleClickAmount = this.handleClickAmount.bind(this);
        this.makeMerchantRequest = this.makeMerchantRequest.bind(this);
        this.handleClickMerchant = this.handleClickMerchant.bind(this);
        this.makePaymentEwallet = this.makePaymentEwallet.bind(this);
    }

    async componentDidMount() {
        await this.makeMerchantRequest();
    }

    async makeMerchantRequest() {
        console.log("Inside makemerchant");
        const headers = {
            "Content-Type": `application/json`
        };

        const request = {
            baseURL: "http://127.0.0.1:8000/getMerchant/",
            headers,
            method: 'get',
        };
        const response = await axios(request);
        console.log(response.data)
        var responsecustomers = []
        response.data.forEach(element => {
            var customer = element
            if (customer.ewallet != "") {
                responsecustomers.push(customer)
            }
        });

        this.setState({ merchantsList: responsecustomers }, () => {
            console.log("merchant = ", this.state.merchantsList)
        })
    }

    async makeRequest() {
        const headers = {
            "Content-Type": `application/json`
        };

        const request = {
            baseURL: "http://127.0.0.1:8000/countries/",
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

    createGroup = async () => {
        var totalCustomerCount = this.state.selectedIds.length + 1;
        var finalamount = this.state.amount - ((this.state.amount)/(totalCustomerCount))
        var gpbody = {
            amount: finalamount.toString(),
            ids: this.state.selectedIds
        }

        console.log("finalbody is ", gpbody);
        const headers = {
            "Content-Type": `application/json`
        };

        const request = {
            baseURL: "http://127.0.0.1:8000/createPayment/",
            headers,
            data: gpbody,
            method: 'post',
        };

        const response = await axios(request);
        console.log(response.data)
    }


    makePaymentEwallet = async () => {
        var ewalletpaymentbody = {
            amount: this.state.amount.toString(),
            ids: this.state.selectedMerchant
        }

        console.log("finalbody ewalletpaymentbody is ", ewalletpaymentbody);
        const headers = {
            "Content-Type": `application/json`
        };

        const request = {
            baseURL: "http://127.0.0.1:8000/accountTransfer/",
            headers,
            data: ewalletpaymentbody,
            method: 'post',
        };

        const response = await axios(request);
        console.log(response.data)
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

    handleClickMerchant = (e) => {
        e.preventDefault();
        console.log(e.target.value);
        this.setState({
            selectedMerchant: e.target.value
        }, () => (console.log('merchantClick 👉️', this.state.selectedMerchant)))
    }

    render() {
        console.log(this.state.customerslist);
        let merchants;
        let clickedMerchant;
        let makePaymentEwallet;
        if (this.state.selectedMerchant == "") {
            clickedMerchant = "";
            console.log("inside render for merhcant ", this.state.merchantsList);
            merchants = <ul>
                {this.state.merchantsList.map((merchant) => <label key={merchant.ewallet}>
                    <input
                        type="radio"
                        name="lang"
                        value={merchant.ewallet}
                        onChange={this.handleClickMerchant}
                    /> {merchant.name}
                </label>)}
            </ul>
        }
        else {
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
        }

        let button;
        if (this.state.selectedIds.length > 0) {
            button = <button onClick={this.createGroup}> Create Group </button>;
        }
        console.log("button value is :", this.state.selectedIds > 0);
        let finalamount;
        if (this.state.amount > 0) {
            finalamount = <div><div>ListCustomers</div>
                <button onClick={this.makeRequest} label="Get customers">Get customers</button>
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
        }
        if (this.state.amount > 0 && this.state.selectedIds.length > 0 && this.state.selectedMerchant != ""){
            makePaymentEwallet = <button onClick={this.makePaymentEwallet} label="Make Payment to Merchant">Make Payment to Merchant</button>
        }
            return (

                <div>
                    {merchants}
                    {clickedMerchant}
                    {finalamount}
                    {makePaymentEwallet}

                </div>
            )
    }
}
