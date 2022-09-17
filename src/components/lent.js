import { Component } from "react";
import axios from "axios";
import "../styles/lent.css";
import LoadingSpinner from "./LoadingSpinner";
import Header from "./header";
import ModalPopup from "../Models/modal-popup";
import { connect } from "react-redux";
import { Link, Navigate } from "react-router-dom";
import {
  updateTransaction,
  updateCompletedMerchantPayment, setLoggedInCustomer
} from "../Redux/Actions/TransactionsActions";
class Lent extends Component {
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
      refundEnable: false,
      isSplitRecorded: false,
      customerLoads: true,
      custId: "",
      settleUpResponseMassage: "",
      showSettleUpResponse: false,
    };
    this.FailedUser = "cus_616804c7789f0342bd7664a5fa78f3b9";
    this.handleClickAmount = this.handleClickAmount.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.makeRequest = this.makeRequest.bind(this);
    this.handleClickMerchant = this.handleClickMerchant.bind(this);
    this.makePaymentEwallet = this.makePaymentEwallet.bind(this);
    this.isShowPopup = this.isShowPopup.bind(this);
  }

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
  async componentDidMount() {
    this.setState(
      {
        custId: localStorage.getItem("custId"),
      },
      () => {
      }
    );
    await this.makeRequest();
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
      if (customer.ewallet != "" && customer.id != this.state.custId) {
        responsecustomers.push(customer);
      }
    });

    this.setState(
      { customerslist: responsecustomers.filter((x) => x.id != this.FailedUser), customerLoads: false },
      () => {
      }
    );
  }
  handleClickMerchant = (e) => {
    this.setState(
      {
        selectedMerchant: e.target.value,
      }
    );
  };
  makePaymentEwallet = async () => {
    this.setState({
      merchantPaymentStarted: true,
      payToMerchantButtpn: false,
    });
    var ewalletpaymentbody = {
      amount: this.state.amount.toString(),
      ids: this.state.selectedMerchant,
      custId: this.state.custId,
    };

    const headers = {
      "Content-Type": `application/json`,
    };

    const request = {
      baseURL: "http://127.0.0.1:8000/lentMoney/",
      headers,
      data: ewalletpaymentbody,
      method: "post",
    };

    const response = await axios(request);

    if ((response.status = 201) && (response.data["message"] == "")) {
      this.isShowPopup(true);
      this.setState({ pendingResponse: response.data }, () => {
      });
    }
    if (((response.status = 201) && (response.data["message"] != ""))) {
      this.setState({
        showSettleUpResponse: true,
        settleUpResponseMassage: response.data["message"],
      });
    }
  };
  recordFailedPaymentToSplitIt = async () => {
    var finalbody = [
      {
        source: this.state.selectedMerchant,
        amount: parseFloat(this.state.amount),
        destination: this.state.custId,
        name: "Mohit",
      },
    ];
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
    if (response.status == 201 || response.status == 200) {
      this.setState({
        isSplitRecorded: true,
      });
    }
  };
  isShowPopup = (status) => {
    this.setState({ showModalPopup: status });
  };

  handleClickAmount = (e) => {
    e.preventDefault();
    this.setState({
      amount: e.target.value,
    });
  };
  render() {
    let clickedMerchant;
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
    let button;
    button = (
      <button
        className="button_primary"
        onClick={this.makePaymentEwallet}
      >
        {"Make Payment"}
      </button>
    );
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
                      type="radio"
                      name="lang"
                      value={customer.id}
                      onChange={this.handleClickMerchant}
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
    let promptToUpdateSplitIt;
    if (
      this.state.merchantPaymentStarted && this.props.isMerchantPaymentCompleted && this.state.showSettleUpResponse == "" && this.props.merchantPaymentMessage != "Payment Declined"
    ) {
      promptToUpdateSplitIt = (
        <div className="transaction_list_wrapper">
          <p>
            You made a payment of {this.state.amount} for you friend
            too
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

    let paymentStatusFinal;
    if (this.state.merchantPaymentStarted) {
      if (this.props.isMerchantPaymentCompleted && this.props.merchantPaymentMessage == "Payment Declined" && !this.state.showSettleUpResponse) {
        paymentStatusFinal =
          (
            <div className="transaction_list_wrapper">
              {this.props.merchantPaymentMessage}
            </div>
          )
      }
      else if (this.props.isMerchantPaymentCompleted && this.props.merchantPaymentMessage == "Payment Succeeded" && !this.state.settleUpResponseMassage && this.state.merchantPaymentStarted) {
        paymentStatusFinal = (<div className="transaction_list_wrapper">
          <p>Your payment was completed</p>
        </div>)
      }
    }
    return (
      <div>
        <Header />
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

            {clickedMerchant}
            {finalamount}
            {paymentStatusFinal}
            <div>
              <ModalPopup
                showModalPopup={this.state.showModalPopup}
                onPopupClose={this.isShowPopup}
                pendingResponse={this.state.pendingResponse}
                pathURL="http://127.0.0.1:8000/setTransferResponse/"
                amount={this.state.amount}
              ></ModalPopup>
            </div>
            {this.state.showSettleUpResponse ? (
              <div className="transaction_list_wrapper">
                {this.state.settleUpResponseMassage}
              </div>
            ) : (
              <div></div>
            )}
            {promptToUpdateSplitIt}
            {this.state.isSplitRecorded ? (
              <div>
                You split was recorded <br></br> Click on{" "}
                <strong>Go to SplitIt to check</strong>
              </div>
            ) : (
              <div></div>
            )}
            <div style={{ display: "flex", padding: "5px 0" }}>
              <button className="button_primary" style={{ width: "100%" }}>
                <Link
                  to={{
                    pathname: "/splitIt",
                  }}
                >
                  Go to SplitIt
                </Link>
              </button>
            </div>
          </div>}
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
  setLoggedInCustomer,
})(Lent);
