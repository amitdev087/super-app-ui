import React, { Component, Fragment } from "react";
import ModalPopup from "../Models/modal-popup";
import CryptoJS from "crypto-js";
import axios from "axios";
import "react-bootstrap";
import SplitIt from "./splitIt";
import { Link } from "react-router-dom";
export default class SalarySplit extends Component {
  constructor(props) {
    super(props);
    this.state = {
      customerslist: [],
      selectedIds: [],
      amount: 0,
      merchantsList: [],
      selectedMerchant: "",
      showModalPopup: false,
      pendingResponse: {},
    };
   this.makeRequest = this.makeRequest.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.createSalaryGroup = this.createSalaryGroup.bind(this);
    this.handleClickAmount = this.handleClickAmount.bind(this);
   // this.makeMerchantRequest = this.makeMerchantRequest.bind(this);
    //this.handleClickMerchant = this.handleClickMerchant.bind(this);
    //this.makePaymentEwallet = this.makePaymentEwallet.bind(this);
    this.isShowPopup = this.isShowPopup.bind(this);
  }
  owingList = ["Split Salary Equally", "Pay Salary Indiviually "];
  handleClickOwingOption = (e) => {
    //e.preventDefault();
    console.log(e.target.value);
    this.setState(
      {
        owingOption: e.target.value,
      },
      () => console.log("owing option is 👉️", this.state.owingOption)
    );
  };

  createSalaryGroup = async () => {
    var owingOption = this.state.owingOption;
    var totalCustomerCount = this.state.selectedIds.length;
    if (owingOption == 1) {
      var individualAmount = this.state.amount / totalCustomerCount;
    } else {
      var individualAmount = this.state.amount;
    }
    var finalbody = [];
    var gpbody = {
      amount: individualAmount.toString(),
      ids: this.state.selectedIds,
    };
    console.log("finalbody is ", gpbody);
    const headers = {
      "Content-Type": `application/json`,
    };

    const request = {
      baseURL: "http://127.0.0.1:8000/createSalaryPayment/",
      headers,
      data: gpbody,
      method: "post",
    };
    const response = await axios(request);
  };

  isShowPopup = (status) => {
    this.setState({ showModalPopup: status });
  };
  async componentDidMount() {
    //await this.makeMerchantRequest();
  }

  // async makeMerchantRequest() {
  //   console.log("Inside makemerchant");
  //   const headers = {
  //     "Content-Type": `application/json`,
  //   };

  //   const request = {
  //     baseURL: "http://127.0.0.1:8000/getMerchant/",
  //     headers,
  //     method: "get",
  //   };
  //   const response = await axios(request);
  //   console.log(response.data);
  //   var responsecustomers = [];
  //   response.data.forEach((element) => {
  //     var customer = element;
  //     if (customer.ewallet != "") {
  //       responsecustomers.push(customer);
  //     }
  //   });

  //   this.setState({ merchantsList: responsecustomers }, () => {
  //     console.log("merchant = ", this.state.merchantsList);
  //   });
  // }

  async makeRequest() {
    const headers = {
      "Content-Type": `application/json`,
    };

    const request = {
      baseURL: "http://127.0.0.1:8000/customers/",
      headers,
      method: "get",
    };
    const response = await axios(request);
    console.log(response.data);
    var responsecustomers = [];
    response.data["data"].forEach((element) => {
      var customer = element;
      if (customer.ewallet != "") {
        responsecustomers.push(customer);
      }
    });

    this.setState({ customerslist: responsecustomers }, () => {
      console.log("csutomers = ", this.state.customerslist);
    });
  }

  // makePaymentEwallet = async () => {
  //   var ewalletpaymentbody = {
  //     amount: this.state.amount.toString(),
  //     ids: this.state.selectedMerchant,
  //   };

  //   console.log("finalbody ewalletpaymentbody is ", ewalletpaymentbody);
  //   const headers = {
  //     "Content-Type": `application/json`,
  //   };

  //   const request = {
  //     baseURL: "http://127.0.0.1:8000/accountTransfer/",
  //     headers,
  //     data: ewalletpaymentbody,
  //     method: "post",
  //   };

  //   const response = await axios(request);
  //   console.log(response.data);
  //   this.setState({ pendingResponse: response.data }, () => {
  //     console.log(this.state.pendingResponse);
  //   });
  //   if ((response.status = 200)) {
  //     this.isShowPopup(true);
  //   }
  // };

  handleChange = (e) => {
    const { value, checked } = e.target;
    var presentIds = this.state.selectedIds;

    if (checked) {
      presentIds = [...presentIds, value];
    } else {
      presentIds = presentIds.filter((x) => x !== value);
    }
    console.log("present ids are ", presentIds);
    this.setState({
      selectedIds: presentIds,
    });
  };

  handleClickAmount = (e) => {
    e.preventDefault();
    this.setState({
      amount: e.target.value,
    });
    console.log("handleClick 👉️", this.state.amount);
  };

  // handleClickMerchant = (e) => {
  //   e.preventDefault();
  //   console.log(e.target.value);
  //   this.setState(
  //     {
  //       selectedMerchant: e.target.value,
  //     },
  //     () => console.log("merchantClick 👉️", this.state.selectedMerchant)
  //   );
  // };

  render() {
    //console.log(this.state.customerslist);
    //let merchants;
    let clickedMerchant;
    let makePaymentEwallet;
    let transactionsSplit;
    {
      transactionsSplit = (
        <div>
          <div>Select Split Type</div>
          <ul>
            {this.owingList.map((opt, idx) => (
              <label key={idx + 1}>
                <input
                  type="radio"
                  name="lang"
                  value={idx + 1}
                  onChange={this.handleClickOwingOption}
                ></input>
                <p> {opt} </p>
              </label>
            ))}
          </ul>
        </div>
      );
    }
    {
      clickedMerchant = (
        <div>
          <input
            type="number"
            id="amount"
            name="amount"
            onChange={this.handleClickAmount}
            autoComplete="off"
          />
          <h2>Amount: {this.state.amount}</h2>
        </div>
      );
    }

    let button;
    if (this.state.selectedIds.length > 0) {
      button = <button onClick={this.createSalaryGroup}> Create Group </button>;
    }
    console.log("button value is :", this.state.selectedIds > 0);
    let finalamount;
    if (this.state.amount > 0) {
      finalamount = (
        <div>
          <div>ListCustomers</div>
          <button onClick={this.makeRequest} label="Get customers">
            Get customers
          </button>
          <ul>
            {this.state.customerslist.map((customer) => (
              <label key={customer.id}>
                <input
                  type="checkbox"
                  name="lang"
                  value={customer.id}
                  onChange={this.handleChange}
                />{" "}
                {customer.name}
              </label>
            ))}
          </ul>
          <div>{button}</div>
        </div>
      );
    }
    if (
      this.state.amount > 0 &&
      this.state.selectedIds.length > 0 &&
      this.state.selectedMerchant != ""
    ) {
      makePaymentEwallet = (
        <button
          onClick={this.makePaymentEwallet}
          label="Make Payment to Merchant"
        >
          Make Payment to Merchant
        </button>
      );
    }
    return (
      <div>
        <div>
          {/* {merchants} */}
          {transactionsSplit}
          {clickedMerchant}
          {finalamount}
          {makePaymentEwallet}
        </div>
      </div>
    );
  }
}
