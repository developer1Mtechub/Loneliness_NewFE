// paymentUtils.js

import { initPaymentSheet, presentPaymentSheet } from '@stripe/stripe-react-native';

const initializePaymentSheet = async (booking_price, email = 'user@gmail.com', currency = 'usd', merchantDisplayName = 'Test User') => {
    console.log('Booking price:', booking_price);

    const response = await fetch(`https://lone-be.mtechub.com/create-payment`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            email, // Customer email
            currency, // Currency
            amount: booking_price, // Amount in cents
        }),
    });

    const { customer_id, ephemeral_key, payment_intent } = await response.json();
    console.log('Customer ID:', customer_id);
    console.log('Ephemeral Key:', ephemeral_key);
    console.log('Payment Intent:', payment_intent);

    const { error } = await initPaymentSheet({
        customerId: customer_id,
        customerEphemeralKeySecret: ephemeral_key,
        paymentIntentClientSecret: payment_intent,
        merchantDisplayName, // Optional
        applePay: { merchantCountryCode: 'US' },
        googlePay: { merchantCountryCode: 'US' },
        primaryButtonLabel: `Pay $${(booking_price).toFixed(2)}`
    });

    if (error) {
        console.log('Error initializing payment sheet:', error);
        return false;
    } else {
        console.log('Payment sheet initialized');
        return true;
    }
};

const openPaymentSheet = async (booking_price, handleApiCall, email, currency, merchantDisplayName) => {
    const initialized = await initializePaymentSheet(booking_price, email, currency, merchantDisplayName);
    if (!initialized) return;

    const { error } = await presentPaymentSheet();

    if (error) {
        console.log('Error presenting payment sheet:', error);
    } else {
        console.log('Payment successful');
        if (handleApiCall) handleApiCall();
    }
};

export { initializePaymentSheet, openPaymentSheet };
