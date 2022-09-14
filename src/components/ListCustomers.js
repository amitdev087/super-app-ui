import React, { Component, Fragment } from "react";
import ModalPopup from "../Models/modal-popup";
import CryptoJS from "crypto-js";
import axios from "axios";
import "react-bootstrap";
import SplitIt from "./splitIt";
import { Link } from "react-router-dom";
import "../styles/splitpay.css";
import ReactSpinnerTimer from "react-spinner-timer";
import { connect } from "react-redux";
import {
  updateCompletedMerchantPayment,
  updateTransaction,
} from "../Redux/Actions/TransactionsActions";
import LoadingSpinner from "./LoadingSpinner";

class ListCustomers extends Component {
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
      isGpCompleted: false,
      gpList: [],
      showSpinner: false,
      isFailedUserInList: false,
      transactionGlobal: [],
      amountPerUser: 0,
      isMerchantPaymentCompleted: false,
      isLoading: false,
      buttonEnable: true,
      responseMessage: "",
      merchantPaymentStarted: false,
      payToMerchantButtpn: true,
      groupId: "",
      refundMassage: "",
      refundLoader: false,
    };

    this.FailedUser = "cus_616804c7789f0342bd7664a5fa78f3b9";

    this.makeRequest = this.makeRequest.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.createGroup = this.createGroup.bind(this);
    this.handleClickAmount = this.handleClickAmount.bind(this);
    this.makeMerchantRequest = this.makeMerchantRequest.bind(this);
    this.handleClickMerchant = this.handleClickMerchant.bind(this);
    this.makePaymentEwallet = this.makePaymentEwallet.bind(this);
    this.isShowPopup = this.isShowPopup.bind(this);
    this.handleLapChange = this.handleLapChange.bind(this);
    this.createRefund = this.createRefund.bind(this);
    this.recordFailedPaymentToSplitIt =
      this.recordFailedPaymentToSplitIt.bind(this);
  }

  isShowPopup = (status) => {
    this.setState({ showModalPopup: status });
  };
  async componentDidMount() {
    await this.makeMerchantRequest();
    await this.makeRequest();
  }
  async componentDidUpdate() {
    for (var x in this.state.selectedIds) {
      if (this.state.selectedIds[x] == this.FailedUser) {
        this.setState({
          isFailedUserInList: true,
        });
      }
      // else {
      //     this.setState({
      //         isFailedUserInList: false
      //     })
      // }
    }
  }

  async makeMerchantRequest() {
    console.log("Inside makemerchant");
    const headers = {
      "Content-Type": `application/json`,
    };

    const request = {
      baseURL: "http://127.0.0.1:8000/getMerchant/",
      headers,
      method: "get",
    };
    const response = await axios(request);
    console.log(response.data);
    var responsecustomers = [];
    response.data.forEach((element) => {
      var customer = element;
      if (
        customer.ewallet != "" &&
        customer.id != "cus_5dedc9d323b7928b256317886173bbca"
      ) {
        responsecustomers.push(customer);
      }
    });

    this.setState({ merchantsList: responsecustomers }, () => {
      console.log("merchant = ", this.state.merchantsList);
    });
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

  createGroup = async () => {
    this.setState({
      isLoading: true,
      buttonEnable: false,
    });
    var totalCustomerCount = this.state.selectedIds.length + 1;
    if (this.state.isFailedUserInList) {
      var finalamount =
        this.state.amount - 2 * (this.state.amount / totalCustomerCount);
    } else {
      var finalamount =
        this.state.amount - this.state.amount / totalCustomerCount;
    }

    var gpbody = {
      amount: finalamount,
      ids: this.state.selectedIds.filter((x) => x != this.FailedUser),
    };

    console.log("finalbody is ", gpbody);
    const headers = {
      "Content-Type": `application/json`,
    };

    const request = {
      baseURL: "http://127.0.0.1:8000/createGruopPayment/",
      headers,
      data: gpbody,
      method: "post",
    };

    const response = await axios(request);
    var gpMembers = [];
    for (var ele in this.state.customerslist) {
      for (var x in this.state.selectedIds) {
        if (this.state.customerslist[ele].id == this.state.selectedIds[x]) {
          gpMembers.push(this.state.customerslist[ele]);
        }
      }
    }

    console.log("selectedIds are ************** ", this.state.selectedIds);
    console.log(response.data, "response data for whole gruop payment");
    var gpid = response.data;
    if (response.status == 200 || response.status == 201) {
      this.setState(
        {
          groupId: gpid,
          isLoading: false,
          responseMessage: "Group payment Created",
          isGpCompleted: true,
          gpList: gpMembers,
          showSpinner: true,
          amountPerUser: this.state.amount / totalCustomerCount,
        },
        () => {
          console.log("gpbody is *******", gpMembers);
          console.log(
            this.state.groupId,
            "group id for created geoup apy dj fdofkdjfkdhflh"
          );
        }
      );
    } else {
      this.setState({
        isGpCompleted: false,
        isFailedUserInList: false,
        isLoading: false,
        responseMessage: "Failed to create payment",
      });
    }
    // console.log(this.state.groupId,"group id for created geoup apy dj fdofkdjfkdhflh")
  };

  createRefund = async () => {
    this.setState({ refundLoader: false });
    var finalBody = {};
    finalBody["id"] = this.state.groupId;
    console.log(finalBody, "refundBpdy us sudf dof df ");
    const headers = {
      "Content-Type": `application/json`,
    };

    const request = {
      baseURL: "http://127.0.0.1:8000/groupRefund/",
      headers,
      data: finalBody,
      method: "post",
    };
    const response = await axios(request);
    if ((response.status = 200)) {
      this.setState({
        refundMassage: "Your amount was refunded sucessfully",
      });
    }
  };
  recordFailedPaymentToSplitIt = async () => {
    // var owingOption = this.state.owingOption;
    // var individualAmount = (this.state.amount)/

    // var finalbody = [];

    // this.state.selectedIds.forEach((x) => {
    // var name = this.showName(x);
    // console.log("SHow name is ***********", name)
    var finalbody = [
      {
        source: this.FailedUser,
        amount: this.state.amountPerUser,
        destination: "cus_5dedc9d323b7928b256317886173bbca",
        name: "Mohit",
      },
    ];
    // finalbody.push(individualBody);
    // })
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
    }
  };

  makePaymentEwallet = async () => {
    this.setState({
      merchantPaymentStarted: true,
      payToMerchantButtpn: false,
    });
    var ewalletpaymentbody = {
      amount: this.state.amount.toString(),
      ids: this.state.selectedMerchant,
    };

    console.log("finalbody ewalletpaymentbody is ", ewalletpaymentbody);
    const headers = {
      "Content-Type": `application/json`,
    };

    const request = {
      baseURL: "http://127.0.0.1:8000/accountTransfer/",
      headers,
      data: ewalletpaymentbody,
      method: "post",
    };

    const response = await axios(request);
    console.log(response.data);
    this.setState({ pendingResponse: response.data }, () => {
      console.log(this.state.pendingResponse);
    });
    if ((response.status = 200)) {
      this.isShowPopup(true);
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
  handleClickAmount = (e) => {
    e.preventDefault();
    this.setState({
      amount: e.target.value,
    });
    console.log("handleClick 👉️", this.state.amount);
  };

  handleLapChange = (lap) => {
    if (lap.isFinish)
      this.setState({
        showSpinner: false,
      });
    else console.log("Running!! Lap:", lap.actualLap);
  };

  handleClickMerchant = (e) => {
    // e.preventDefault();
    console.log(e.target.value);
    this.setState(
      {
        selectedMerchant: e.target.value,
      },
      () => console.log("merchantClick 👉️", this.state.selectedMerchant)
    );
  };

  render() {
    console.log(this.state.customerslist);
    let merchants;
    let clickedMerchant;
    let makePaymentEwallet;
    let createdGPWIthLoader = "";
    let isMerchantSelected = this.state.selectedMerchant == "" ? false : true;
    let promptToUpdateSplitIt;
    // if (this.state.selectedMerchant == "") {
    clickedMerchant = "";
    console.log("inside render for merhcant ", this.state.merchantsList);
    merchants = (
      <div className="transaction_list_wrapper">
        <h5>Select Merchant</h5>
        <hr></hr>
        <ul className="grid_listcustomers" style={{ padding: "5px" }}>
          {this.state.merchantsList.map((merchant) => (
            <label style={{ textAlign: "center" }} key={merchant.ewallet}>
              <input
                type="radio"
                name="lang"
                value={merchant.ewallet}
                onChange={this.handleClickMerchant}
              />{" "}
              {merchant.name}
            </label>
          ))}
        </ul>
      </div>
    );
    if (
      this.state.amount > 0 &&
      this.state.selectedIds.length > 0 &&
      this.state.selectedMerchant != ""
    ) {
      makePaymentEwallet = (
        <button
          disabled={!this.state.payToMerchantButtpn}
          className="button_primary"
          onClick={this.makePaymentEwallet}
          label="Make Payment to Merchant"
        >
          Pay to Merchant USD {this.state.amount}
        </button>
      );
    }
    clickedMerchant = (
      <div className="form-group">
        <input
          type="number"
          id="amount"
          name="amount"
          min={0}
          onChange={this.handleClickAmount}
          autoComplete="off"
          className="form-control"
          placeholder="Enter Amount"
        />
      </div>
    );

    if (this.state.isGpCompleted) {
      createdGPWIthLoader = (
        <div className="transaction_list_wrapper">
          <h5>Group Payment Status</h5>
          <hr></hr>
          <ul className="display_groupStatus">
            {this.state.gpList.map((customer) => (
              <label key={customer.id}>
                <div className={"loader_groupPaymentStatus"}>
                  <h6 value={customer.id}> {customer.name}</h6>
                  {this.state.showSpinner ? (
                    <div>
                      <ReactSpinnerTimer
                        timeInSeconds={5}
                        totalLaps={1}
                        isRefresh={false}
                        onLapInteraction={this.handleLapChange}
                        isPause={false}
                      />
                    </div>
                  ) : (
                    <h6>
                      {" "}
                      {this.FailedUser == customer.id
                        ? "Payment cancelled"
                        : this.state.amountPerUser.toFixed(2) + " USD Received"}
                    </h6>
                  )}
                </div>
              </label>
            ))}
          </ul>
          {this.state.showSpinner ? (
            <button
              className="button_primary"
              disabled="true"
              label="Make Payment to Merchant"
            >
              Recieving Payments
            </button>
          ) : (
            makePaymentEwallet
          )}
        </div>
      );
    }
    let button;
    // if (this.state.selectedIds.length > 2) {
    button = (
      <button
        className="button_primary"
        onClick={this.createGroup}
        disabled={!isMerchantSelected || this.state.selectedIds.length < 3}
      >
        {isMerchantSelected && this.state.selectedIds.length > 2
          ? "Create Group Payment"
          : this.state.selectedIds.length < 3
          ? "Please select atleast 3 friends"
          : "Please select merchant "}
      </button>
    );
    // }
    console.log("button value is :", this.state.selectedIds > 0);
    let finalamount;
    if (this.state.amount > 0) {
      finalamount = (
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
      );
    }

    // console.log(
    //   "ISMERCHANTPAYMENTCOMPLETED",
    //   this.props.isMerchantPaymentCompleted
    // );
    // console.log(
    //   "ISMERCHANTPAYMENTCOMPLETED******",
    //   this.state.isFailedUserInList
    // );
    if (
      this.state.isFailedUserInList &&
      this.props.isMerchantPaymentCompleted
    ) {
      promptToUpdateSplitIt = (
        <div className="transaction_list_wrapper">
          <p>
            You made a payment of {this.state.amountPerUser} for you friend
            Mohit too
          </p>
          <p>Record a payment in SPLITIT?</p>
          <button
            className="button_primary"
            onClick={this.recordFailedPaymentToSplitIt}
          >
            Record It
          </button>
        </div>
      );
    }
    // if(this.props.isMerchantPaymentCompleted){
    //   <button>
    //     Create Refund
    //   </button>
    // };

    return (
      <div className="container" style={{ padding: "2rem", width: "60%" }}>
        <div>
          <div disabled={!this.state.buttonEnable}>
            {merchants}
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

          {createdGPWIthLoader}

          {this.state.merchantPaymentStarted &&
          this.props.merchantPaymentMessage == "" ? (
            <div className="transaction_list_wrapper">
              <LoadingSpinner />{" "}
            </div>
          ) : this.props.merchantPaymentMessage != "" ? (
            <div className="transaction_list_wrapper">
              {this.props.merchantPaymentMessage}
              {this.props.merchantPaymentMessage ==
              "Your Request was cancelled" ? (
                <button className="button_primary" onClick={this.createRefund}>
                  Create Refund{" "}
                </button>
              ) : (
                <div></div>
              )}
            </div>
          ) : (
            <div></div>
          )}


          {promptToUpdateSplitIt}
        </div>
        <div>
          <ModalPopup
            showModalPopup={this.state.showModalPopup}
            onPopupClose={this.isShowPopup}
            pendingResponse={this.state.pendingResponse}
            pathURL="http://127.0.0.1:8000/setTransferResponse/"
            amount={this.state.amount}
          ></ModalPopup>
        </div>
        <div style={{ display: "flex", padding: "5px 0" }}>
          <button className="button_primary" style={{ width: "95%" }}>
            <Link
              to={{
                pathname: "/splitIt",
              }}
            >
              Go to SplitIt
            </Link>
          </button>
          <button className="button_primary" style={{ width: "95%" }}>
            <Link
              to={{
                pathname: "/salarySplit",
              }}
            >
              Go to Salary Split
            </Link>
          </button>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    isMerchantPaymentCompleted: state.transaction.isMerchantPaymentCompleted,
    merchantPaymentMessage: state.transaction.merchantPaymentMessage,
  };
};
export default connect(mapStateToProps, {
  updateTransaction,
  updateCompletedMerchantPayment,
})(ListCustomers);
