import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Image } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import { useDispatch, useSelector } from 'react-redux';
import { useAlert } from '../../providers/AlertContext';
import { resetNavigation } from '../../utils/resetNavigation';
import { SCREENS } from '../../constant/constants';
import useBackHandler from '../../utils/useBackHandler';
import { scaleHeight, scaleWidth } from '../../styles/responsive';
import CustomLayout from '../../components/CustomLayout';
import { theme } from '../../assets';
import CustomTextInput from '../../components/TextInputComponent';
import Button from '../../components/ButtonComponent';
import fonts from '../../styles/fonts';
import Header from '../../components/Header';
import { changePassword } from '../../redux/AuthModule/changePasswordSlice';

const ChangePassword = ({ navigation }) => {
    const dispatch = useDispatch();
    const { loading } = useSelector((state) => state.changePassword)
    const { showAlert } = useAlert();
    const [form, setForm] = useState({ newPassword: '', confirmPassword: '', oldPassword: '' });
    const [errors, setErrors] = useState({ newPassword: '', confirmPassword: '' });
    const [showPassword, setShowPassword] = useState(false);
    const [confirmPassShow, setConfirmPassShow] = useState(false);
    const [oldPassword, setOldPassword] = useState(false);

    const handleChange = (name, value) => {
        setForm({ ...form, [name]: value });

        let error = '';
        if (name === 'oldPassword') {
            if (value === '') {
                error = 'Old Password is required.';
            }
        }
        else if (name === 'newPassword') {
            if (value === '') {
                error = 'Password is required.';
            } else if (!validatePassword(value)) {
                error = 'Password must be at least 6 characters long.';
            }
        } else if (name === 'confirmPassword') {
            if (value === '') {
                error = 'Confirm Password is required.';
            }

        }
        setErrors({ ...errors, [name]: error });
    };

    const handleBackPress = () => {
        resetNavigation(navigation, SCREENS.MAIN_DASHBOARD, { screen: SCREENS.PROFILE })
        return true;
    };
    useBackHandler(handleBackPress);

    const validatePassword = (password) => {
        return password.length >= 6;
    };

    const handleResetPassword = () => {
        const { newPassword, confirmPassword, oldPassword } = form;
        let valid = true;
        let newErrors = { newPassword: '', confirmPassword: '', oldPassword:'' };

        if (oldPassword === '') {
            newErrors.oldPassword = 'Old Password is required.';
            valid = false;
        }

        else if (newPassword === '') {
            newErrors.newPassword = 'New Password is required.';
            valid = false;
        } else if (!validatePassword(newPassword)) {
            newErrors.newPassword = 'Password must be at least 6 characters long.';
            valid = false;
        }

        if (confirmPassword === '') {
            newErrors.confirmPassword = 'Confirm Password is required';
            valid = false;
        }

        else if (confirmPassword != newPassword) {
            newErrors.confirmPassword = 'Password does not match.';
            valid = false;
        }

        setErrors(newErrors);

        if (valid) {

            const payload = {
                old_password: oldPassword,
                new_password: newPassword,
                confirm_password: confirmPassword
            }

            dispatch(changePassword(payload)).then((result) => {
                if (result?.payload?.status === "success") {
                    showAlert("Success", "success", result?.payload?.message)
                    setTimeout(() => {
                        handleBackPress();
                    }, 3000);
                } else {
                    showAlert("Error", "error", result?.payload?.message)
                }
            })

        }
    };


    return (
        <SafeAreaView style={styles.container}>
            <Header
                onPress={() => {
                    handleBackPress();
                }}
                title={"Change Password"} />
            <CustomLayout>
                <View style={styles.contentContainer}>

                    <CustomTextInput
                        label={'Old Password'}
                        identifier={'oldPassword'}
                        value={form.oldPassword}
                        secureTextEntry={!oldPassword}
                        onValueChange={(value) => handleChange('oldPassword', value)}
                        iconComponent={
                            <MaterialCommunityIcons
                                onPress={() => {
                                    setOldPassword(!oldPassword)
                                }}
                                style={{
                                    marginEnd: 8

                                }} name={!oldPassword ? "eye" : 'eye-off'} size={20}
                                color={theme.dark.text} />
                        }
                    />
                    {errors.oldPassword ? <Text style={styles.errorText}>{errors.oldPassword}</Text> : null}

                    <CustomTextInput
                        label={'New Password'}
                        identifier={'newPassword'}
                        value={form.newPassword}
                        secureTextEntry={!showPassword}
                        onValueChange={(value) => handleChange('newPassword', value)}
                        mainContainer={{ marginTop: 15 }}
                        iconComponent={
                            <MaterialCommunityIcons
                                onPress={() => {
                                    setShowPassword(!showPassword)
                                }}
                                style={{
                                    marginEnd: 8

                                }} name={!showPassword ? "eye" : 'eye-off'} size={20}
                                color={theme.dark.text} />
                        }
                    />
                    {errors.newPassword ? <Text style={styles.errorText}>{errors.newPassword}</Text> : null}
                    <CustomTextInput
                        label={'Confirm Password'}
                        identifier={'confirmPassword'}
                        value={form.confirmPassword}
                        secureTextEntry={!confirmPassShow}
                        onValueChange={(value) => handleChange('confirmPassword', value)}
                        mainContainer={{ marginTop: 15 }}
                        iconComponent={
                            <MaterialCommunityIcons
                                onPress={() => {
                                    setConfirmPassShow(!confirmPassShow)
                                }}
                                style={{
                                    marginEnd: 8

                                }} name={!confirmPassShow ? "eye" : 'eye-off'} size={20}
                                color={theme.dark.text} />
                        }
                    />
                    {errors.confirmPassword ? <Text style={styles.errorText}>{errors.confirmPassword}</Text> : null}

                </View>

            </CustomLayout>
            <View style={styles.buttonContainer}>
                <Button
                    loading={loading}
                    onPress={() => {
                        handleResetPassword();
                    }}
                    title={'Change Password'}
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
        //textAlign:'center'
    },

    buttonContainer: {
        width: '90%',
        alignSelf: 'center',
        //marginTop: scaleHeight(120)
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


export default ChangePassword;

