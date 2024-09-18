import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, SafeAreaView, ScrollView, Keyboard } from 'react-native';
import Button from '../../../../components/ButtonComponent';
import PremiumItem from '../../../../components/PremiumItem';
import { premiumGift } from '../../../../assets/images';
import { theme } from '../../../../assets';
import { normalizeFontSize, scaleHeight, scaleWidth } from '../../../../styles/responsive';
import fonts from '../../../../styles/fonts';
import { resetNavigation } from '../../../../utils/resetNavigation';
import { SCREENS } from '../../../../constant/constants';
import useBackHandler from '../../../../utils/useBackHandler';
import Header from '../../../../components/Header';
import { useDispatch, useSelector } from 'react-redux';
import FullScreenLoader from '../../../../components/FullScreenLoader';
import { useAlert } from '../../../../providers/AlertContext';
import { updateUserLoginInfo } from '../../../../redux/AuthModule/signInSlice';
import { cancelSubscription } from '../../../../redux/PaymentSlices/cancelSubscriptionSlice';
import { getPlans } from '../../../../redux/PaymentSlices/getPlansSlice';
import { createSubscription } from '../../../../redux/PaymentSlices/createSubscriptionSlice';
import { setRoute } from '../../../../redux/appSlice';

const Premium = ({ navigation }) => {
    const dispatch = useDispatch();
    const { showAlert } = useAlert();
    const { subscription, loading } = useSelector((state) => state.getSubscription)
    const { loading: createSubscriptionLoader } = useSelector((state) => state.createSubscription)
    const { plans, loading: planLoader } = useSelector((state) => state.getPlans)
    const { loading: cancelLoader } = useSelector((state) => state.cancelSubscription)
    const { userLoginInfo } = useSelector((state) => state.auth)
    // const [selectedPlan, setSelectedPlan] = useState('1 Months');
    const [selectedPlan, setSelectedPlan] = useState('1 Months');
    const [planDetail, setPlanDetail] = useState(null);
    const [activePlan, setActivePlan] = useState('');
    const [paymentLoader, setPaymentLoader] = useState(false);
    const { currentRoute } = useSelector((state) => state.app)
    const { is_subscribed, subscription_id, email, id, plan_id } = userLoginInfo?.user
    const buttonTitle = is_subscribed ? "Cancel" : "Subscribe";

    const renderPlanFeatures = () => {
        const featuresByPlan = {
            'Basic Plan': [
                { text: "Unlock premium features for 1 month.", color: theme.dark.secondary },
                { text: "Access advanced matching capabilities.", color: theme.dark.secondary },
                { text: "Send unlimited likes to increase your connections.", color: theme.dark.inputLabel },
                { text: "Flexible monthly pricing for your convenience.", color: theme.dark.inputLabel },
                { text: "Easily upgrade, downgrade, or cancel anytime.", color: theme.dark.inputLabel }
            ],
            'Standard Plan': [
                { text: "Unlock premium features for 6 months.", color: theme.dark.secondary },
                { text: "Access advanced matching capabilities.", color: theme.dark.secondary },
                { text: "Send unlimited likes to increase your connections.", color: theme.dark.secondary },
                { text: "Flexible monthly pricing for your convenience.", color: theme.dark.secondary },
                { text: "Easily upgrade, downgrade, or cancel anytime.", color: theme.dark.inputLabel }
            ],
            'Premium Plan': [
                { text: "Unlock premium features for 12 months.", color: theme.dark.secondary },
                { text: "Access advanced matching capabilities.", color: theme.dark.secondary },
                { text: "Send unlimited likes to increase your connections.", color: theme.dark.secondary },
                { text: "Flexible monthly pricing for your convenience.", color: theme.dark.secondary },
                { text: "Easily upgrade, downgrade, or cancel anytime.", color: theme.dark.secondary }
            ],
        };

        const currentPlanFeatures = featuresByPlan[planDetail?.name] || [];

        return currentPlanFeatures?.map((feature, index) => (
            <PremiumItem
                key={index}
                iconName="checkcircle"
                iconColor={feature.color}
                text={feature.text}
            />
        ));
    };
    const handleBackPress = () => {
        resetNavigation(navigation, SCREENS.MAIN_DASHBOARD, { screen: currentRoute?.isProfilePremium ? SCREENS.PROFILE : SCREENS.HOME });
        return true;
    };
    useBackHandler(handleBackPress);

    const getPlanName = (planName) => {
        return planName?.split(' ')[0];
    };

    useEffect(() => {
        dispatch(getPlans())
    }, [dispatch])

    useEffect(() => {
        if (plans?.length > 0) {
            let selectedPlan = plans?.find(plan => plan.paypal_plan_id === plan_id);
            setActivePlan(selectedPlan?.name)
            // If the plan is not found, return the default "Basic Plan"
            if (!selectedPlan) {
                console.log("Plan not found, returning default Basic Plan.");
                selectedPlan = plans?.find(plan => plan.name === "Basic Plan");
            }

            setPlanDetail(selectedPlan)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [plans]);

    const handleUserUpdate = () => {
        const updatedInfo = {
            is_subscribed: false,
            subscription_id: null,
            plan_id: null
        };
        dispatch(updateUserLoginInfo(updatedInfo));
    };


    const handleCancelSubscription = () => {
        const payload = {
            subscription_id: subscription_id,
            user_id: id
        }
        dispatch(cancelSubscription(payload)).then((result) => {
            // console.log(result?.payload)
            if (result?.payload?.error === false) {
                showAlert("Success", "success", result?.payload?.message)
                setTimeout(() => {
                    handleUserUpdate();
                    dispatch(getPlans())
                }, 2000);
            } else {
                setPaymentLoader(false)
                showAlert("Error", "error", result?.payload?.message)
            }
        })
    }

    const handleSubscribePlan = () => {
        const payload = {
            planId: planDetail?.paypal_plan_id,
            subscriberEmail: email,
            subscriberName: email?.split('@')[0],
            user_id: id,
            return_url: "https://mtechub.com/",
            cancel_url: "https://chats.mtechub.org/"
        }

        dispatch(createSubscription(payload)).then((result) => {
            const { subscription } = result?.payload
            const approveLink = subscription.links.find(link => link.rel === 'approve' && link.method === 'GET');
            const approveHref = approveLink ? approveLink.href : null;
            payPalWebviewNav(approveHref)

        })

    }

    const payPalWebviewNav = (subscriptionUrl) => {
        dispatch(setRoute({
            route: SCREENS.MAIN_DASHBOARD,
            user_id: id,
            isSubscription: true,
            subscriptionUrl: subscriptionUrl
        }))
        resetNavigation(navigation, SCREENS.PAYPAL_WEBVIEW)
    }

    if (planLoader) {
        return <FullScreenLoader loading={planLoader} title={"Please wait fetching plan..."} />
    }

    return (
        <SafeAreaView style={styles.mainContainer}>
            <Header
                onPress={() => handleBackPress()}
                title={"Go Premium"}
            />

            <View style={styles.container}>
                {activePlan != undefined && activePlan != null && <View style={{ flexDirection: 'row' }}>
                    <Text style={styles.activeLabel}>{`Active Package : `}</Text>
                    <Text style={styles.activePackage}>{`${activePlan}`}</Text>
                </View>}
                <View style={styles.giftBox}>
                    <Image
                        resizeMode='contain'
                        style={{
                            width: scaleWidth(250),
                            height: scaleHeight(150),
                            alignSelf: 'center',
                        }}
                        source={premiumGift}
                    />
                </View>
                <View style={styles.buttonGroup}>
                    {plans?.map(plan => (
                        <TouchableOpacity
                            key={Math.round(plan.price)}
                            style={[styles.button, planDetail?.name === plan.name && styles.selectedButton]}
                            onPress={() => {
                                setSelectedPlan(getPlanName(plan.name))
                                setPlanDetail(plan)
                            }}
                        >
                            <Text style={[styles.buttonText, planDetail?.name === plan.name && styles.selectedText]}>
                                {`${Math.floor(plan.price)}`}
                            </Text>
                            <Text style={[styles.buttonSubText, planDetail?.name === plan.name && styles.selectedSubText]}>
                                {getPlanName(plan.name)}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>

                <View style={styles.featuresList}>
                    {renderPlanFeatures()}
                </View>

                <Button
                    loading={(is_subscribed && cancelLoader) || createSubscriptionLoader}
                    onPress={() => {
                        is_subscribed ? handleCancelSubscription() : handleSubscribePlan();
                    }}
                    title={buttonTitle}
                />
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: theme.dark.primary,
    },
    container: {
        padding: 25,
        alignItems: 'center',
    },
    giftBox: {
        width: 100,
        height: 100,
        marginTop: scaleHeight(10),
    },
    buttonGroup: {
        width: '100%',
        height: scaleHeight(94),
        flexDirection: 'row',
        marginBottom: 20,
        marginTop: scaleHeight(80),
        backgroundColor: theme.dark.inputBg,
        borderRadius: 14,
    },
    button: {
        width: scaleWidth(99),
        height: scaleHeight(80),
        backgroundColor: theme.dark.transparentBg,
        padding: 10,
        margin: 5,
        alignItems: 'center',
        borderRadius: 10,
        justifyContent: 'center',
    },
    selectedButton: {
        backgroundColor: theme.dark.secondary,
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonText: {
        color: theme.dark.inputLabel,
        fontSize: scaleHeight(16),
        fontFamily: fonts.fontsType.bold,
        alignSelf: 'center',
    },
    selectedText: {
        color: theme.dark.primary,
        fontSize: scaleHeight(16),
        alignSelf: 'center',
        fontFamily: fonts.fontsType.bold,
    },
    selectedSubText: {
        color: theme.dark.primary,
        fontSize: scaleHeight(14),
        alignSelf: 'center',
        fontFamily: fonts.fontsType.bold,
    },
    buttonSubText: {
        color: theme.dark.inputLabel,
        fontSize: scaleHeight(14),
        fontFamily: fonts.fontsType.regular,
        alignSelf: 'center',
    },
    featuresList: {
        marginBottom: 20,
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        zIndex: 100,
        justifyContent: 'center',
        alignItems: 'center',
    },
    cardHeading: {
        fontFamily: fonts.fontsType.semiBold,
        fontSize: 16,
        color: theme.dark.primary,
        alignSelf: 'center',
        marginBottom: 20
    },
    activeLabel: {
        fontFamily: fonts.fontsType.medium,
        fontSize: normalizeFontSize(14),
        color: theme.dark.white
    },
    activePackage: {
        fontFamily: fonts.fontsType.bold,
        fontSize: normalizeFontSize(14),
        color: theme.dark.success
    }
});

export default Premium;

