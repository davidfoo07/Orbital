import React from "react";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { PaymentForm } from "./PaymentForm";

const PUBLIC_KEY =
    "pk_test_51NWgi5B9m3kkgMqmcR8tWCC5bM3d5s1XVL8Yu24P6TEAQFwq47D555qIh9eLzduTuPkPi4hX1THAn5AsxSLNm4yt00z5sg2nGt";

const stripeTestPromise = loadStripe(PUBLIC_KEY);

export const StripeContainer = ({ handleSubmit }) => {
    return (
        <div>
            <Elements stripe={stripeTestPromise}>
                <PaymentForm handleSubmit={handleSubmit} />
            </Elements>
        </div>
    );
};
