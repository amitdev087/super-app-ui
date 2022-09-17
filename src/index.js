import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { Routes, Route, Link, BrowserRouter as Router } from "react-router-dom";
import ListCustomers from "./components/ListCustomers";
import SplitIt from "./components/splitIt";
import SalarySplit from "./components/SalarySplit";
import "bootstrap/dist/css/bootstrap.min.css";
import { Provider } from "react-redux";
import TransactionReducer from "./Redux/Reducer/TransactionReducer";
import { createStore } from "redux";
import allReducers from "./Redux/Reducer/CombinedReducer";
import Header from "./components/header";
import Login from "./components/login";
import Lent from "./components/lent"

const store = createStore(allReducers);
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <Provider store={store}>
    <Router>
      <Routes>
        <Route index path="/" element={<ListCustomers />}></Route>
        <Route path="/listcustomers" element={<ListCustomers />}></Route>
        <Route path="/splitIt" element={<SplitIt />}></Route>
        <Route path="/salarySplit" element={<SalarySplit />}></Route>
        <Route path="/login" element={<Login />}></Route>
        <Route path="/lent" element={<Lent />}></Route>
      </Routes>
    </Router>
    
  </Provider>
);