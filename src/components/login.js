import React, { useState } from "react";
import ReactDOM from "react-dom";
import axios from "axios";
import "../styles/login.css";
import { Component } from "react";
import { connect } from "react-redux";
import { Navigate } from "react-router-dom";
import { setLoggedInCustomer } from "../Redux/Actions/TransactionsActions";
class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      errorMessages: "",
      isSubmitted: "",
      isLoggedIn: ""
    };
    this.userLogin = this.userLogin.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.renderErrorMessage = this.renderErrorMessage.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  userLogin = async (uname, pass) => {
    var finalBody = {};
    finalBody["name"] = uname;
    finalBody["password"] = pass;

    console.log(finalBody, "Login final body&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&& ");
    const headers = {
      "Content-Type": `application/json`,
    };

    const request = {
      baseURL: "http://127.0.0.1:8000/login/",
      headers,
      data: finalBody,
      method: "post",
    };
    const response = await axios(request);
    console.log(response.data, "custmid of logged in user");
    if (response.status = 200 && response.data != -1) {
      localStorage.setItem("custId", response.data);
      this.setState({
        errorMessages: "Logged In Successfully",
        isLoggedIn: true
      });
    } else {
      this.setState({
        errorMessages: "Inavalid User Name or Password",
        isSubmitted: true,
      });
    }
    console.log("******************", this.props.loggedInUser);
  };

  handleSubmit = (event) => {
    //Prevent page reload
    event.preventDefault();

    var { uname, pass } = document.forms[0];
    console.log(uname, pass, "usesr na,w asn dfjsofj password");
    this.userLogin(uname.value, pass.value);
  };

  // Generate JSX code for error message
  renderErrorMessage = (name) =>
    name === this.state.errorMessages && (
      <div className="error">{this.state.errorMessages.message}</div>
    );

  // JSX code for login form

  render() {
    console.log(
      "******************customerid of logged in  user",
      this.props.loggedInUser
    );
    let renderForm = (
      <div className="form">
        <form onSubmit={this.handleSubmit}>
          <div className="input-container">
            <label>Username </label>
            <input type="text" name="uname" required />
            {this.renderErrorMessage("uname")}
          </div>
          <div className="input-container">
            <label>Password </label>
            <input type="password" name="pass" required />
            {this.renderErrorMessage("pass")}
          </div>
          <div className="button-container">
            <input type="submit" />
          </div>
        </form>
      </div>
    );
    return (
      <div className="app">
        <div className="login-form">
          {this.state.isLoggedIn}
          <div className="title">Sign In</div>
          {renderForm}
          {this.state.isSubmitted ? (
            <div>{this.state.errorMessages}</div>
          ) : (
            <div></div>
          )}
        </div>
        {this.state.isLoggedIn ? <Navigate replace to="/listcustomers" /> : <div></div>}
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    loggedInUser: state.transaction.custId,
  };
};
export default connect(mapStateToProps, {
  setLoggedInCustomer,
})(Login);
