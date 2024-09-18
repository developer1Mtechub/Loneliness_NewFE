import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, Image, } from 'react-native';
import { resetNavigation } from '../../../utils/resetNavigation';
import { SCREENS } from '../../../constant/constants';
import useBackHandler from '../../../utils/useBackHandler';
import { theme } from '../../../assets';
import CustomLayout from '../../../components/CustomLayout';
import fonts from '../../../styles/fonts';
import { scaleHeight, scaleWidth } from '../../../styles/responsive';
import HorizontalDivider from '../../../components/HorizontalDivider';
import Button from '../../../components/ButtonComponent';
import ProfileProgressBar from '../../../components/ProfileProgressBar';
import { accountCreated, alertLogo, mapImg, successText, success_alert_img } from '../../../assets/images';
import { color } from '@rneui/base';
import Modal from "react-native-modal";
import Spinner from '../../../components/Spinner';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from '../../../providers/AuthProvider';
import { useDispatch, useSelector } from 'react-redux';
import { useAlert } from '../../../providers/AlertContext';
import { requestLocationPermission } from '../../../utils/cameraPermission';
import Geolocation from '@react-native-community/geolocation';
import { setDataPayload } from '../../../redux/appSlice';
import { updateProfile } from '../../../redux/AuthModule/updateProfileSlice';
import { login } from '../../../redux/AuthModule/signInSlice';
import { setAsRemember } from '../../../redux/rememberMeSlice';
import { setWarningContent } from '../../../redux/warningModalSlice';
import { getFcmToken } from '../../../configs/firebaseConfig';

const EnableLocation = ({ navigation }) => {
    const dispatch = useDispatch();
    const { showAlert } = useAlert();
    const { warningContent } = useSelector((state) => state.warningContent);
    const { loading } = useSelector((state) => state.createProfile);
    const { dataPayload } = useSelector((state) => state.app);
    const { credentials } = useSelector((state) => state.tempCredentials);
    const [modalVisible, setModalVisible] = useState(false);
    const [isWarning, setIsWarning] = useState(true);
    const [fcmToken, setFcmToken] = useState(null);
    //console.log('dataPayload', dataPayload)
    console.log('credentials', credentials)


    const handleBackPress = () => {
        resetNavigation(navigation, SCREENS.YOUR_INTERESTS)
        return true;
    };
    useBackHandler(handleBackPress);

    useEffect(() => {
        getFcmToken().then(token => {
            setFcmToken(token);
        });
    }, []);

    const handleWithCurrentLocation = async () => {
        try {
            const granted = await requestLocationPermission();
            if (granted) {
                console.log('Permission granted!');

                const getPosition = () => new Promise((resolve, reject) => {
                    Geolocation.getCurrentPosition(resolve, reject);
                });

                const { coords: { latitude, longitude } } = await getPosition();
                const newPayload = { ...dataPayload, latitude, longitude };
                const imageType = newPayload?.file?.endsWith('.png') ? 'image/png' : 'image/jpeg';
                const formData = new FormData();

                formData.append('files', {
                    uri: newPayload?.file,
                    type: imageType,
                    name: `image_${Date.now()}.${imageType.split('/')[1]}`,
                });
                formData.append('full_name', newPayload?.userName);
                formData.append('about', newPayload?.about);
                formData.append('gender', newPayload?.gender);
                formData.append('looking_for_gender', newPayload?.looking_for_gender);
                formData.append('category_ids', JSON.stringify(newPayload?.category_ids));
                formData.append('latitude', newPayload?.latitude);
                formData.append('longitude', newPayload?.longitude);
                formData.append('dob', newPayload?.dob);
                formData.append('phone_country_code', newPayload?.phone_country_code?.replace('+', ''));
                formData.append('phone_number', newPayload?.phone_number);
                //console.log(JSON.stringify(formData))
                //dispatch(setDataPayload(newPayload));
                dispatch(updateProfile(formData)).then((result) => {
                    //console.log('result data', result?.payload)
                    if (result?.payload?.status === "success") {
                        //showHideModal();
                        dispatch(setWarningContent(true))
                        setIsWarning(false)
                    } else if (result?.payload?.status === "error") {
                        showAlert("Error", "error", result?.payload?.message)
                    }
                })


            } else {
                console.log('Permission denied!');
            }
        } catch (error) {
            console.error('Error during login:', error);
        }
    };

    useEffect(() => {
        if (!warningContent.modalVisible && !isWarning) {
            showHideModal();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [warningContent, isWarning])

    const handleWithManualLocation = () => {
        resetNavigation(navigation, SCREENS.ADD_LOCATION)
    }

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
                    {`Please wait...${'\n'}You will be directed to the homepage.`}
                </Text>
                <Spinner />
            </View>
        </Modal>
    }


    return (
        <SafeAreaView style={styles.container}>
            <ProfileProgressBar progress={100} onPress={() => {
                resetNavigation(navigation, SCREENS.YOUR_INTERESTS)
            }} />
            <CustomLayout>
                <View style={styles.contentContainer}>

                    <Image style={styles.imageStyle} source={mapImg} />

                    <Text style={styles.welcomeText}>
                        Enable Location
                    </Text>
                    <Text style={styles.subTitle}>
                        You need to enable location to be able to use the Loneliness App.
                    </Text>

                </View>

                <View style={styles.buttonContainer}>

                    <HorizontalDivider
                        customStyle={{
                            marginTop: 40
                        }} />

                    <Button
                        loading={loading}
                        onPress={() => {
                            handleWithCurrentLocation();
                        }}
                        title={'Use My Current Location'}
                        customStyle={{
                            marginBottom: scaleHeight(10)
                        }}
                    />

                    <Button
                        onPress={() => {
                            handleWithManualLocation();
                        }}
                        title={'Enter Location Manually'}
                        customStyle={{
                            backgroundColor: theme.dark.transparentBg,
                            borderColor: theme.dark.secondary,
                            borderWidth: 1,
                            marginTop: scaleHeight(5)
                        }}
                        textCustomStyle={{
                            color: theme.dark.secondary
                        }}
                    />
                </View>

            </CustomLayout>
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
        flex: 1,
        top: scaleHeight(100)
    },
    welcomeText: {
        fontFamily: fonts.fontsType.semiBold,
        fontSize: scaleHeight(22),
        color: theme.dark.white,
        marginTop: 15,
        alignSelf: 'center'
    },
    subTitle: {
        fontFamily: fonts.fontsType.regular,
        fontSize: scaleHeight(14),
        color: theme.dark.heading,
        marginTop: 5,
        alignSelf: 'center',
        textAlign: 'center',
        width: scaleWidth(300)
    },
    buttonContainer: {
        width: '90%',
        alignSelf: 'center',
        marginTop: scaleHeight(180),
        marginBottom: scaleHeight(20)
    },

    imageStyle: {
        width: scaleWidth(150),
        height: scaleHeight(150),
        marginTop: scaleHeight(30),
        alignSelf: 'center'
    }
});


export default EnableLocation;
