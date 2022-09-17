import React from "react";
import "../styles/header.css";
import { useState } from "react";
import { Navigate } from "react-router-dom";

export default function Header() {
  const [isLoggedOut, setIsLoggedOut] = useState(false);
  const [isUserAvailable, setIsUserAvailable] = useState("");
  const logout = async () => {
    await localStorage.clear()
    var custId = await localStorage.getItem('custId')
    setIsLoggedOut(true);
  }
  return (
    <div class="topnav">
      <a class="active" href="/listcustomers">
        Split Pay
      </a>

      <a href="/splitIt">Split It</a>

      <a href="/salarySplit"> Manage Salary</a>
      <a href="/lend Money"> Lend Money</a>

      <a href="/login"  style={{ float: "right" }} onClick={logout}> Logout</a>
      {isLoggedOut ? <Navigate replace to="/login" /> : <div></div>}
    </div>
  );
}
