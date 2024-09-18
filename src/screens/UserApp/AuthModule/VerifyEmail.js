import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';
import { resetNavigation } from '../../../utils/resetNavigation';
import { SCREENS } from '../../../constant/constants';
import useBackHandler from '../../../utils/useBackHandler';
import { theme } from '../../../assets';
import CustomLayout from '../../../components/CustomLayout';
import fonts from '../../../styles/fonts';
import { scaleHeight, scaleWidth } from '../../../styles/responsive';
import Button from '../../../components/ButtonComponent';
import Icon from 'react-native-vector-icons/MaterialIcons'
import {
    CodeField,
    Cursor,
    useBlurOnFulfill,
    useClearByFocusCell,
} from "react-native-confirmation-code-field";
import { useDispatch, useSelector } from 'react-redux';
import { useAlert } from '../../../providers/AlertContext';
import { verifyEmailCode } from '../../../redux/AuthModule/verifyEmailCodeSlice';
import { setDataPayload } from '../../../redux/appSlice';

const CELL_COUNT = 4;

const VerifyEmail = ({ navigation }) => {
    const dispatch = useDispatch();
    const { showAlert } = useAlert();
    const { dataPayload } = useSelector((state) => state.app)
    const { loading } = useSelector((state) => state.verifyEmailCode)
    const [value, setValue] = useState('');
    const ref = useBlurOnFulfill({ value, cellCount: CELL_COUNT });
    const [props, getCellOnLayoutHandler] = useClearByFocusCell({
        value,
        setValue,
    });

    const handleBackPress = () => {
        resetNavigation(navigation, SCREENS.FORGET_PASSWORD)
        return true;
    };
    useBackHandler(handleBackPress);

    const handleResetPassNavigation = () => {
        const payload = {
            email: dataPayload?.email,
            code: value
        }
        dispatch(verifyEmailCode(payload)).then((result) => {
            if (result?.payload?.status === "success") {
                dispatch(setDataPayload(payload));
                showAlert("Success", "success", result?.payload?.message)
                setTimeout(() => {
                    resetNavigation(navigation, SCREENS.RESET_PASSWORD)
                }, 3000);

            } else {
                showAlert("Error", "error", result?.payload?.message)
            }


        })
    }

    return (
        <SafeAreaView style={styles.container}>
            <TouchableOpacity
                onPress={() => {
                    resetNavigation(navigation, SCREENS.FORGET_PASSWORD)
                }}
                style={styles.backButton}>

                <Icon name={'arrow-back'} size={28} color={theme.dark.secondary} />

            </TouchableOpacity>
            <CustomLayout>
                <View style={styles.contentContainer}>
                    <Text style={styles.welcomeText}>
                        Verification 🔐
                    </Text>
                    <Text style={styles.subTitle}>
                        {` A 4 digit verification code has been sent to ${dataPayload?.email} .`}
                    </Text>
                    <View style={{ justifyContent: 'center', marginTop: scaleHeight(80) }}>
                        <CodeField
                            ref={ref}
                            {...props}
                            // Use `caretHidden={false}` when users can't paste a text value, because context menu doesn't appear
                            value={value}
                            onChangeText={setValue}
                            cellCount={CELL_COUNT}
                            rootStyle={styles.codeFieldRoot}
                            keyboardType="number-pad"
                            textContentType="oneTimeCode"
                            renderCell={({ index, symbol, isFocused }) => (
                                <Text
                                    key={index}
                                    style={[styles.cell, isFocused && styles.focusCell]}
                                    onLayout={getCellOnLayoutHandler(index)}
                                >
                                    {symbol || (isFocused ? <Cursor /> : null)}
                                </Text>
                            )}
                        />
                    </View>
                </View>

            </CustomLayout>

            <View style={styles.buttonContainer}>
                <Button
                    loading={loading}
                    onPress={() => {
                        handleResetPassNavigation();
                    }}
                    title={'Verify'}
                />
            </View>

        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.dark.background
    },
    contentContainer: {
        padding: 25,
        flex: 1
    },
    welcomeText: {
        fontFamily: fonts.fontsType.semiBold,
        fontSize: scaleHeight(26),
        color: theme.dark.white,
        marginTop: 15
    },
    subTitle: {
        fontFamily: fonts.fontsType.regular,
        fontSize: scaleHeight(14),
        color: theme.dark.white,
        marginTop: 5
    },
    forgetText: {
        fontFamily: fonts.fontsType.semiBold,
        fontSize: scaleHeight(14),
        color: theme.dark.secondary,
        alignSelf: 'center'
    },
    createAccountText1: {
        fontFamily: fonts.fontsType.regular,
        fontSize: scaleHeight(16),
        color: theme.dark.white
    },
    createAccountText2: {
        fontFamily: fonts.fontsType.bold,
        fontSize: scaleHeight(16),
        color: theme.dark.secondary,
        marginHorizontal: 5
    },
    createAccountItem: {
        flexDirection: 'row',
        alignSelf: 'center',
        marginTop: 30,
    },
    buttonContainer: {
        width: '90%',
        alignSelf: 'center',
        // marginTop: scaleHeight(170)
    },
    createAccountView: {
        flex: 1
    },
    forgetPassContainer: {
        flexDirection: 'row',
        marginTop: 20,
    },
    backButton: {
        paddingHorizontal: 25,
        marginTop: 20
    },
    codeFieldRoot: { marginTop: 50 },
    cell: {
        width: scaleWidth(64),
        height: scaleHeight(50),
        lineHeight: 45,
        fontSize: 24,
        backgroundColor: theme.dark.inputBackground,
        borderColor: theme.dark.text,
        borderWidth: 1,
        textAlign: "center",
        borderRadius: 25,

    },
    focusCell: {
        backgroundColor: 'rgba(252, 226, 32, 0.13)',
        //opacity: 0.13,
        borderWidth: 1,
        lineHeight: 45,
        borderRadius: 25,
        borderColor: theme.dark.secondary,
    },
});


export default VerifyEmail;



