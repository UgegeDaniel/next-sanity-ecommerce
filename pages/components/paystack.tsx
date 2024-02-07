import { useState } from "react";
import Paystack from "paystack";

const PaystackButton = ({
  amount,
  email,
}: {
  amount: number;
  email: string;
}) => {
  const initializePayment = () => {
    const paystack = Paystack(process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY!);

    paystack.transaction
      .initialize({
        email,
        amount: amount * 100,
        currency: "NGN",
        reference: `Payment_${Math.floor(Math.random() * 1000000)}`,
        callback: (response: any) => {
          console.log(response);
        },
        onClose: () => {
          console.log("Payment closed");
        },
        name: ""
      })
      .then((response: any) => {
        // Open Paystack checkout form
        window.location.href = response.data.authorization_url;
      })
      .catch((error: any) => {
        console.error("Error initializing payment:", error);
        // Handle error
      });
  };

  return <button onClick={initializePayment}>Pay Now</button>;
};

export default PaystackButton;
