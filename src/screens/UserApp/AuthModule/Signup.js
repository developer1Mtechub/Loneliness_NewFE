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
import ProfileProgressBar from '../../../components/ProfileProgressBar';
import { signupUser } from '../../../redux/AuthModule/signupSlice';
import { useDispatch, useSelector } from 'react-redux';
import { useAlert } from '../../../providers/AlertContext';
import { setTempCred } from '../../../redux/setTempCredentialsSlice';
import { googleIcon } from '../../../assets/images';
import { configureGoogleSignin, onGoogleButtonPress } from '../../../configs/googleAuth';

const Signup = ({ navigation }) => {
    const dispatch = useDispatch();
    const { showAlert } = useAlert();
    const { dataPayload } = useSelector((state) => state.app)
    const { loading } = useSelector((state) => state.signup)
    const [form, setForm] = useState({ email: '', password: '', confirmPassword: '' });
    const [errors, setErrors] = useState({ email: '', password: '', confirmPassword: '' });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPass] = useState(false);

    const handleChange = (name, value) => {
        setForm({ ...form, [name]: value });

        let error = '';
        if (name === 'email') {
            if (value === '') {
                error = 'Email address is required';
            } else if (!validateEmail(value)) {
                error = 'Please enter a valid email address'
            }
        } else if (name === 'password') {
            if (value === '') {
                error = 'Password is required';
            }

            // else if (!validatePassword(value)) {
            //     error = 'Password must be at least 6 characters long';
            // }
        }

        else if (name === 'confirmPassword') {
            if (value === '') {
                error = 'Confirm Password is required';
            }

            // else if (!validatePassword(value)) {
            //     error = 'Password must be at least 6 characters long';
            // }
        }
        setErrors({ ...errors, [name]: error });
    };

    const handleBackPress = () => {
        resetNavigation(navigation, SCREENS.ROLE_SELECTOR)
        return true;
    };
    useBackHandler(handleBackPress);

    const handleLoginNavigation = () => {
        resetNavigation(navigation, SCREENS.LOGIN)
    }

    useEffect(() => {
        configureGoogleSignin();
    }, []);


    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const validatePassword = (password) => {
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
        return passwordRegex.test(password);
    };

    const handleSignup = () => {
        const { email, password, confirmPassword } = form;
        let valid = true;
        let newErrors = { email: '', password: '', confirmPassword: '' };

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
            newErrors.password = 'Password must contain at least 8 characters, one uppercase letter, one lowercase letter, one number and one special character';
            valid = false;
        }

        if (confirmPassword === '') {
            newErrors.confirmPassword = 'Confirm Password is required';
            valid = false;
        } else if (confirmPassword !== password) {
            newErrors.confirmPassword = 'Password does not match.';
            valid = false;
        }

        setErrors(newErrors);

        if (valid) {
            const credentials = {
                email: email,
                password: password,
                confirm_password: confirmPassword,
                role: "USER",
                signup_type: "EMAIL"
            }
            dispatch(signupUser(credentials)).then((result) => {
                if (result?.payload?.status === "success") {
                    dispatch(setTempCred({ email, password, isGoogleAuth: false }));
                    handleSuccessNavigation(result?.payload?.message)
                } else if (result?.payload?.errors) {
                    showAlert("Error", "error", result?.payload?.errors)
                }

                else if (result?.payload?.status === "error") {
                    showAlert("Error", "error", result?.payload?.message)
                }
            })
        }
    };

    const handleGoogleSignIn = async () => {
        try {
            const result = await onGoogleButtonPress();
            if (result.user && result.idToken) {

                const credentials = {
                    email: result.user?.email,
                    role: "USER",
                    signup_type: "GOOGLE",
                    token_google: result.idToken,
                    password: 'Mtechub1@',
                    confirm_password: 'Mtechub1@',
                }
                var googleToken = result?.idToken;
                var email = result.user?.email;
                dispatch(signupUser(credentials)).then((result) => {
                    if (result?.payload?.status === "success") {
                        dispatch(setTempCred({ email: email, isGoogleAuth: true, token_google: googleToken }));
                        handleSuccessNavigation(result?.payload?.message)
                    } else if (result?.payload?.errors) {
                        showAlert("Error", "error", result?.payload?.errors)
                    }

                    else if (result?.payload?.status === "error") {
                        showAlert("Error", "error", result?.payload?.message)
                    }
                })

            }


        } catch (error) {
            console.error('Sign in failed:', error);
        }
    };


    const handleSuccessNavigation = (message) => {
        showAlert("Success", "success", message)
        setTimeout(() => {
            resetNavigation(navigation, SCREENS.USER_NAME)
        }, 3000);
    }

    return (
        <SafeAreaView style={styles.container}>
            <TouchableOpacity
                onPress={() => {
                    resetNavigation(navigation, SCREENS.ROLE_SELECTOR)
                }}
                style={styles.backButton}>

                <Icon name={'arrow-back'} size={28} color={theme.dark.secondary} />

            </TouchableOpacity>
            <CustomLayout>
                <View style={styles.contentContainer}>
                    <Text style={styles.welcomeText}>
                        Create Account 👩🏼‍💻
                    </Text>
                    <Text style={styles.subTitle}>
                        Create account in seconds. We will help you find your perfect match.
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


                    <CustomTextInput
                        label={'Confirm Password'}
                        identifier={'confirmPassword'}
                        value={form.confirmPassword}
                        secureTextEntry={!showConfirmPassword}
                        onValueChange={(value) => handleChange('confirmPassword', value)}
                        leftIcon={<MaterialCommunityIcons
                            style={{
                                marginHorizontal: 8

                            }} name="lock" size={20}
                            color={theme.dark.text} />}
                        mainContainer={{ marginTop: 15 }}
                        iconComponent={
                            <MaterialCommunityIcons
                                onPress={() => {
                                    setShowConfirmPass(!showConfirmPassword)
                                }}
                                style={{
                                    marginEnd: 8

                                }} name={!showConfirmPassword ? "eye" : "eye-off"} size={20}
                                color={theme.dark.text} />
                        }
                    />
                    {errors.confirmPassword ? <Text style={styles.errorText}>{errors.confirmPassword}</Text> : null}

                    {/* <View style={styles.forgetPassContainer}>

                        <View style={{ flex: 1 }}>
                            <CheckBox label={"Remember Me"} />
                        </View>

                    </View> */}
                    <HorizontalDivider
                        customStyle={{
                            marginTop: 40
                        }} />

                    <View
                        style={styles.createAccountItem}
                    >

                        <Text style={styles.createAccountText1}>
                            Already have an account?
                        </Text>

                        <Text
                            onPress={() => {
                                handleLoginNavigation();
                            }}
                            style={styles.createAccountText2}>
                            Log In
                        </Text>

                    </View>

                    <Button
                        onPress={() => {
                            handleGoogleSignIn();
                        }}
                        title={'Signup with Google'}
                        icon={<Image
                            resizeMode='contain'
                            style={{
                                width: scaleWidth(26),
                                height: scaleHeight(26)
                            }}
                            source={googleIcon} />}
                        customStyle={{
                            backgroundColor: theme.dark.transparentBg,
                            borderWidth: 0.5,
                            borderColor: theme.dark.secondary,
                            marginTop: scaleHeight(50),
                        }}
                        textCustomStyle={{
                            color: theme.dark.secondary,
                            fontSize: scaleHeight(16),
                        }}
                    />

                    <Button
                        loading={loading}
                        onPress={() => {
                            !loading && handleSignup();
                        }}
                        title={'Sign Up'}
                        customStyle={{ marginTop: 0 }}
                    />


                </View>


            </CustomLayout>


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
        color: theme.dark.heading,
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
        marginHorizontal: 5,
        textDecorationLine: 'underline'
    },
    createAccountItem: {
        flexDirection: 'row',
        alignSelf: 'center',
        marginTop: 30,
    },
    buttonContainer: {
        width: '90%',
        alignSelf: 'center',
        // marginTop: scaleHeight(50)
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
    buttonContainer2: {
        width: '90%',
        alignSelf: 'center',
    }
});


export default Signup;
