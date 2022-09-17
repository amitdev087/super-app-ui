import React, { Component, Fragment } from "react";
import ModalPopup from "../Models/modal-popup";
import CryptoJS from "crypto-js";
import axios from "axios";
import "react-bootstrap";
import SplitIt from "./splitIt";
import { Link } from "react-router-dom";
import "../styles/salarySplit.css";
import LoadingSpinner from "./LoadingSpinner";
import { setLoggedInCustomer } from "../Redux/Actions/TransactionsActions";
import { connect } from "react-redux";
import Header from "./header";

class SalarySplit extends Component {
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
      isLoading: false,
      buttonEnable: true,
      responseMessage: "",
      customerLoads: true,
    };
    this.FailedUser = "cus_616804c7789f0342bd7664a5fa78f3b9";
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
    this.setState({
      isLoading: true,
      buttonEnable: false,
    });
    console.log("inside create salary grpu[");
    console.log(
      this.state.isLoading,
      "isloading  gggggggggggggggggggggggggggggggg"
    );
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
    if (response.status == 201) {
      this.setState({
        isLoading: false,
        responseMessage: "Salaries Paid",
      });
    } else {
      this.setState({
        isLoading: false,
        responseMessage: "failed to pay the salary",
      });
    }
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
      if (customer.ewallet != "" && customer.id != this.props.custId) {
        responsecustomers.push(customer);
      }
    });

    this.setState(
      {
        customerLoads: false,
        customerslist: responsecustomers.filter((x) => x.id != this.FailedUser),
      },
      () => {
        console.log("csutomers = ", this.state.customerslist);
      }
    );
  }



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
        <div
          className="transaction_list_wrapper"
          style={{ padding: "2px", textAlign: "center" }}
        >
          <div>Select Split Type</div>
          <select
            className="dropdown_splitoption"
            onChange={this.handleClickOwingOption}
          >
            {this.owingList.map((opt, idx) => (
              <option
                className="dropdown_splitoption"
                key={opt}
                type="radio"
                name="lang"
                value={idx + 1}
              >
                {opt}
              </option>
            ))}
          </select>
        </div>
      );
    }
    {
      clickedMerchant = (
        <div className="form-group" style={{ marginTop: "15" }}>
          <input
            type="number"
            id="amount"
            min={0}
            name="amountTotal"
            onChange={this.handleClickAmount}
            autoComplete="off"
            className="form-control"
            placeholder="Enter Amount"
          />
          {/* <h2>Amount: {this.state.amount}</h2> */}
        </div>
      );
    }

    let button;
    if (this.state.selectedIds.length > 0) {
      button = (
        <button className="button_primary" onClick={this.createSalaryGroup}>
          {" "}
          Pay Salaries{" "}
        </button>
      );
    }
    console.log("button value is :", this.state.selectedIds > 0);
    let finalamount;
    if (this.state.amount > 0) {
      if (
        this.state.customerLoads
          ? (finalamount = (
            <div className="transaction_list_wrapper">
              <LoadingSpinner />
            </div>
          ))
          : (finalamount = (
            <div className="transaction_list_wrapper">
              <h5>Select Friends</h5>
              <hr></hr>
              {/* <button onClick={this.makeRequest} label="Get customers">Get list of Friends</button> */}
              <ul className="grid_listcustomers">
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
          ))
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
      <div><Header />
        <div className="container" style={{ padding: "2rem", width: "60%" }}>
          <div>
            <div disabled={!this.state.buttonEnable}>
              {transactionsSplit}
              {clickedMerchant}
              {finalamount}
            </div>

            {this.state.responseMessage != "" || this.state.isLoading == true ? (
              <div className="transaction_list_wrapper">
                {this.state.isLoading ? (
                  <LoadingSpinner />
                ) : (
                  <p>{this.state.responseMessage}</p>
                )}
              </div>
            ) : (
              <div></div>
            )}
            {/* {makePaymentEwallet} */}
          </div>
        </div>
      </div>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    custId: state.transaction.custId,
  };
};
export default connect(mapStateToProps, {
  setLoggedInCustomer,
})(SalarySplit);
