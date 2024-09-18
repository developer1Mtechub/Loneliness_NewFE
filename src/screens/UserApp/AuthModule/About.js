import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Image, FlatList, TextInput, ScrollView } from 'react-native';
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
import { BottomSheet } from "@rneui/themed";
import Icon from 'react-native-vector-icons/MaterialIcons'
import { useDispatch, useSelector } from 'react-redux';
import { setDataPayload } from '../../../redux/appSlice';

const About = ({ navigation }) => {
    const dispatch = useDispatch();
    const { dataPayload } = useSelector((state) => state.app);
    const [form, setForm] = useState({ about: '' });
    const [errors, setErrors] = useState({ about: '' });

    const handleChange = (name, value) => {
        setForm({ ...form, [name]: value });

        let error = '';
        if (name === 'about') {
            if (value === '') {
                error = 'Please write something.';
            }
        }
        setErrors({ ...errors, [name]: error });
    };

    const handleBackPress = () => {
        resetNavigation(navigation, SCREENS.PROFILE_PICTURE)
        return true;
    };
    useBackHandler(handleBackPress);

    useEffect(() => {
        if (dataPayload?.about) {
            setForm({
                about: dataPayload.about
            })
        }

    }, [dataPayload]);

    const handleAbout = () => {
        const { about } = form;
        let valid = true;
        let newErrors = { about: '' };

        if (about === '') {
            newErrors.about = 'Please write something.';
            valid = false;
        }

        setErrors(newErrors);

        if (valid) {
            const newPayload = { ...dataPayload, about };
            dispatch(setDataPayload(newPayload))
            resetNavigation(navigation, SCREENS.BIRTH_DATE)
        }
    };


    return (
        <SafeAreaView style={styles.container}>
            <ProfileProgressBar progress={40} onPress={() => {
                resetNavigation(navigation, SCREENS.PROFILE_PICTURE)
            }} />
            <CustomLayout>
                <View style={styles.contentContainer}>
                    <Text style={styles.welcomeText}>
                        Tell Us About Yourself
                    </Text>
                    <Text style={styles.subTitle}>
                        Tell us about yourself so others can get to know you.
                    </Text>
                    <View style={styles.inputContainer}>
                        <CustomTextInput
                            identifier={'about'}
                            value={form.about}
                            onValueChange={(value) => { handleChange('about', value) }}
                            mainContainer={{ marginTop: 50 }}
                            customInputStyle={{}}
                            customContainerStyle={{}}
                            multiline={true}
                        />
                        <Text style={styles.textLength}>
                            {
                                `${form?.about?.length}/250`
                            }
                        </Text>
                    </View>
                    {errors.about ? <Text style={styles.errorText}>{errors.about}</Text> : null}

                </View>

            </CustomLayout>

            <View style={styles.buttonContainer}>

                <HorizontalDivider
                    customStyle={{
                        marginTop: 40
                    }} />

                <Button
                    onPress={() => {
                        handleAbout();
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
        // marginTop: scaleHeight(200),
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
        fontSize: scaleHeight(12),
        color: theme.dark.error,
        marginTop: 8,
        marginHorizontal: scaleWidth(15),
    },
    inputContainer: {
        position: 'relative',
    },
    textLength: {
        position: 'absolute',
        right: 15,
        top: 40,
        fontSize: 12,
        fontFamily: fonts.fontsType.medium,
        color: theme.dark.secondary,
    },
});


export default About;
