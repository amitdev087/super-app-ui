import React, { Component, Fragment } from 'react';  
import { Modal } from 'react-bootstrap';  
import axios from "axios";
import { updateTransaction } from '../Redux/Actions/TransactionsActions';
import {connect} from 'react-redux';
  
class ModalPopup extends Component {  
    constructor(props) {  
        super(props);  
        this.state = {  
            showModal: false,
            // transactionList:[]
        };
        
        this.createAcceptRequest = this.createAcceptRequest.bind(this);
        this.isShowModal = this.isShowModal.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.getTransactions = this.getTransactions.bind(this);
    }  
  
    isShowModal = async(status) => {  
        await this.createAcceptRequest();
        this.handleClose();  
        this.setState({ showModal: status });  
    }  
  
    handleClose = () => {  
        this.props.onPopupClose(false);  
    }  
  
    createAcceptRequest = async () => {
        this.props.pendingResponse.status = "accept"
        console.log("finalbody is ", this.props.pendingResponse);
        const headers = {
            "Content-Type": `application/json`
        };
        const request = {
            baseURL: this.props.pathURL,
            headers,
            data: this.props.pendingResponse,
            method: 'post',
        };

        const response = await axios(request);
        console.log(response.data)
        if(response.status == 201){
            this.getTransactions()
        }
    }
  
    async getTransactions() {
        const headers = {
            "Content-Type": `application/json`
        };

        const request = {
            baseURL: "http://127.0.0.1:8000/transactionList/",
            headers,
            method: 'get',
        };
        const response = await axios(request);
        console.log(response.data)
        var responseTransactions = []
        response.data.forEach(element => {
            var transaction = element
            responseTransactions.push(transaction)

        });
        console.log("response transaction is ",responseTransactions);
        this.props.updateTransaction(responseTransactions);
    }
    render() {  
        return (  
            <Fragment>  
                <Modal show={this.props.showModalPopup} onHide={this.handleClose}  
                    size="lg"  
                    aria-labelledby="contained-modal-title-vcenter"  
                    centered  
                >  
                    <Modal.Header closeButton>  
                        <Modal.Title id="sign-in-title">  
                            React Modal Pop up Example  
                         </Modal.Title>  
                    </Modal.Header>  
                    <Modal.Body>  
                        <hr />  
                        <div className="signUp">  
                            <p>Want to Complete the payment?<button type="button" className="link-button" onClick={() => this.isShowModal(true)}> Accept </button></p>  
                        </div>  
                    </Modal.Body>  
  
                </Modal >  
            </Fragment >  
  
        );  
    }  
}  
const mapStateToProps = (state) => {
    return {
        transactionGlobal: state.transaction.transactionList
    }
}
export default connect(mapStateToProps,{ updateTransaction })(ModalPopup)