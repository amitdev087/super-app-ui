import React, { Component } from 'react'
import CryptoJS from 'crypto-js'
import axios from "axios";

export default class ListCustomers extends Component {

    constructor(props) {
        super(props);

        this.state = {
            customerslist: [],
            selectedIds: [],
            amount: 0
        }
        this.makeRequest = this.makeRequest.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.createGroup = this.createGroup.bind(this);
        this.handleClickAmount = this.handleClickAmount.bind(this);
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

        // You can use any HTTP request library to make the request. Example: Axios
        const response = await axios(request);
        console.log(response.data)
        // for (var ele in response.data['data']){
        //     var customer = ele
        //     this.state.customerslist.push(customer)
        // }
        var responsecustomers = []
        response.data['data'].forEach(element => {
            var customer = element
            // console.log(responsecustomers)
            if (customer.ewallet != "") {
                responsecustomers.push(customer)
            }
        });

        this.setState({ customerslist: responsecustomers }, () => {
            console.log("csutomers = ", this.state.customerslist)
        })
    }

    createGroup = async() => {
        var gpbody = {
            amount :this.state.amount.toString(),
            ids : this.state.selectedIds
        }

        console.log("finalbody is ",gpbody);
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

    handleChange = (e) => {
        const { value, checked } = e.target;
        var presentIds = this.state.selectedIds;

        if (checked) {
            presentIds = [...presentIds, value]
        } else {
            // remove unchecked value from the list
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

    render() {
        console.log(this.state.customerslist);
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
        return (

            <div>

                <div>
                    <input
                        type="number"
                        id="amount"
                        name="amount"
                        onChange={this.handleClickAmount}
                        autoComplete="off"
                    />

                    <h2>Amount: {this.state.amount}</h2>

                    {/* <button onClick={this.handleClickAmount}>Click</button> */}
                </div>
                {/* <div>{this.state.customerslist}</div> */}
                {finalamount}

            </div>
        )
    }
}
