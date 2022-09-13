import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { Routes, Route, Link, BrowserRouter as Router } from "react-router-dom";
import Make_payment from "./components/MakePayments";
import ListCustomers from "./components/ListCustomers";
import SplitIt from "./components/splitIt";
import SalarySplit from "./components/SalarySplit";
import "bootstrap/dist/css/bootstrap.min.css";
import { Provider } from "react-redux";
import TransactionReducer from "./Redux/Reducer/TransactionReducer";
import { createStore } from "redux";
import allReducers from "./Redux/Reducer/CombinedReducer";
import Header from "./components/header";

const store = createStore(allReducers);
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <Provider store={store}>
    <Header/>
    <Router>
      <Routes>
        <Route path="/" element={<Make_payment />}></Route>
        <Route path="/listcustomers" element={<ListCustomers />}></Route>
        <Route path="/splitIt" element={<SplitIt />}></Route>
        <Route path="/salarySplit" element={<SalarySplit />}></Route>
        <Route path="/header" element={<Header />}></Route>
      </Routes>
    </Router>
    
  </Provider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();
