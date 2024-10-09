import React, { useState, useRef, useEffect } from 'react';
import { View, StyleSheet, Image, Text } from 'react-native';
import { WebView } from 'react-native-webview';
import queryString from 'query-string';
import { useDispatch, useSelector } from 'react-redux';
import { useAlert } from '../../providers/AlertContext';
import { resetNavigation } from '../../utils/resetNavigation';
import { SCREENS } from '../../constant/constants';
import useBackHandler from '../../utils/useBackHandler';
import FullScreenLoader from '../../components/FullScreenLoader';
import Header from '../../components/Header';
import { theme } from '../../assets';
import { scaleHeight, scaleWidth } from '../../styles/responsive';
import fonts from '../../styles/fonts';
import { getPayPalUrl } from '../../redux/PaymentSlices/getPayPalUrlSlice';
import { executeChatPayment } from '../../redux/PaymentSlices/executeChatPaymentSlice';
import { updateUserLoginInfo } from '../../redux/AuthModule/signInSlice';
import { successSubscription } from '../../redux/PaymentSlices/successSubscriptionSlice';
import { executeRequestPayment } from '../../redux/PaymentSlices/executePaymentRequestSlice';

const PayPalWebview = ({ navigation }) => {
    const dispatch = useDispatch();
    const { loading } = useSelector((state) => state.getPayPalUrl)
    const { loading: paymentExecuteLoader } = useSelector((state) => state.executeRequestPayment)
    const { loading: chatPaymentLoader } = useSelector((state) => state.executeChatPayment)
    const { userLoginInfo } = useSelector((state) => state.auth)
    const { currentRoute } = useSelector((state) => state.app)
    const { email } = userLoginInfo?.user
    const { showAlert } = useAlert();
    const webviewRef = useRef(null);
    const [requestSent, setRequestSent] = useState(false);
    const [canGoBack, setCanGoBack] = useState(false);
    const [webUrl, setWebUrl] = useState('');

    const handleBackPress = () => {
        resetNavigation(navigation, currentRoute?.route, { screen: SCREENS.HOME });
        return true;
    };

    useBackHandler(handleBackPress);

    useEffect(() => {
        if (!currentRoute?.isSubscription) {
            const getUrl = async () => {
                try {
                    const payload = {

                        items: [
                            {
                                name: email?.split('@')[0],    //user name of logged in user 
                                sku: "item",//always item // dont change it // only used for BE purpose
                                price: currentRoute?.amount, // amount get from front end
                                currency: "USD", /// keep as it is
                                quantity: 1 //  keep as it is
                            }
                        ],
                        amount: {
                            currency: "USD", //same as currency
                            total: currentRoute?.amount // same as price from FE
                        },
                        description: "This is the payment description.",  //  keep as it is
                        redirect_urls: {
                            return_url: "http://localhost:3000/success",//keep it as it is
                            cancel_url: "http://localhost:3000/cancel"
                        }
                    }
                    const createResult = await dispatch(getPayPalUrl(payload));
                    if (createResult?.payload?.error === false) {
                        setWebUrl(createResult?.payload?.approval_url);
                    } else {
                        showAlert("Error", "error", createResult?.payload?.message || 'Something went wrong.');
                    }
                } catch (error) {
                    showAlert("Error", "error", "An unexpected error occurred");
                }
            };

            getUrl();
        } else {
            setWebUrl(currentRoute?.subscriptionUrl);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dispatch]);

    const parseResponseData = (url) => {
        const urlParts = url.split('/');
        const lastPart = urlParts[urlParts.length - 1];
        const secondLastPart = urlParts[urlParts.length - 2];
        let accountId = null;
        let uniqueIdentifier = null;
        let query = {};

        if (lastPart.includes('?')) {
            const parsed = queryString.parseUrl(url);
            query = parsed.query;
        } else {
            accountId = secondLastPart;
            uniqueIdentifier = lastPart;
        }

        return { accountId, uniqueIdentifier, query };
    };



    const handleUserUpdate = (subscriptionStatus, subscription_id, plan_id) => {
        const updatedInfo = {
            is_subscribed: subscriptionStatus,
            subscription_id,
            plan_id
        };
        dispatch(updateUserLoginInfo(updatedInfo));
    };


    const handleNavigationStateChange = (newNavState) => {
        setCanGoBack(newNavState.canGoBack);
        const { url } = newNavState;
        const result = parseResponseData(url);
        console.log('url---->', url);
        if (requestSent) {
            return; // Exit if request has already been sent
        }
        if (!currentRoute?.isSubscription) {
            if (currentRoute?.isRequestPayment) {

                if (result?.query?.PayerID && result?.query?.paymentId) {
                    const payload = {
                        user_id: currentRoute?.user_id, // current user id 
                        buddy_id: currentRoute?.buddy_id, // buddy id 
                        category_id: currentRoute?.category_id,
                        booking_date: currentRoute?.booking_date,
                        booking_time: currentRoute?.booking_time,
                        hours: currentRoute?.hours,
                        location: currentRoute?.location,
                        booking_price: currentRoute?.booking_price, // should be same as off when you call pay api
                        method: "CARD",
                        paymentId: result?.query?.paymentId,
                        payerId: result?.query?.PayerID
                    }

                    console.log('payload----->', payload)

                    setRequestSent(true); // Mark request as sent
                    dispatch(executeRequestPayment(payload)).then((result) => {
                        console.log('testing123')
                        if (result?.payload?.status === "success") {
                            handleBackPress();
                            showAlert("Success", "success", result?.payload?.message)
                        } else {
                            showAlert("Error", "error", result?.payload?.message)
                        }

                    })
                }

            }
            else {
                if (result?.query?.PayerID && result?.query?.paymentId) {
                    const payload = {
                        paymentId: result?.query?.paymentId,
                        payerId: result?.query?.PayerID,
                        user_id: currentRoute?.user_id,
                        buddy_id: currentRoute?.buddy_id,
                        amount: currentRoute?.amount
                    }
                    dispatch(executeChatPayment(payload)).then((result) => {
                        const { payment } = result?.payload;
                        if (payment?.state === "approved") {
                            handleBackPress();
                            showAlert("Success", "success", "Payment successfull.")
                        } else {
                            showAlert("Error", "error", "Payment unsuccessfull")
                        }

                    })
                }
            }
        }
        else {
            console.log('subscription query: ', result?.query)
            if (result?.query?.subscription_id) {

                const payload = {
                    subscription_id: result?.query?.subscription_id,
                    user_id: currentRoute?.user_id

                }
                dispatch(successSubscription(payload)).then((result) => {
                    const { subscription } = result?.payload;
                    if (subscription?.status === "ACTIVE") {
                        handleUserUpdate(true, subscription?.id, subscription?.plan_id)
                        handleBackPress();
                        showAlert("Success", "success", "Subscription successfull.")
                    } else {
                        showAlert("Error", "error", "Subscription not successfull")
                    }

                })

            }
        }

    };



    const renderWebView = () => {
        if ((loading || chatPaymentLoader || paymentExecuteLoader)) {
            return <FullScreenLoader
                loading={(loading || chatPaymentLoader || paymentExecuteLoader)} />;
        }

        return (
            <WebView
                ref={webviewRef}
                source={{ uri: webUrl }}
                style={{ flex: 1 }}
                incognito={true}
                cacheEnabled={false}
                onNavigationStateChange={handleNavigationStateChange}
            />
        );
    };



    return (
        <View style={styles.container}>
            <Header
                title={"Paypal Payment"}
                customTextStyle={{
                    color: theme.dark.secondary,
                    fontSize: scaleHeight(14),
                    fontFamily: fonts.fontsType.medium,
                    marginHorizontal: 20,
                }}
                onPress={handleBackPress}
            />
            {renderWebView()}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.dark.primary,
    },
    subTitle: {
        fontFamily: fonts.fontsType.regular,
        fontSize: scaleHeight(14),
        color: theme.dark.heading,
        marginTop: 5,
        alignSelf: 'center',
        textAlign: 'center',
        width: scaleWidth(300)
    },
});

export default PayPalWebview;
