import React, { Component } from 'react'
import CryptoJS from 'crypto-js'
import axios from "axios";

export default class ListCustomers extends Component {

    constructor(props) {
        super(props);

        // Initializing the state 
        this.state = { color: 'lightgreen' };
    }

    componentDidMount() {
        this.makeRequest()
    }
    makeRequest() {
        // const CryptoJS = require("crypto-js");

        const salt = CryptoJS.lib.WordArray.random(12); // Randomly generated for each request.
        const timestamp = (Math.floor(new Date().getTime() / 1000) - 10).toString(); // Current Unix time (seconds).
        const access_key = "94FBABD5DA7F959BC979"; // The access key from Client Portal.
        const secret_key = "672d23cd5b3c8602c472bceaab2d17323c6ac92e13a61e0e8d099756f622994cb394f3a1f2de7d5e"; // Never transmit the secret key by itself.
        const url_path = "/v1/data/countries"; // Portion after the base URL.
        const baseURL = "https://sandboxapi.rapyd.net";
        // Hardkeyed for this example.
        const http_method = "get"; // get|put|post|delete - must be lowercase.
        const data = ""; // Stringified JSON without whitespace.
        // Always empty string for GET;

        console.log(salt)
        const getSignature = () => {
            const to_sign =
                http_method +
                url_path +
                salt +
                timestamp +
                access_key +
                secret_key +
                data;
            let signature = CryptoJS.enc.Hex.stringify(
                CryptoJS.HmacSHA256(to_sign, secret_key)
            );

            signature = CryptoJS.enc.Base64.stringify(
                CryptoJS.enc.Utf8.parse(signature)
            );

            return signature;
        };

        var idempotency = new Date().getTime().toString();
        var signature = getSignature()
        const headers = {        
            "Content-Type": `application/json`,
            "access_key": access_key,
            "signature": signature,
            // "salt": salt.toString(),
            // "timestamp": timestamp,
            // "idempotency" : idempotency,
            "Access-Control-Allow-Headers":"salt",  
            "Access-Control-Allow-Headers":"*"
        };

        console.log(headers)

        //   const request = {
        //     baseURL: "https://sandboxapi.rapyd.net",
        //     headers,
        //     url: url_path,
        //     method: http_method,
        //     data,
        //   };
        // fetch(baseURL + url_path, {
        //     headers: headers,
        //     method: "get"
        // })
        //     .then((response) => response.json())
        //     .then((data) => console.log(data));
        var finURL = baseURL + url_path
        axios.get(finURL, {
            headers: headers
        }).then((response) => {
            // setPost(response.data);
            console.log(response.data)
        });
    }


    render() {
        return (
            <div>ListCustomers</div>
        )
    }
}
