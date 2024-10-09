import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, Image } from 'react-native';
import { resetNavigation } from '../../../utils/resetNavigation';
import { SCREENS } from '../../../constant/constants';
import useBackHandler from '../../../utils/useBackHandler';
import { theme } from '../../../assets';
import CustomTextInput from '../../../components/TextInputComponent';
import CustomLayout from '../../../components/CustomLayout';
import fonts from '../../../styles/fonts';
import { scaleHeight, scaleWidth } from '../../../styles/responsive';
import Button from '../../../components/ButtonComponent';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import ProfileProgressBar from '../../../components/ProfileProgressBar';
import Modal from "react-native-modal";
import { accountCreated, alertLogo, successText } from '../../../assets/images';
import Spinner from '../../../components/Spinner';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from '../../../providers/AuthProvider';
import { login } from '../../../redux/AuthModule/signInSlice';
import { useDispatch, useSelector } from 'react-redux';
import { useAlert } from '../../../providers/AlertContext';
import { setDataPayload } from '../../../redux/appSlice';
import { updateProfile } from '../../../redux/AuthModule/updateProfileSlice';
import { setWarningContent } from '../../../redux/warningModalSlice';
import { getFcmToken } from '../../../configs/firebaseConfig';
import { setAsRemember } from '../../../redux/rememberMeSlice';



const BuddyAddLocation = ({ navigation }) => {
    const dispatch = useDispatch();
    const { showAlert } = useAlert();
    const { dataPayload } = useSelector((state) => state.app);
    const { credentials } = useSelector((state) => state.tempCredentials);
    const { warningContent } = useSelector((state) => state.warningContent);
    const [isWarning, setIsWarning] = useState(true);
    const [fcmToken, setFcmToken] = useState(null);

    const [modalVisible, setModalVisible] = useState(false);
    const [form, setForm] = useState({ address: '', country: '', state: '', postal_code: '', city: '' });
    const [errors, setErrors] = useState({ address: '', country: '', state: '', postal_code: '', city: '' });

    const handleChange = (name, value) => {
        setForm({ ...form, [name]: value });

        let error = '';
        if (name === 'address') {
            if (value === '') {
                error = 'Address is required';
            }
        } else if (name === 'country') {
            if (value === '') {
                error = 'Country is required';
            }
        } else if (name === 'state') {
            if (value === '') {
                error = 'State is required';
            }
        } else if (name === 'postal_code') {
            if (value === '') {
                error = 'Postal Code is required';
            }
        } else if (name === 'city') {
            if (value === '') {
                error = 'City is required';
            }
        }

        setErrors({ ...errors, [name]: error });
    };

    const handleBackPress = () => {
        resetNavigation(navigation, SCREENS.BUDDY_ENABLE_LOCATION)
        return true;
    };
    useBackHandler(handleBackPress);

    useEffect(() => {
        getFcmToken().then(token => {
            setFcmToken(token);
        });
    }, []);

    useEffect(() => {
        if (!warningContent.modalVisible && !isWarning) {
            showHideModal();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [warningContent, isWarning])

    const handleAddLocation = async () => {

        const { address, country, state, postal_code, city } = form;
        let valid = true;
        let newErrors = { address: '', country: '', state: '', postal_code: '', city: '' };

        if (address === '') {
            newErrors.address = 'Address is required.';
            valid = false;
        }

        if (country === '') {
            newErrors.country = 'Country is required.';
            valid = false;
        }

        if (state === '') {
            newErrors.state = 'State is required.';
            valid = false;
        }

        if (postal_code === '') {
            newErrors.postal_code = 'Postal Code is required.';
            valid = false;
        }

        if (city === '') {
            newErrors.city = 'City is required.';
            valid = false;
        }

        setErrors(newErrors);

        if (valid) {
            const newPayload = { ...dataPayload, address, country, state, postal_code, city };
            const imageType = newPayload?.profile_pics[0]?.endsWith('.png') ? 'image/png' : 'image/jpeg';
            const formData = new FormData();

            newPayload?.profile_pics?.forEach((image, index) => {
                if (image && image.trim()) {
                    formData.append('files', {
                        uri: image,
                        type: imageType,
                        name: `image_${Date.now()}_${index}.${imageType.split('/')[1]}`,
                    });
                }
            });

            // newPayload?.profile_pics?.forEach((image, index) => {
            //     formData.append('files', {
            //         uri: image,
            //         type: imageType,
            //         name: `image_${Date.now()}_${index}.${imageType.split('/')[1]}`,
            //     });
            // });
            formData.append('full_name', newPayload?.userName);
            formData.append('about', newPayload?.about);
            formData.append('gender', newPayload?.gender);
            formData.append('category_ids', JSON.stringify(newPayload?.category_ids));
            formData.append('latitude', newPayload?.latitude);
            formData.append('longitude', newPayload?.longitude);
            formData.append('address', newPayload?.address);
            formData.append('country', newPayload?.country);
            formData.append('postal_code', newPayload?.postal_code);
            formData.append('city', newPayload?.city);
            formData.append('state', newPayload?.state);
            formData.append('height_ft', newPayload?.height_ft);
            formData.append('height_in', newPayload?.height_in);
            formData.append('weight', newPayload?.weight);
            formData.append('weight_unit', newPayload?.weight_unit);
            formData.append('hourly_rate', newPayload?.hourly_rate);
            formData.append('languages', JSON.stringify(newPayload?.languages));
            formData.append('dob', newPayload?.birthDate);
            //dispatch(setDataPayload(newPayload));
            dispatch(updateProfile(formData)).then((result) => {
                if (result?.payload?.status === "success") {
                    dispatch(setWarningContent(true))
                    setIsWarning(false)
                    //resetNavigation(navigation, SCREENS.STRIPE_ACCOUNT_CREATION)
                    //showHideModal();
                } else if (result?.payload?.status === "error") {
                    showAlert("Error", "error", result?.payload?.message)
                }
            })
        }
    };

    const showHideModal = () => {
        dispatch(setAsRemember(null))
        setModalVisible(true);
        dispatch(login({
            email: credentials?.email,
            ...(!credentials?.isGoogleAuth && { password: credentials?.password }),
            device_token: fcmToken,
            signup_type: credentials?.isGoogleAuth ? "GOOGLE" : "EMAIL",
            ...(credentials?.isGoogleAuth && { token_google: credentials?.token_google }),
        }));
        setTimeout(() => {
            setModalVisible(false);
        }, 6000);
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
                    source={accountCreated}
                    style={{
                        width: scaleWidth(130),
                        height: scaleHeight(45),
                        alignSelf: 'center',
                        marginTop: 10
                    }}
                />
                <Text style={[styles.subTitle, { alignSelf: 'center', textAlign: 'center', }]}>
                    {`Please wait...${'\n'}You will be directed to the homepage`}
                </Text>


                <Spinner />


            </View>
        </Modal>
    }

    return (
        <SafeAreaView style={styles.container}>
            <ProfileProgressBar title={"Add Location"} progress={50} onPress={() => {
                resetNavigation(navigation, SCREENS.BUDDY_ENABLE_LOCATION)
            }} />
            <CustomLayout>
                <View style={styles.contentContainer}>
                    <CustomTextInput
                        label={'Address'}
                        identifier={'address'}
                        value={form.address}
                        onValueChange={(value) => handleChange('address', value)}
                        mainContainer={{ marginTop: 20 }}
                    />
                    {errors.address ? <Text style={styles.errorText}>{errors.address}</Text> : null}
                    <CustomTextInput
                        label={'Country'}
                        placeholder={"Select Country"}
                        identifier={'country'}
                        value={form.country}
                        onValueChange={(value) => handleChange('country', value)}
                        mainContainer={{ marginTop: 15 }}
                        iconComponent={
                            <MaterialIcons
                                style={{
                                    marginEnd: 8

                                }} name={"keyboard-arrow-down"} size={24}
                                color={theme.dark.text} />
                        }
                    />
                    {errors.country ? <Text style={styles.errorText}>{errors.country}</Text> : null}

                    <View style={{
                        flexDirection: 'row',
                        justifyContent: 'space-evenly',

                    }}>

                        <View style={{
                            marginTop: 15, flex: 1, marginHorizontal: scaleWidth(4)
                        }}>
                            <CustomTextInput
                                label={'State'}
                                identifier={'state'}
                                value={form.state}
                                onValueChange={(value) => handleChange('state', value)}
                            // mainContainer={{ marginTop: 15, flex: 1, marginHorizontal: scaleWidth(4) }}
                            />
                            {errors.state ? <Text style={styles.errorText}>{errors.state}</Text> : null}
                        </View>


                        <View style={{
                            marginTop: 15, flex: 1, marginHorizontal: scaleWidth(4)
                        }}>
                            <CustomTextInput
                                label={'Postal Code'}
                                identifier={'postal_code'}
                                value={form.postal_code}
                                onValueChange={(value) => handleChange('postal_code', value)}
                            //mainContainer={{ marginTop: 15, flex: 1, marginHorizontal: scaleWidth(4) }}
                            />
                            {errors.postal_code ? <Text style={[styles.errorText, { width: '100%' }]}>{errors.postal_code}</Text> : null}
                        </View>


                    </View>

                    <CustomTextInput
                        label={'City'}
                        identifier={'city'}
                        value={form.city}
                        onValueChange={(value) => handleChange('city', value)}
                        mainContainer={{ marginTop: 15 }}
                    />
                    {errors.city ? <Text style={styles.errorText}>{errors.city}</Text> : null}

                </View>

            </CustomLayout>
            <View style={styles.buttonContainer}>
                <Button
                    onPress={() => {
                        handleAddLocation()
                    }}
                    title={'Add Location'}
                />
            </View>
            {showModalView()}
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
        // marginTop: scaleHeight(100),
        // marginBottom: scaleHeight(30)
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


export default BuddyAddLocation;
