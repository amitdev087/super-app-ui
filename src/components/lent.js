import { Component } from "react";
import axios from "axios";
import "../styles/lent.css";
import LoadingSpinner from "./LoadingSpinner";
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
    };
    this.FailedUser = "cus_616804c7789f0342bd7664a5fa78f3b9";
    this.handleClickAmount = this.handleClickAmount.bind(this);
    this.handleChange = this.handleChange.bind(this);
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
  async componentDidMount() {
    this.setState(
      {
        custId: localStorage.getItem("custId"),
      },
      () => {
        console.log(this.state.custId, "");
      }
    );
    // await this.makeMerchantRequest();
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
    console.log(response.data);
    var responsecustomers = [];
    response.data["data"].forEach((element) => {
      var customer = element;
      if (customer.ewallet != "" && customer.id != this.state.custId) {
        console.log("&#&#&#&#&*@(!&@*#@*****************", this.state.custId);

        responsecustomers.push(customer);
      }
    });

    this.setState(
      { customerslist: responsecustomers, customerLoads: false },
      () => {
        console.log("csutomers = ", this.state.customerslist);
      }
    );
  }
  handleClickMerchant = (e) => {
    console.log(e.target.value);
    this.setState(
      {
        selectedMerchant: e.target.value,
      },
      () => console.log("merchantClick 👉️", this.state.selectedMerchant)
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

  handleClickAmount = (e) => {
    e.preventDefault();
    this.setState({
      amount: e.target.value,
    });
    console.log("handleClick 👉️", this.state.amount);
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
        // disabled={  this.state.selectedIds.length < 3}
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
                        type="checkbox"
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

    return (
      <div className="container" style={{ padding: "2rem", width: "60%" }}>
        {clickedMerchant}
        {finalamount}
      </div>
    );
  }
}

export default Lent;
