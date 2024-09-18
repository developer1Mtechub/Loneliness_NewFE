import React, { Component, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, Image, ScrollView, Linking } from 'react-native';
import { theme } from '../../assets';
import Header from '../../components/Header';
import { deleteAccount } from '../../assets/images';
import { scaleHeight, scaleWidth } from '../../styles/responsive';
import fonts from '../../styles/fonts';
import { resetNavigation } from '../../utils/resetNavigation';
import { SCREENS } from '../../constant/constants';
import useBackHandler from '../../utils/useBackHandler';
import { useDispatch, useSelector } from 'react-redux';
import Button from '../../components/ButtonComponent';
import { useAlert } from '../../providers/AlertContext';
import { deleteUserAccount } from '../../redux/deleteAccountSlice';
import { logout } from '../../redux/AuthModule/signInSlice';
import { clearState } from '../../redux/AuthModule/signupSlice';
import { setCurrentUserIndex } from '../../redux/currentUserIndexSlice';
import { setLastIndex } from '../../redux/setIndexesSlice';
import { setIsAppOpened } from '../../redux/appOpenedSlice';


const DeleteAccount = ({ navigation }) => {
    const dispatch = useDispatch();
    const { showAlert } = useAlert();
    const { loading } = useSelector((state) => state.deleteAccount);

    const handleBackPress = () => {
        resetNavigation(navigation, SCREENS.MAIN_DASHBOARD, { screen: SCREENS.PROFILE })
        return true;
    };
    useBackHandler(handleBackPress);

    const handleLogout = () => {
        dispatch(logout());
        dispatch(clearState());
        dispatch(setCurrentUserIndex(null));
        dispatch(setLastIndex(0));
        dispatch(setIsAppOpened(false))
    }

    const handleDeleteAccount = () => {

        dispatch(deleteUserAccount()).then((result) => {
            if (result?.payload?.status === "success") {
                showAlert("Success", "success", result?.payload?.message);
                setTimeout(() => {
                    handleBackPress();
                    handleLogout();
                }, 3000);
            } else if (result?.payload?.status === "error") {
                showAlert("Error", "error", result?.payload?.message)
            }
        })

    }

    const handleEmailLink = () => {
        Linking.openURL('mailto:Loneliness.Support@gmail.com');
    };

    return (
        <SafeAreaView style={styles.container}>

            <Header
                onPress={() => {
                    handleBackPress();
                }}
                title={"Delete Account"} />

            <ScrollView style={{
                flex: 1,
                marginHorizontal: 20
            }}>

                <Image style={{
                    width: scaleWidth(152),
                    height: scaleHeight(152),
                    alignSelf: 'center',
                }} source={deleteAccount} />

                <View style={styles.textContainer}>
                    <Text style={styles.text}>{"By deleting your account, you will lose access to all your data associated with this account. However, you have the option to retrieve your data within 90 days of deletion by sending an email request to our administrative team at "}
                        <Text style={styles.email} onPress={handleEmailLink}>Loneliness.Support@gmail.com</Text>
                    </Text>
                    <Text style={styles.text}>
                        {"In the body of the email, provide the following complete profile credentials:"}
                    </Text>
                    <Text style={styles.text}>{". Username:"}</Text>
                    <Text style={styles.text}>{". Email Address:"}</Text>
                    <Text style={styles.text}>{". Full Name:"}</Text>
                    <Text style={styles.text}>{"Any Additional Information (if applicable):"}</Text>
                    <Text style={styles.text}>{"Please ensure that the provided information matches the details associated with your deleted account."}</Text>
                </View>

                <Button
                    loading={loading}
                    title={"Delete Account"}
                    onPress={() => {
                        handleDeleteAccount()
                    }}
                    customStyle={{ marginTop: 30 }}
                />

            </ScrollView>

        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.dark.primary
    },
    textContainer: {
        // paddingHorizontal: 8,
    },
    text: {
        fontFamily: fonts.fontsType.regular,
        fontSize: scaleHeight(15),
        lineHeight: 24,
        color: theme.dark.heading,
        textAlign: 'left',
        marginBottom: 10,
    },
    email: {
        color: theme.dark.secondary,
        textDecorationLine: 'underline',
        fontFamily: fonts.fontsType.semiBold,
        fontSize: scaleHeight(15)
    },
});

export default DeleteAccount;
