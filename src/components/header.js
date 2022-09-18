import React, { useEffect } from "react";
import "../styles/header.css";
import { useState } from "react";
import { Navigate } from "react-router-dom";
import axios from "axios";

export default function Header() {
  const [isLoggedOut, setIsLoggedOut] = useState(false);
  const [isUserAvailable, setIsUserAvailable] = useState("");
  const [custId, setCustId] = useState("");
  const [customerName, setCustomerName] = useState("");
  const logout = async () => {
    await localStorage.clear()
    setIsLoggedOut(true);
  }
  useEffect(()=>{
    var customer = localStorage.getItem('custId')
    setCustId(customer);
    if(customer != null || customer != "" || customer != undefined){
      userName(customer).then((custname)=>{
        setCustomerName(custname);
      });
      
    }
  })

  const userName = async (custId) => {
    var finalBody = {
      custId : custId
    };

    const headers = {
      "Content-Type": `application/json`,
    };

    const request = {
      baseURL: "http://127.0.0.1:8000/getName/",
      headers,
      data: finalBody,
      method: "post",
    };
    const response = await axios(request);
    if (response.status = 201 && response.data != -1) {
      return response.data
    }
    return ""
  };
  return (
    <div class="topnav">
      
      <a class="active" href="/splitPay">
        {(custId != null || custId != "" || custId != undefined) && customerName != "" ? <div> Hi {customerName} </div>: <div></div>}
      </a>

      <a class="active" href="/splitPay">
        Split Pay
      </a>
      
      <a href="/splitIt">Split It</a>

      <a href="/salarySplit"> Manage Salary</a>
      <a href="/lent"> Lend Money</a>

      <a href="/login"  style={{ float: "right" }} onClick={logout}> Logout</a>
      {isLoggedOut ? <Navigate replace to="/login" /> : <div></div>}
    </div>
  );
}
