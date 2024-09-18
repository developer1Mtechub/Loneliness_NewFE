import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import { resetNavigation } from '../../../utils/resetNavigation';
import { SCREENS } from '../../../constant/constants';
import useBackHandler from '../../../utils/useBackHandler';
import { theme } from '../../../assets';
import CustomTextInput from '../../../components/TextInputComponent';
import CustomLayout from '../../../components/CustomLayout';
import fonts from '../../../styles/fonts';
import { scaleHeight, scaleWidth } from '../../../styles/responsive';
import HorizontalDivider from '../../../components/HorizontalDivider';
import Button from '../../../components/ButtonComponent';
import ProfileProgressBar from '../../../components/ProfileProgressBar';
import { useDispatch, useSelector } from 'react-redux';
import { setDataPayload } from '../../../redux/appSlice';

const UserName = ({ navigation }) => {
    const dispatch = useDispatch();
    const { dataPayload } = useSelector((state) => state.app)
    const [form, setForm] = useState({ userName: '' });
    const [errors, setErrors] = useState({ userName: '' });

    const handleChange = (name, value) => {
        setForm({ ...form, [name]: value });

        let error = '';
        if (name === 'userName') {
            if (value === '') {
                error = 'User Name is required';
            }
        }
        setErrors({ ...errors, [name]: error });
    };

    const handleBackPress = () => {
        resetNavigation(navigation, SCREENS.SIGNUP)
        return true;
    };
    useBackHandler(handleBackPress);

    useEffect(() => {
        if (dataPayload?.userName) {
            setForm({
                userName: dataPayload?.userName
            })
        }

    }, [dataPayload]);

    const handleUserName = () => {
        const { userName } = form;
        let valid = true;
        let newErrors = { userName: '' };

        if (userName === '') {
            newErrors.userName = 'User Name is required';
            valid = false;
        }

        setErrors(newErrors);

        if (valid) {
            const newPayload = { ...dataPayload, userName };
            dispatch(setDataPayload(newPayload))
            resetNavigation(navigation, SCREENS.PHONE_NUMBER)
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <ProfileProgressBar progress={10} onPress={() => {
                resetNavigation(navigation, SCREENS.SIGNUP)
            }} />
            <CustomLayout>
                <View style={styles.contentContainer}>
                    <Text style={styles.welcomeText}>
                        Your Loneliness Identity
                    </Text>
                    <Text style={styles.subTitle}>
                        Tell us your full name that represents you. It’s how other will know and remember you.
                    </Text>
                    <CustomTextInput
                        identifier={'userName'}
                        value={form.userName}
                        placeholder={"User Name"}
                        onValueChange={(value) => handleChange('userName', value)}
                        mainContainer={{ marginTop: 50 }}
                        customInputStyle={{ textAlign: 'left', marginStart: 20, }}
                        customContainerStyle={{ height: scaleHeight(60) }}
                    />
                    {errors.userName ? <Text style={styles.errorText}>{errors.userName}</Text> : null}

                </View>
            </CustomLayout>

            <View style={styles.buttonContainer}>

                <HorizontalDivider
                    customStyle={{
                        marginTop: 40
                    }} />

                <Button
                    onPress={() => {
                        handleUserName();
                    }}
                    title={'Continue'}
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
        fontSize: scaleHeight(22),
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
        // marginTop: scaleHeight(300),
        // marginBottom: scaleHeight(20)
    },
    createAccountView: {
        flex: 1
    },
    forgetPassContainer: {
        flexDirection: 'row',
        marginTop: 20,
    },
    backButton: {
        alignSelf: 'center'
    },
    errorText: {
        fontFamily: fonts.fontsType.regular,
        fontSize: scaleHeight(14),
        color: theme.dark.error,
        marginTop: 5,
        marginHorizontal: 8
    },
});


export default UserName;
