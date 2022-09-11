import React, { Component, Fragment } from "react";
import ModalPopup from "../Models/modal-popup";
import CryptoJS from "crypto-js";
import axios from "axios";
import "react-bootstrap";
import SplitIt from "./splitIt";
import { Link } from "react-router-dom";
import '../styles/salarySplit.css'
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
    await this.makeRequest();
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
      if (customer.ewallet != "" && customer.id != "cus_5dedc9d323b7928b256317886173bbca") {
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
        <div className='transaction_list_wrapper' style={{padding:'2px',textAlign:"center"}}>
          <div  >Select Split Type</div>
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
      );
    }
    {
      clickedMerchant = (
        <div className='form-group' style={{marginTop:"15"}}>
          <input
            type="number"
            id="amount"
            min={0}
            name="amountTotal"
            onChange={this.handleClickAmount}
            autoComplete="off"
            className="form-control"
            placeholder='Enter Amount'
          />
          {/* <h2>Amount: {this.state.amount}</h2> */}
        </div>
      );
    }

    let button;
    if (this.state.selectedIds.length > 0) {
      button = <button className='button_primary' onClick={this.createSalaryGroup}> Pay Salaries </button>;
    }
    console.log("button value is :", this.state.selectedIds > 0);
    let finalamount;
    if (this.state.amount > 0) {
      finalamount = (
        <div className='transaction_list_wrapper'>
          {/* <div>ListCustomers</div> */}
        
            
          <h5>Select Employe's</h5>
          <hr></hr>
          <ul className='grid_listcustomers'>
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
      <div  className='container' style={{ padding: '2rem', width: '60%' }}>
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
