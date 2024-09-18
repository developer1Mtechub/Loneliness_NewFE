import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, FlatList, SafeAreaView, Image, TouchableOpacity, StyleSheet } from 'react-native';
import Button from '../../components/ButtonComponent';
import Header from '../../components/Header';
import CustomTextInput from '../../components/TextInputComponent';
import { SCREENS } from '../../constant/constants';
import { resetNavigation } from '../../utils/resetNavigation';
import useBackHandler from '../../utils/useBackHandler';
import { theme } from '../../assets';
import fonts from '../../styles/fonts';
import { scaleHeight } from '../../styles/responsive';
import { useDispatch, useSelector } from 'react-redux';
import { useAlert } from '../../providers/AlertContext';
import { cancelPayment } from '../../redux/UserDashboard/cancelPaymentSlice';
import { setRoute } from '../../redux/appSlice';
import { actionCancelPayment } from '../../redux/BuddyDashboard/actionCancelPaymentSlice';

const PaymentCancellation = ({ navigation }) => {
    const dispatch = useDispatch();
    const { loading } = useSelector((state) => state.cancelPayment)
    const { loading: acceptPaymentLoader } = useSelector((state) => state.actionCancelPayment)
    const { currentRoute } = useSelector((state) => state.app)
    const { role } = useSelector((state) => state.auth)
    const { showAlert } = useAlert()
    const [reason, setReason] = useState('');

    const handleBackPress = () => {

        if (role === "USER" && currentRoute?.route === SCREENS.SERVICES) {
            resetNavigation(navigation, SCREENS.MAIN_DASHBOARD, { screen: SCREENS.SERVICES })
            return
        }

        dispatch(setRoute({
            route: SCREENS.MAIN_DASHBOARD,
            request_id: currentRoute?.request_id,
        }))
        resetNavigation(navigation, currentRoute?.route)
        return true;
    };
    useBackHandler(handleBackPress);

    const handleCancelPayment = () => {

        const payload = {
            request_id: currentRoute?.request_id,
            reason: reason
        }
        dispatch(cancelPayment(payload)).then((result) => {
            if (result?.payload?.status === "success") {
                showAlert("Success", "success", result?.payload?.message);
                setTimeout(() => {
                    handleBackPress();
                }, 3000);

            } else if (result?.payload?.status === "error") {
                showAlert("Error", "error", result?.payload?.message)
            }
        })
    }

    const handleBuddyCancelPayment = () => {

        const payload = {
            request_id: currentRoute?.request_id,
            reason: reason,
            user_id: currentRoute?.user_id,
            action: "REJECTED"
        }
        dispatch(actionCancelPayment(payload)).then((result) => {
            if (result?.payload?.status === "success") {
                showAlert("Success", "success", result?.payload?.message);
                setTimeout(() => {
                    handleBackPress();
                }, 3000);

            } else if (result?.payload?.status === "error") {
                showAlert("Error", "error", result?.payload?.message)
            }
        })
    }

    return (
        <SafeAreaView style={styles.safeArea}>
            <Header
                onPress={() => {
                    handleBackPress();
                }}
            />
            <Text style={styles.headerText}>Tell us the reason why are you cancelling the payment?</Text>
            <View style={styles.listContainer}>
                <CustomTextInput
                    label={"Add Reason"}
                    identifier={'reason'}
                    value={reason}
                    onValueChange={(value) => setReason(value)}
                    mainContainer={{}}
                    customInputStyle={{}}
                    customContainerStyle={{}}
                    multiline={true}
                />

            </View>
            <Button
                loading={role === "USER" ? loading : acceptPaymentLoader}
                onPress={() => {
                    role === "USER" ? handleCancelPayment() : handleBuddyCancelPayment();
                }}
                title={'Submit Reason'}
                customStyle={{ marginBottom: scaleHeight(30) }}
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        backgroundColor: theme.dark.primary,
        flex: 1,
    },
    headerText: {
        fontFamily: fonts.fontsType.semiBold,
        fontSize: 18,
        color: theme.dark.white,
        alignSelf: 'center',
        textAlign: 'center',
        marginTop: 20,
        width: '90%',
    },
    subHeaderText: {
        fontFamily: fonts.fontsType.light,
        fontSize: 15,
        color: theme.dark.inputLabel,
        alignSelf: 'center',
        textAlign: 'center',
        marginTop: 20,
        width: '90%',
    },
    listContainer: {
        padding: 20,
        marginTop: '2%',
        flex: 2,
    },
    item: {
        marginVertical: 8,
        height: 45,
        overflow: 'hidden',
        borderRadius: 40,
        borderWidth: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    itemText: {
        fontFamily: fonts.fontsType.medium,
        fontSize: 14,
        marginHorizontal: 15,
    }
});

export default PaymentCancellation;
