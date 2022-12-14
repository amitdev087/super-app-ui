import React, { Component, Fragment } from "react";
import ModalPopup from "../Models/modal-popup";
import CryptoJS from "crypto-js";
import axios from "axios";
import { Button } from "react-bootstrap";
import "react-bootstrap";
import "../styles/splitit.css";
import { connect } from "react-redux";
import {
  updateTransaction,
  setLoggedInCustomer,
} from "../Redux/Actions/TransactionsActions";
import LoadingSpinner from "./LoadingSpinner";
import Header from "./header";
import { Link } from "react-router-dom";

class SplitIt extends Component {
  constructor(props) {
    super(props);
    this.state = {
      transactionGlobal: [],
      customerslist: [],
      selectedIds: [],
      amount: 0,
      showModalPopup: false,
      pendingResponse: {},
      transactionList: [],
      owesYou: "",
      owingOption: 1,
      showTransaction: true,
      showModalPopup: false,
      settleUpConfirmBody: {},
      isLoading: false,
      buttonEnable: true,
      responseMessage: "",
      selectedUserToPay: "",
      settleUpAmount: "",
      custId: "",
      settleUpResponseMassage: "",
      showSettleUpResponse: false,
      merchantPaymentStarted: false,
    };

    this.handleChange = this.handleChange.bind(this);
    this.createSplit = this.createSplit.bind(this);
    this.handleClickAmount = this.handleClickAmount.bind(this);
    this.getTransactions = this.getTransactions.bind(this);
    this.makeRequest = this.makeRequest.bind(this);
    this.checkOwes = this.checkOwes.bind(this);
    this.handlesettleUp = this.handlesettleUp.bind(this);
    this.showName = this.showName.bind(this);
    this.handleShowTransactions = this.handleShowTransactions.bind(this);
    this.isShowPopup = this.isShowPopup.bind(this);
  }
  owingList = [
    "paid by you split equally",
    "paid by people split equally",
    "paid by someone, you owe full amount",
    "paid by you take full amount",
  ];

  isShowPopup = (status) => {
    this.setState({ showModalPopup: status });
  };
  componentDidMount() {
    this.setState(
      {
        custId: localStorage.getItem("custId"),
      },
      () => {
        this.getTransactions();
        this.makeRequest();
      }
    );
  }

  async getTransactions() {
    const headers = {
      "Content-Type": `application/json`,
    };

    const finbody = {
      custId: this.state.custId,
    };


    const request = {
      baseURL: "http://127.0.0.1:8000/transactionData/",
      headers,
      data: finbody,
      method: "post",
    };
    const response = await axios(request);
    var responseTransactions = [];
    response.data.forEach((element) => {
      var transaction = element;
      responseTransactions.push(transaction);
    });
    this.props.updateTransaction(responseTransactions);

    this.setState(
      { transactionList: responseTransactions },
      () => {
      },
      () => {
      }
    );
  }

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
    var responsecustomers = [];
    response.data["data"].forEach((element) => {
      var customer = element;
      if (
        customer.ewallet != ""
      ) {
        responsecustomers.push(customer);
      }
    });

    this.setState({ customerslist: responsecustomers }, () => {
    });
  }

  async settleup(finalbody) {
    this.setState({
      showSettleUpResponse: false,
      merchantPaymentStarted: true
    })
    const headers = {
      "Content-Type": `application/json`,
    };

    const request = {
      baseURL: "http://127.0.0.1:8000/settleUp/",
      headers,
      data: finalbody,
      method: "post",
    };
    const response = await axios(request);
    if ((response.status = 201) && (response.data["message"] == "")) {
      this.isShowPopup(true);
      finalbody["id"] = response.data["id"];
      this.settleUpConfirmBody = finalbody;
    }
    if (((response.status = 201) && (response.data["message"] != ""))) {
      this.setState({
        showSettleUpResponse: true,
        settleUpResponseMassage: response.data["message"],
      });
    }
  }
  handlesettleUp = (e) => {
    var data = e.target.value;
    var transactionData = this.props.transactionGlobal.filter(
      (x) => x.source == data
    );
    var finalData = { ...transactionData[0] };
    finalData.amount = Math.abs(finalData.amount).toFixed(1);
    this.setState({
      settleUpAmount: finalData.amount,
    });
    this.settleup(finalData);
  };

  showName = (x) => {
    var custDetails = this.state.customerslist;
    for (var ele in custDetails) {
      if (custDetails[ele].id == x) {
        return custDetails[ele].name;
      }
    }
  };
  createSplit = async () => {
    this.setState({
      isLoading: true,
      buttonEnable: false,
    });
    var totalCustomerCount = this.state.selectedIds.length + 1;
    var individualAmount = this.state.amount / totalCustomerCount;

    var finalbody = [];

    this.state.selectedIds.forEach((x) => {
      var name = this.showName(x);
      var individualBody = {
        source: x,
        amount: individualAmount,
        destination: this.state.selectedUserToPay,
        name: this.showName(x),
        destinationName: this.showName(this.state.selectedUserToPay),
      };
      finalbody.push(individualBody);
    });
    const headers = {
      "Content-Type": `application/json`,
    };

    const request = {
      baseURL: "http://127.0.0.1:8000/transactionList/",
      headers,
      data: finalbody,
      method: "post",
    };
    const response = await axios(request);
    if (response.status == 201) {
      await this.getTransactions();
      this.setState({
        isLoading: false,
        responseMessage: "Added to spiltit",
      });
    } else {
      this.setState({
        isLoading: false,
        responseMessage: "failed to add to split it",
      });
    }
  };

  handleChange = (e) => {
    const { value, checked } = e.target;
    var presentIds = this.state.selectedIds;

    if (checked) {
      presentIds = [...presentIds, value];
    } else {
      presentIds = presentIds.filter((x) => x !== value);
    }
    this.setState({
      selectedIds: presentIds,
    });
  };

  handleClickOwingOption = (e) => {
    e.preventDefault();
    this.setState(
      {
        selectedUserToPay: e.target.value,
      }
    );
  };

  handleClickAmount = (e) => {
    e.preventDefault();
    this.setState({
      amount: e.target.value,
    });
  };
  handleShowTransactions = (e) => {
    e.preventDefault();
    var showHide = this.state.showTransaction;
    this.setState({
      showTransaction: !showHide,
    });
  };

  checkOwes(sentAmount) {
    if (parseInt(sentAmount) > 0) {
      return " owes you ";
    } else {
      return " is owed ";
    }
  }

  checkSettleUp(sentAmount, sourceCustomer) {
    if (parseInt(sentAmount) < 0) {
      return (
        <button
          className="button_primary"
          value={sourceCustomer}
          onClick={this.handlesettleUp}
        >
          settleUp
        </button>
      );
    }
  }

  render() {
    let merchants;
    let clickedMerchant;
    let makePaymentEwallet;
    let transactionsSplit;
    let splitType;
    let showOrHideTransactions = this.state.showTransaction;
    if (this.props.transactionGlobal.length <= 0) {
      transactionsSplit = <div>No transactions yet</div>;
    } else {
      showOrHideTransactions
        ? (transactionsSplit = (
          <div className="transaction_list_wrapper">
            <h2>Transaction List</h2>
            <ul>
              {this.props.transactionGlobal.map((transaction) => (
                <li
                  className="single_transaction"
                  name="lang"
                  value={transaction.source}
                  onChange={this.handleChange}
                >
                  <p className="p">
                    <strong>{transaction.name}</strong>{" "}
                    {this.checkOwes(transaction.amount)}{" "}
                    {Math.abs(transaction.amount).toFixed(2)} USD
                  </p>

                  {this.checkSettleUp(transaction.amount, transaction.source)}
                </li>
              ))}
            </ul>
          </div>
        ))
        : (transactionsSplit = <div></div>);
    }
    splitType = (
      <div className="transaction_list_wrapper" style={{ padding: "2px" }}>
        <h5>Select SPLIT Type</h5>
        <select
          className="dropdown_splitoption"
          onClick={this.handleClickOwingOption}
        >
          {this.state.customerslist.map((customer) => (
            <option
              className="dropdown_splitoption"
              key={customer.id}
              type="radio"
              name="lang"
              value={customer.id}
            >
              Paid by {customer.name} split equally
            </option>
          ))}
        </select>
      </div>
    );
    clickedMerchant = (
      <div className="form-group">
        <input
          type="number"
          id="amountTotal"
          min={0}
          onChange={this.handleClickAmount}
          className="form-control"
          placeholder="Enter Amount"
        />
      </div>
    );

    let button;
    if (this.state.selectedIds.length > 0) {
      this.buttonEnable = true;
    }
    if (this.buttonEnable) {
      button = (
        <button
          className="button_primary"
          onClick={this.createSplit}
          disabled={this.state.amount < 1 || this.state.amount == ""}
        >
          {this.state.amount > 0 ? "Split It!" : "Please enter amount"}
        </button>
      );
    }
    let finalamount;

    if (this.state.selectedUserToPay != "") {
      finalamount = (
        <div className="transaction_list_wrapper">
          <h5>Select Friends</h5>
          <ul className="grid_listcustomers">
            {this.state.customerslist.map((customer) => (
              <label
                key={customer.id}
                hidden={customer.id == this.state.selectedUserToPay}
              >
                <input
                  type="checkbox"
                  name="lang"
                  value={customer.id}
                  onChange={this.handleChange}
                />
                {customer.name}
              </label>
            ))}
          </ul>
          <div>{button}</div>
        </div>
      );
    }

    let paymentStatusFinal;
    if (this.state.merchantPaymentStarted) {
      if (!this.props.isMerchantPaymentCompleted && this.props.merchantPaymentMessage == "Payment Failed") {
        paymentStatusFinal =
          (
            <div className="transaction_list_wrapper">
              {this.props.merchantPaymentMessage}
            </div>
          )
      }
      else if (this.props.isMerchantPaymentCompleted && this.props.merchantPaymentMessage == "Payment Succeeded") {
        paymentStatusFinal = (<div className="transaction_list_wrapper">
          <p>Your payment was completed</p>
        </div>)
      }
    }
    return (
      <div><Header />
        {this.state.custId == "" || this.state.custId == null || this.state.custId == undefined
          ? <div className="login-form">
            <div>Please login</div>
            <button className="button_primary" style={{ width: "95%" }}>
              <Link
                to={{
                  pathname: "/login",
                }}
              >
                Go to Login
              </Link>
            </button>
          </div>
          :
          <div className="container" style={{ padding: "2rem", width: "60%" }}>
            <div>
              <div disabled={!this.state.buttonEnable}>
                {clickedMerchant}
                {splitType}
                {merchants}
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
              <button
                className="button_primary"
                onClick={this.handleShowTransactions}
              >
                {!this.state.showTransaction
                  ? "View Transactions"
                  : "Hide Transactions"}
              </button>
              {transactionsSplit}
              {paymentStatusFinal}
            </div>
            <div>
              <ModalPopup
                showModalPopup={this.state.showModalPopup}
                onPopupClose={this.isShowPopup}
                pendingResponse={this.settleUpConfirmBody}
                pathURL="http://127.0.0.1:8000/settleUpConfirm/"
                amount={this.state.settleUpAmount}
              ></ModalPopup>
            </div>
            {this.state.showSettleUpResponse ? (
              <div className="transaction_list_wrapper">
                {this.state.settleUpResponseMassage}
              </div>
            ) : (
              <div></div>
            )}

            <div></div>
          </div>}
        
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    transactionGlobal: state.transaction.transactionList,
    custId: state.transaction.custId,
    isMerchantPaymentCompleted: state.transaction.isMerchantPaymentCompleted,
    merchantPaymentMessage: state.transaction.merchantPaymentMessage,
  };
};
export default connect(mapStateToProps, {
  updateTransaction,
  setLoggedInCustomer,
})(SplitIt);
