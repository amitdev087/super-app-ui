import React, { Component, Fragment } from "react";
import { Modal } from "react-bootstrap";
import axios from "axios";
import { updateTransaction } from "../Redux/Actions/TransactionsActions";
import { connect } from "react-redux";
import "../styles/splitit.css";
import { updateCompletedMerchantPayment } from "../Redux/Actions/TransactionsActions";

class ModalPopup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showModal: false,
      custId: "",
    };

    this.createAcceptRequest = this.createAcceptRequest.bind(this);
    this.isShowModal = this.isShowModal.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.getTransactions = this.getTransactions.bind(this);
  }
  componentDidMount() {
    this.setState(
      {
        custId: localStorage.getItem("custId"),
      },
      () => {
      }
    );
  }

  isShowModal = async (status, statusAcceptOrDecline) => {
    await this.createAcceptRequest(statusAcceptOrDecline);
    this.handleClose();
    this.setState({ showModal: status });
  };

  handleClose = () => {
    this.props.onPopupClose(false);
  };

  createAcceptRequest = async (statusAcceptOrDecline) => {
    this.props.pendingResponse.status = statusAcceptOrDecline == "decline" ? "decline" : "accept";
    const headers = {
      "Content-Type": `application/json`,
    };
    const request = {
      baseURL: this.props.pathURL,
      headers,
      data: this.props.pendingResponse,
      method: "post",
    };

    const response = await axios(request);
    if (response.status == 201 || response.status == 200 && this.props.pathURL == "http://127.0.0.1:8000/setTransferResponse/") {
      if (this.props.pendingResponse.status == "accept") {
        this.props.updateCompletedMerchantPayment([true, "Payment Succeeded"]);
      }

      else {
        this.props.updateCompletedMerchantPayment([true, "Payment Declined"]);
      }
    } 
    if ((response.status == 201 || response.status == 200) && this.props.pathURL == "http://127.0.0.1:8000/settleUpConfirm/") {
      this.getTransactions();
      if (response.data == "accept") {
        this.props.updateCompletedMerchantPayment([true, "Payment Succeeded"]);
      }
      else this.props.updateCompletedMerchantPayment([false, "Payment Failed"]);
    }
  };

  async getTransactions() {
    const headers = {
      "Content-Type": `application/json`,
    };
    const finbody = {
      custId: this.state.custId
    }

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
  }
  render() {
    return (
      <Fragment>
        <Modal
          show={this.props.showModalPopup}
          onHide={this.handleClose}
          size="lg"
          aria-labelledby="contained-modal-title-vcenter"
          centered
        >
          <Modal.Header>
            <Modal.Title id="sign-in-title">
              Ewallet to Ewallet Transaction
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="signUp">
              <p>Amount will be deducted from your Ewallet</p>
              <p>Want to Complete the payment of {this.props.amount}?</p>
              <button
                type="button"
                className="button_primary"
                onClick={() => this.isShowModal(true, "accept")}
              >
                {" "}
                Accept{" "}
              </button>
              <button
                type="button"
                className="button_primary"
                color="red"
                onClick={() => this.isShowModal(true, "decline")}
              >
                Decline
              </button>
            </div>
          </Modal.Body>
        </Modal>
      </Fragment>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    transactionGlobal: state.transaction.transactionList,
    custId: state.transaction.custId
  };
};
export default connect(mapStateToProps, {
  updateTransaction,
  updateCompletedMerchantPayment,
})(ModalPopup);
