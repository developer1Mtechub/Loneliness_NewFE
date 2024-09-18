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

const BuddyPhoneNumber = ({ navigation }) => {
    const [form, setForm] = useState({ PhoneNumber: '', countryCode: '' });
    const [errors, setErrors] = useState({ PhoneNumber: '' });
    const [countrySheet, setCountrySheetVisible] = useState(false);
    const [countries, setCountries] = useState([]);

    const handleChange = (name, value) => {
        setForm({ ...form, [name]: value });

        let error = '';
        if (name === 'PhoneNumber') {
            if (value === '') {
                error = 'Phone number is required';
            }
        }
        setErrors({ ...errors, [name]: error });
    };

    const handleBackPress = () => {
        resetNavigation(navigation, SCREENS.USER_NAME)
        return true;
    };
    useBackHandler(handleBackPress);

    const handleLoginNavigation = () => {
        resetNavigation(navigation, SCREENS.SIGNUP)
    }

    useEffect(() => {

        const fetchCountries = async () => {

            const requestOptions = {
                method: "GET",
                redirect: "follow"
            };
            try {

                const fetchCountriesPromis = fetch("https://restcountries.com/v3.1/all", requestOptions)
                    .then((response) => response.json())
                    .then((result) => {
                        setCountries(result)
                    })
                    .catch((error) => console.error(error));

                await Promise.all([fetchCountriesPromis]);
            } catch (error) {
                console.error("Error fetching data: ", error);
            }

        }

        fetchCountries();
    }, [])


    const handlePhoneNumber = () => {
        const { PhoneNumber } = form;
        let valid = true;
        let newErrors = { PhoneNumber: '' };

        if (PhoneNumber === '') {
            newErrors.PhoneNumber = 'Phone number is required';
            valid = false;
        }

        setErrors(newErrors);

        if (valid) {
            // Proceed with PhoneNumber logic
        }
    };

    const renderCountryItem = ({ item, index }) => {
        return <TouchableOpacity
            key={index}
            onPress={() => {
                handleChange('countryCode', `${item?.cca2} ${item?.idd?.root}${item?.idd?.suffixes}`)
                setCountrySheetVisible(false)
            }}

            style={{

            }}>

            <HorizontalDivider
                customStyle={{
                    marginTop: 10,
                }} />

            <View style={{ flexDirection: 'row' }}>

                <Image resizeMode='contain' style={{
                    height: scaleHeight(22),
                    width: scaleWidth(30),
                    alignSelf: 'center'
                }}
                    source={{ uri: item?.flags?.png }} />
                <Text style={{
                    color: theme.dark.white,
                    fontFamily: fonts.fontsType.regular,
                    fontSize: scaleHeight(16),
                    marginHorizontal: 10,
                    flex: 1,
                    alignSelf: 'center'
                }}>
                    {item?.name?.common}
                </Text>

                <Text style={{
                    color: theme.dark.white,
                    fontFamily: fonts.fontsType.regular,
                    fontSize: scaleHeight(16),
                    alignSelf: 'center',
                    //marginEnd: scaleWidth(10)
                }}>
                    {`${item?.idd?.root ? item?.idd?.root : 'N/A'}${item?.idd?.suffixes ? item?.idd?.suffixes[0] : ''}`}
                </Text>

            </View>

        </TouchableOpacity>
    }

    const renderCountrySheet = () => {
        return <BottomSheet
            onBackdropPress={() =>
                setCountrySheetVisible(false)

            }
            modalProps={{}} isVisible={countrySheet}>
            <View
                style={{
                    width: "100%",
                    height: scaleHeight(800),
                    padding: 20,

                    backgroundColor: theme.dark.background
                }}
            >

                <View style={{ flexDirection: 'row', marginBottom: scaleHeight(20), }}>

                    <TouchableOpacity
                        onPress={() => {
                            setCountrySheetVisible(false)
                        }}
                        style={styles.backButton}>
                        <Icon name={'arrow-back'} size={28} color={theme.dark.secondary} />

                    </TouchableOpacity>

                    <View style={{
                        width: '80%',
                        height: scaleHeight(42),
                        borderRadius: 20,
                        borderWidth: 0.5,
                        borderColor: 'white',
                        backgroundColor: 'transparent',
                        marginHorizontal: 10,
                        justifyContent: 'center',
                        flexDirection: 'row',
                        alignItems: 'center'
                    }}>
                        <Icon name={'search'} size={22} color={theme.dark.white} style={{ marginHorizontal: 8 }} />

                        <TextInput
                            placeholder='Search here'
                            placeholderTextColor={theme.dark.white}
                            style={{
                                fontFamily: fonts.fontsType.light,
                                fontSize: scaleHeight(14),
                                color: theme.dark.white,
                                flex: 1,


                            }} />
                    </View>

                </View>

                <FlatList
                    data={countries}
                    renderItem={renderCountryItem}
                    extraData={(index) => index}
                />

            </View>
        </BottomSheet>
    }

    return (
        <SafeAreaView style={styles.container}>
            <ProfileProgressBar progress={20} onPress={() => {
                resetNavigation(navigation, SCREENS.USER_NAME)
            }} />
            <CustomLayout>
                <View style={styles.contentContainer}>
                    <Text style={styles.welcomeText}>
                        Enter Your Phone Number
                    </Text>
                    <Text style={styles.subTitle}>
                        We only use phone number numbers to make sure everyone on Loneliness is real.
                    </Text>
                    <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                        <CustomTextInput
                            onPress={() => {
                                setCountrySheetVisible(true)
                            }}
                            identifier={'countryCode'}
                            value={form.countryCode}
                            placeholder={"US +1"}
                            inputType={'number-pad'}
                            onValueChange={(value) => handleChange('countryCode', value)}
                            mainContainer={{ marginTop: 50 }}
                            customInputStyle={{ textAlign: 'center', marginStart: 0 }}
                            customContainerStyle={{ height: scaleHeight(55), width: scaleWidth(90) }}

                        />
                        <CustomTextInput
                            identifier={'PhoneNumber'}
                            value={form.PhoneNumber}
                            placeholder={"Phone Number"}
                            inputType={'number-pad'}
                            onValueChange={(value) => handleChange('PhoneNumber', value)}
                            mainContainer={{ marginTop: 50 }}
                            customInputStyle={{}}
                            customContainerStyle={{ height: scaleHeight(55), width: scaleWidth(210), marginHorizontal: 10 }}
                        />
                    </View>
                    {errors.PhoneNumber ? <Text style={styles.errorText}>{errors.PhoneNumber}</Text> : null}

                </View>

                <View style={styles.buttonContainer}>


                    <View style={{ flexDirection: 'row' }}>
                        <Icon name={'lock'} size={24} color={theme.dark.white} style={{ marginHorizontal: 8, alignSelf: 'center' }} />
                        <Text style={[styles.subTitle, { width: scaleWidth(300), color: theme.dark.white }]}>
                            We never share this with anyone and it won’t be on your profile.
                        </Text>
                    </View>

                    <HorizontalDivider
                        customStyle={{
                            marginTop: 40
                        }} />

                    <Button
                        onPress={() => {
                            //handlePhoneNumber();
                            resetNavigation(navigation, SCREENS.PROFILE_PICTURE)
                        }}
                        title={'Continue'}
                    />
                </View>

            </CustomLayout>

            {renderCountrySheet()}

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
        marginTop: scaleHeight(250),
        marginBottom: scaleHeight(20)
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
});


export default BuddyPhoneNumber;
