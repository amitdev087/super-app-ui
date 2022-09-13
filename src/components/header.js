import React from "react";
import "../styles/header.css";

export default function Header() {
  return (
    <div class="topnav">
      <a class="active" href="/listcustomers">
        Split Pay
      </a>

      <a href="/splitIt">Split It</a>

      <a href="/salarySplit"> Manage Salary</a>
    </div>
  );
}
