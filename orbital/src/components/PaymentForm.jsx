import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import React, { useState } from "react";
import "../css/PaymentForm.css";

const CARD_OPTIONS = {
    iconStyle: "solid",
    style: {
        base: {
            iconColor: "#ffff",
            color: "#ffff",
            fontWeight: 500,
            fontFamily: "Roboto, Open Sans, Segoe UI, sans-serif",
            fontSize: "16px",
            fontSmoothing: "antialiased",
            ":-webkit-autofill": { color: "#ffff" },
            "::placeholder": { color: "#ffff" },
        },
        invalid: {
            iconColor: "#ff0000",
            color: "#ff0000",
        },
    },
};
export const PaymentForm = ({ handleSubmit }) => {
    const stripe = useStripe();
    const elements = useElements();

    return (
        <>
            <form onSubmit={handleSubmit}>
                <fieldset className="FormGroup">
                    <div className="FormRow">
                        <CardElement options={CARD_OPTIONS} />
                    </div>
                </fieldset>
                <button className="payment-btn">Pay</button>
            </form>
        </>
    );
};
