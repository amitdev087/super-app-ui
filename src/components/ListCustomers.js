import React, { Component } from 'react'
import CryptoJS from 'crypto-js'
import axios from "axios";

export default class ListCustomers extends Component {

    constructor(props) {
        super(props);

        this.state = {
            customerslist: []
        }
        this.makeRequest = this.makeRequest.bind(this);
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


    render() {
        console.log(this.state.customerslist);
        return (
            <div>
                {/* <div>{this.state.customerslist}</div> */}
                <div>ListCustomers</div>
                <button onClick={this.makeRequest} label="Get customers">Get customers</button>
                <ul>
                    {this.state.customerslist.map((customer) => {
                        console.log(customer);
                        return (
                            <div>
                                <button key={customer.id}>
                                    Name : {customer.name}
                                </button>
                            </div>
                        )
                    })}
                </ul>

            </div>
        )
    }
}
