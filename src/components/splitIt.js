import React, { Component, Fragment } from "react";
import ModalPopup from "../Models/modal-popup";
import CryptoJS from "crypto-js";
import axios from "axios";
import { Button } from "react-bootstrap";
import "react-bootstrap";
import "../styles/splitit.css";
import { connect } from "react-redux";
import { updateTransaction } from "../Redux/Actions/TransactionsActions";
import LoadingSpinner from "./LoadingSpinner";

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
      showTransaction: false,
      showModalPopup: false,
      settleUpConfirmBody: {},
      isLoading: false,
      buttonEnable: false,
      responseMessage: "",
      // you owe people - split equally -- 1
      // people owe you - split equally -- 2
      // you owe people full amount -- 3
      // people owe you full amount -- 4
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
    this.getTransactions();
    this.makeRequest();
  }

  async getTransactions() {
    const headers = {
      "Content-Type": `application/json`,
    };

    const request = {
      baseURL: "http://127.0.0.1:8000/transactionList/",
      headers,
      method: "get",
    };
    const response = await axios(request);
    console.log(response.data);
    var responseTransactions = [];
    response.data.forEach((element) => {
      var transaction = element;
      responseTransactions.push(transaction);
    });
    console.log("response transaction is ", responseTransactions);
    this.props.updateTransaction(responseTransactions);

    this.setState(
      { transactionList: responseTransactions },
      () => {
        console.log("transactions = ", this.state.transactionList);
      },
      () => {
        console.log("GLobal transaction is :::", this.props.transactionGlobal);
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
    console.log(response.data);
    var responsecustomers = [];
    response.data["data"].forEach((element) => {
      var customer = element;
      if (
        customer.ewallet != "" &&
        customer.id != "cus_5dedc9d323b7928b256317886173bbca"
      ) {
        responsecustomers.push(customer);
      }
    });

    this.setState({ customerslist: responsecustomers }, () => {
      console.log("csutomers = ", this.state.customerslist);
    });
  }

  async settleup(finalbody) {
    console.log("finalbody is ", finalbody);
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
    if ((response.status = 201)) {
      this.isShowPopup(true);
    }

    finalbody["id"] = response.data["id"];
    this.settleUpConfirmBody = finalbody;
    // console.log(finalbody,"final body for settle up confirmation")
    // const newrequest= {
    //     baseURL: "http://127.0.0.1:8000/settleUpConfirm/",
    //     headers,
    //     data: finalbody,
    //     method: 'post',
    // };
    // const response1 = await axios(newrequest);
  }
  handlesettleUp = (e) => {
    //const { value, checked } = e.target;
    console.log(e.target.value);
    var data = e.target.value;
    data = this.props.transactionGlobal.filter((x) => x.source == data);
    var finalData = data[0];
    console.log(finalData);
    this.settleup(finalData);
    // console.log(checked,"inside handleSettle")
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
    var owingOption = this.state.owingOption;
    var totalCustomerCount = this.state.selectedIds.length + 1;
    if (owingOption == 1) {
      var individualAmount = this.state.amount / totalCustomerCount;
    } else if (owingOption == 2) {
      var individualAmount = -(this.state.amount / totalCustomerCount);
    } else if (owingOption == 3) {
      var individualAmount = -this.state.amount;
    } else {
      var individualAmount = this.state.amount;
    }
    var finalbody = [];

    this.state.selectedIds.forEach((x) => {
      var name = this.showName(x);
      console.log("SHow name is ***********", name);
      var individualBody = {
        source: x,
        amount: individualAmount,
        destination: "cus_5dedc9d323b7928b256317886173bbca",
        name: this.showName(x),
      };
      finalbody.push(individualBody);
    });
    console.log("finalbody is ", finalbody);
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
    console.log(response.data);
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
    console.log("present ids are ", presentIds);
    this.setState({
      selectedIds: presentIds,
    });
  };

  handleClickOwingOption = (e) => {
    e.preventDefault();
    console.log(e.target.value);
    this.setState(
      {
        owingOption: e.target.value,
      },
      () => console.log("owing option is 👉️", this.state.owingOption)
    );
  };

  handleClickAmount = (e) => {
    e.preventDefault();
    this.setState({
      amount: e.target.value,
    });
    console.log("handleClick 👉️", this.state.amount);
  };
  handleShowTransactions = (e) => {
    e.preventDefault();
    var showHide = this.state.showTransaction;
    this.setState({
      showTransaction: !showHide,
    });
    // console.log('handleClick 👉️', this.state.amount);
  };

  checkOwes(sentAmount) {
    if (parseInt(sentAmount) > 0) {
      return " owes you ";
    } else {
      return " is owed ";
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
                      {Math.abs(transaction.amount.toFixed(2))} USD
                    </p>

                    <button
                      className="button_primary"
                      value={transaction.source}
                      onClick={this.handlesettleUp}
                    >
                      settleUp
                    </button>
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
    if (this.state.selectedIds.length > 0 && this.state.amount > 0) {
      this.buttonEnable = true;
      // button = <button className='button_primary' onClick={this.createSplit}> Split It!{this.isLoading? <LoadingSpinner/>:} </button>;
    }
    if (this.buttonEnable) {
      button = (
        <button className="button_primary" onClick={this.createSplit}>
          {" "}
          Split It!{" "}
        </button>
      );
    }
    console.log("button value is :", this.state.selectedIds > 0);
    let finalamount;
    // if (this.state.amount > 0) {
    finalamount = (
      <div className="transaction_list_wrapper">
        <h5>Select Friends</h5>
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
    );
    // }
    return (
      <div className="container" style={{ padding: "2rem", width: "60%" }}>
        <div>
          {clickedMerchant}
          {splitType}
          {merchants}
          {finalamount}
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
        </div>
        <div>
          {/* <Fragment>
                        <h3 align="center">Demo of Modal Pop up in Reactjs</h3>
                        <header align="center">
                            <Fragment>
                                <div
                                    className="nav-item"
                                    onClick={() => this.isShowPopup(true)}>
                                    <button>Modal Pop up</button>
                                </div>
                            </Fragment>
                        </header> */}
          <ModalPopup
            showModalPopup={this.state.showModalPopup}
            onPopupClose={this.isShowPopup}
            pendingResponse={this.settleUpConfirmBody}
            pathURL="http://127.0.0.1:8000/settleUpConfirm/"
          ></ModalPopup>
          {/* </Fragment> */}
        </div>
        <div></div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    transactionGlobal: state.transaction.transactionList,
  };
};
export default connect(mapStateToProps, { updateTransaction })(SplitIt);
