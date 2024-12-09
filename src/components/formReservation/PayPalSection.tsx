import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";




const PayPalSection = ({
    createOrderHandler,
    onApproveHandler,
    paymentError,
    setPaymentError,
  }: any) => (
    <section className="p-4 bg-gray-200 rounded-md">
      <h2 className="font-bold text-xl mb-3">2. PayPal Zahlung</h2>
      <PayPalScriptProvider
        options={{
          "client-id": "AbEcs8NfNF1i7uraUy-uhPwhvANzzKrKXbUGQtqkFFNG5A-97e0lmHZqrnLnx1VciiyTGGiEzXlXCuwl",
          currency: "EUR",
        }}
      >
        <PayPalButtons
          style={{ layout: "vertical" }}
          createOrder={createOrderHandler}
          onApprove={onApproveHandler}
          onError={(err) => {
            setPaymentError("Fehler bei der PayPal-Zahlung: " + err.message);
            console.error("PayPal Fehler:", err);
          }}
        />
      </PayPalScriptProvider>
  
      {paymentError && (
        <div className="mt-4 text-red-500 font-medium">{paymentError}</div>
      )}
    </section>
  );
  

  export default PayPalSection