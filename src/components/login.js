import React, { useState } from "react";
import ReactDOM from "react-dom";
import axios from "axios";
import "../styles/login.css";
export default function Login() {
  const [errorMessages, setErrorMessages] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  const userLogin = async (uname, pass) => {
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
    console.log(response.data,"custmid of logged in user")
    if ((response.status = 200)) {
        setErrorMessages({ message:"Inavalid User Name or Password" })
    } else {
      setIsSubmitted(true);
    }
  };

  const handleSubmit = (event) => {
    //Prevent page reload
    event.preventDefault();

    var { uname, pass } = document.forms[0];
    console.log(uname,pass,"usesr na,w asn dfjsofj password")
    userLogin(uname.value, pass.value);

    // Find user login info
    //const userData = database.find((user) => user.username === uname.value);

    // Compare user info
//     if (userData) {
//       if (userData.password !== pass.value) {
//         // Invalid password
//         setErrorMessages({ name: "pass", message: errors.pass });
//       } else {
//         setIsSubmitted(true);
//       }
//     } else {
//       // Username not found
//       setErrorMessages({ name: "uname", message: errors.uname });
//     }
 };


  // Generate JSX code for error message
  const renderErrorMessage = (name) =>
    name === errorMessages && (
      <div className="error">{errorMessages.message}</div>
    );

  // JSX code for login form
  const renderForm = (
    <div className="form">
      <form onSubmit={handleSubmit}>
        <div className="input-container">
          <label>Username </label>
          <input type="text" name="uname" required />
          {renderErrorMessage("uname")}
        </div>
        <div className="input-container">
          <label>Password </label>
          <input type="password" name="pass" required />
          {renderErrorMessage("pass")}
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
        <div className="title">Sign In</div>
        {isSubmitted ? <div>User is successfully logged in</div> : renderForm}
      </div>
    </div>
  );
}
