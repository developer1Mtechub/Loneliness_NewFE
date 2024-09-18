import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Image } from 'react-native';
import { resetNavigation } from '../../../utils/resetNavigation';
import { SCREENS } from '../../../constant/constants';
import useBackHandler from '../../../utils/useBackHandler';
import { theme } from '../../../assets';
import CustomTextInput from '../../../components/TextInputComponent';
import CustomLayout from '../../../components/CustomLayout';
import fonts from '../../../styles/fonts';
import { scaleHeight, scaleWidth } from '../../../styles/responsive';
import CheckBox from '../../../components/CheckboxComponent';
import HorizontalDivider from '../../../components/HorizontalDivider';
import Button from '../../../components/ButtonComponent';
import Icon from 'react-native-vector-icons/MaterialIcons'
import EmailIcon from 'react-native-vector-icons/Zocial'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import { login } from '../../../redux/AuthModule/signInSlice';
import { useDispatch, useSelector } from 'react-redux';
import { useAlert } from '../../../providers/AlertContext';
import { alertLogo, successText } from '../../../assets/images';
import Spinner from '../../../components/Spinner';
import Modal from "react-native-modal";
import { setAsRemember } from '../../../redux/rememberMeSlice';
import { setTempCred } from '../../../redux/setTempCredentialsSlice';
import { setTempToken } from '../../../redux/AuthModule/signupSlice';
import { getFcmToken } from '../../../configs/firebaseConfig';

const Login = ({ navigation }) => {
    const dispatch = useDispatch();
    const { loading } = useSelector((state) => state.auth);
    const { rememberMe } = useSelector((state) => state.rememberMe)
    const { showAlert } = useAlert();
    const [form, setForm] = useState({ email: '', password: '' });
    const [errors, setErrors] = useState({ email: '', password: '' });
    const [showPassword, setShowPassword] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [isRemember, setIsRemember] = useState(false);
    const [fcmToken, setFcmToken] = useState(null);


    const handleChange = (name, value) => {
        setForm({ ...form, [name]: value });

        let error = '';
        if (name === 'email') {
            if (value === '') {
                error = 'Email address is required';
            } else if (!validateEmail(value)) {
                error = 'Please enter a valid email address';
            }
        } else if (name === 'password') {
            if (value === '') {
                error = 'Password is required';
            }
        }
        setErrors({ ...errors, [name]: error });
    };

    const handleBackPress = () => {
        resetNavigation(navigation, SCREENS.ONBOARDING)
        return true;
    };
    useBackHandler(handleBackPress);


    useEffect(() => {
        getFcmToken().then(token => {
            setFcmToken(token);
        });
    }, []);

    useEffect(() => {
        if (rememberMe) {
            setForm({ email: rememberMe.email, password: rememberMe.password });
            setIsRemember(true)
        }
    }, [rememberMe]);

    const handleForgetPassNavigation = () => {
        resetNavigation(navigation, SCREENS.FORGET_PASSWORD)
    }

    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const validatePassword = (password) => {
        return password.length >= 6;
    };

    const handleLogin = () => {
        const { email, password } = form;
        let valid = true;
        let newErrors = { email: '', password: '' };

        if (email === '') {
            newErrors.email = 'Email address is required';
            valid = false;
        } else if (!validateEmail(email)) {
            newErrors.email = 'Please enter a valid email address';
            valid = false;
        }

        if (password === '') {
            newErrors.password = 'Password is required';
            valid = false;
        } else if (!validatePassword(password)) {
            newErrors.password = 'Password must be at least 6 characters long';
            valid = false;
        }

        setErrors(newErrors);

        if (valid) {

            const credentials = {
                email: email,
                password: password,
                device_token: fcmToken,
                signup_type: "EMAIL"
            }
            dispatch(login(credentials)).then((result) => {
                if (result?.payload?.status === "success") {
                    // const { is_requirements_completed } = result?.payload?.result?.user
                    // const { role, token } = result?.payload?.result
                    // if (!is_requirements_completed && role === "BUDDY") {
                    //     dispatch(setAsRemember(null));
                    //     dispatch(setTempCred({ email, password }));
                    //     dispatch(setTempToken(token))
                    //     resetNavigation(navigation, SCREENS.STRIPE_ACCOUNT_CREATION)
                    //     return
                    // }
                    showHideModal();
                    if (isRemember) {
                        const rememberPayload = { email: form.email, password: form.password };
                        dispatch(setAsRemember(rememberPayload));

                    } else {
                        dispatch(setAsRemember(null))
                    }

                } else {
                    showAlert("Error", "error", result?.payload?.message)
                }
            })
        }
    };

    const showHideModal = () => {
        setModalVisible(true);
        setTimeout(() => {
            setModalVisible(false);
        }, 3000);
    };

    const showModalView = () => {

        return <Modal
            backdropOpacity={0.90}
            backdropColor={'rgba(85, 85, 85, 0.70)'}
            isVisible={modalVisible}
            animationIn={'bounceIn'}
            animationOut={'bounceOut'}
            animationInTiming={1000}
            animationOutTiming={1000}
        >
            <View style={{
                backgroundColor: '#111111',
                width: '90%',
                height: '50%',
                alignSelf: 'center',
                borderRadius: 20,
                elevation: 20,
                padding: 20
            }}>

                <Image
                    resizeMode='contain'
                    source={alertLogo}
                    style={{
                        width: scaleWidth(120),
                        height: scaleHeight(120),
                        alignSelf: 'center'
                    }}
                />

                <Image
                    resizeMode='contain'
                    source={successText}
                    style={{
                        width: scaleWidth(130),
                        height: scaleHeight(45),
                        alignSelf: 'center',
                        marginTop: 10
                    }}
                />
                <Text style={[styles.subTitle, { alignSelf: 'center', textAlign: 'center', }]}>
                    {`Please wait...${'\n'}You will be directed to the homepage.`}
                </Text>
                <Spinner />
            </View>
        </Modal>
    }

    const handleCheckBoxStatusChange = (formField, label, isChecked) => {
        console.log(`${label} is ${isChecked ? 'checked' : 'unchecked'}`, isChecked);
        setIsRemember(isChecked)
    };

    return (
        <SafeAreaView style={styles.container}>
            <TouchableOpacity
                onPress={() => {
                    resetNavigation(navigation, SCREENS.ONBOARDING)
                }}
                style={styles.backButton}>

                <Icon name={'arrow-back'} size={28} color={theme.dark.secondary} />

            </TouchableOpacity>
            <CustomLayout>
                <View style={styles.contentContainer}>
                    <Text style={styles.welcomeText}>
                        Welcome back 👋🏼
                    </Text>
                    <Text style={styles.subTitle}>
                        Please enter your email & Password to sign in
                    </Text>
                    <CustomTextInput
                        label={'Email Address'}
                        identifier={'email'}
                        value={form.email}
                        onValueChange={(value) => handleChange('email', value)}
                        mainContainer={{ marginTop: 20 }}
                        leftIcon={<EmailIcon
                            style={{
                                marginHorizontal: 8

                            }} name="email" size={20}
                            color={theme.dark.text} />}
                    />
                    {errors.email ? <Text style={styles.errorText}>{errors.email}</Text> : null}
                    <CustomTextInput
                        label={'Password'}
                        identifier={'password'}
                        value={form.password}
                        secureTextEntry={!showPassword}
                        onValueChange={(value) => handleChange('password', value)}
                        leftIcon={<MaterialCommunityIcons
                            style={{
                                marginHorizontal: 8

                            }} name="lock" size={20}
                            color={theme.dark.text} />}
                        mainContainer={{ marginTop: 15 }}
                        iconComponent={
                            <MaterialCommunityIcons
                                onPress={() => {
                                    setShowPassword(!showPassword)
                                }}
                                style={{
                                    marginEnd: 8

                                }} name={!showPassword ? "eye" : "eye-off"} size={20}
                                color={theme.dark.text} />
                        }
                    />
                    {errors.password ? <Text style={styles.errorText}>{errors.password}</Text> : null}
                    <View style={styles.forgetPassContainer}>

                        <View style={{ flex: 1 }}>
                            <CheckBox
                                label={"Remember Me"}
                                onStatusChange={handleCheckBoxStatusChange}
                                formField={"remember_me"}
                                isRemember={true}
                                isChecked={isRemember}
                            />
                        </View>

                        <TouchableOpacity onPress={() => {
                            handleForgetPassNavigation();
                        }}>
                            <Text style={styles.forgetText}>
                                Forget Password?
                            </Text>
                        </TouchableOpacity>

                    </View>
                    <HorizontalDivider
                        customStyle={{
                            marginTop: 40
                        }} />

                    <View

                        style={styles.createAccountItem}
                    >

                        <Text style={styles.createAccountText1}>
                            Don’t have an account?
                        </Text>

                        <Text
                            onPress={() => {
                                resetNavigation(navigation, SCREENS.ROLE_SELECTOR)
                            }}
                            style={styles.createAccountText2}>
                            Create one
                        </Text>

                    </View>

                </View>
            </CustomLayout>
            {showModalView()}
            <View style={styles.buttonContainer}>
                <Button
                    loading={loading}
                    onPress={() => {
                        handleLogin();
                    }}
                    title={'Log In'}
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
        marginTop: 5,
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
        //marginTop: scaleHeight(120)
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
        fontSize: scaleHeight(12),
        color: theme.dark.error,
        marginTop: 5,
        marginHorizontal: 8
    },
});


export default Login;
