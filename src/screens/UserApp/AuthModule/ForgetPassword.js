import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';
import { resetNavigation } from '../../../utils/resetNavigation';
import { SCREENS } from '../../../constant/constants';
import useBackHandler from '../../../utils/useBackHandler';
import { theme } from '../../../assets';
import CustomTextInput from '../../../components/TextInputComponent';
import CustomLayout from '../../../components/CustomLayout';
import fonts from '../../../styles/fonts';
import { scaleHeight } from '../../../styles/responsive';
import CheckBox from '../../../components/CheckboxComponent';
import HorizontalDivider from '../../../components/HorizontalDivider';
import Button from '../../../components/ButtonComponent';
import Icon from 'react-native-vector-icons/MaterialIcons'
import EmailIcon from 'react-native-vector-icons/Zocial'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import { useDispatch, useSelector } from 'react-redux';
import { setDataPayload } from '../../../redux/appSlice';
import { verifyEmail } from '../../../redux/AuthModule/verifyEmailSlice';
import { useAlert } from '../../../providers/AlertContext';

const ForgetPassword = ({ navigation }) => {
    const dispatch = useDispatch();
    const { showAlert } = useAlert();
    const { loading } = useSelector((state) => state.verifyEmail)
    const [form, setForm] = useState({ email: '' });
    const [errors, setErrors] = useState({ userName: '' });



    const handleBackPress = () => {
        resetNavigation(navigation, SCREENS.LOGIN)
        return true;
    };
    useBackHandler(handleBackPress);

    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const handleChange = (name, value) => {
        setForm({ ...form, [name]: value });

        let error = '';
        if (name === 'email') {
            if (value === '') {
                error = 'Email address is required.';
            } else if (!validateEmail(value)) {
                error = 'Please enter a valid email address.';
            }
        }
        setErrors({ ...errors, [name]: error });
    };

    const handleVerifyEmailNavigation = () => {
        const { email } = form;
        let valid = true;
        let newErrors = { email: '' };

        if (email === '') {
            newErrors.email = 'Email address is required.';
            valid = false;
        } else if (!validateEmail(email)) {
            newErrors.email = 'Please enter a valid email address.';
            valid = false;
        }

        setErrors(newErrors);

        if (valid) {
            const payload = {
                email: email
            }
            dispatch(verifyEmail(payload)).then((result) => {
                if (result?.payload?.status === "success") {
                    showAlert("Success", "success", result?.payload?.message)
                    setTimeout(() => {
                        const newPayload = { email };
                        dispatch(setDataPayload(newPayload))
                        resetNavigation(navigation, SCREENS.VERIFY_EMAIL)
                    }, 3000);

                } else {
                    showAlert("Error", "error", result?.payload?.message)
                }


            })

        }
    };


    return (
        <SafeAreaView style={styles.container}>
            <TouchableOpacity
                onPress={() => {
                    resetNavigation(navigation, SCREENS.LOGIN)
                }}
                style={styles.backButton}>

                <Icon name={'arrow-back'} size={28} color={theme.dark.secondary} />

            </TouchableOpacity>
            <CustomLayout>
                <View style={styles.contentContainer}>
                    <Text style={styles.welcomeText}>
                        Forget Password 🔑
                    </Text>
                    <Text style={styles.subTitle}>
                        Lost Your Way? Let's Get You Back In by resetting your password.
                    </Text>
                    <CustomTextInput
                        label={'Email Address'}
                        identifier={'email'}
                        mainContainer={{ marginTop: scaleHeight(70) }}
                        value={form.email}
                        onValueChange={(value) => handleChange('email', value)}
                        leftIcon={<EmailIcon
                            style={{
                                marginHorizontal: 8

                            }} name="email" size={20}
                            color={theme.dark.text} />}
                    />

                    {errors.email ? <Text style={styles.errorText}>{errors.email}</Text> : null}
                </View>

            </CustomLayout>

            <View style={styles.buttonContainer}>
                <Button
                    loading={loading}
                    onPress={() => {
                        handleVerifyEmailNavigation();
                    }}
                    title={'Send Code'}
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
        //marginTop: scaleHeight(170)
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
    errorText: {
        fontFamily: fonts.fontsType.regular,
        fontSize: scaleHeight(14),
        color: theme.dark.error,
        marginTop: 5,
        marginHorizontal: 8
    },
});


export default ForgetPassword;

