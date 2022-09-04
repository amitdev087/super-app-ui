import React, { Component } from 'react'
import { useState } from 'react';

const Make_payment = () => {
    const [amount, setAmount] = useState('');

    const handleChange = event => {
        setAmount(event.target.value);
        console.log('value is:', event.target.value);
    };

    const handleClick = event => {
        event.preventDefault();

        // 👇️ value of input field
        console.log('handleClick 👉️', amount);
    };

    return (
        <div>
            <input
                type="number"
                id="amount"
                name="amount"
                onChange={handleChange}
                value={amount}
                autoComplete="off"
            />

            <h2>Amount: {amount}</h2>

            <button onClick={handleClick}>Click</button>
        </div>
    );
};

export default Make_payment;
