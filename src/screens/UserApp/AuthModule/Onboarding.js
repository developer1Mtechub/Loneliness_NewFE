import React, { useRef, useEffect, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, Image, Animated, Dimensions } from 'react-native';
import { theme } from '../../../assets';
import { alertLogo, googleIcon, onboardingCurveCenter, onboardingCurveTop, onboardingLabelImg, onboardingLogo, onboarding_img, successText } from '../../../assets/images';
import { scaleHeight, scaleWidth } from '../../../styles/responsive';
import fonts from '../../../styles/fonts';
import Button from '../../../components/ButtonComponent';
import { resetNavigation } from '../../../utils/resetNavigation';
import { SCREENS } from '../../../constant/constants';
import * as Animatable from 'react-native-animatable';
import { firebase } from '@react-native-firebase/auth';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import auth from '@react-native-firebase/auth';
import { WEB_CLIENT_ID } from '@env'
import { useDispatch } from 'react-redux';
import { login } from '../../../redux/AuthModule/signInSlice';
import { getFcmToken } from '../../../configs/firebaseConfig';
import { setAsRemember } from '../../../redux/rememberMeSlice';
import { setTempCred } from '../../../redux/setTempCredentialsSlice';
import { setTempToken } from '../../../redux/AuthModule/signupSlice';
import { useAlert } from '../../../providers/AlertContext';
import Spinner from '../../../components/Spinner';
import Modal from "react-native-modal";
import { configureGoogleSignin, onGoogleButtonPress } from '../../../configs/googleAuth';

const Onboarding = ({ navigation }) => {
    const dispatch = useDispatch();
    const [user, setUser] = useState(null);
    const [idToken, setIdToken] = useState(null);
    const [fcmToken, setFcmToken] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const { showAlert } = useAlert();
    const rotateAnim = useRef(new Animated.Value(0)).current;

    const handleNavigation = () => {
        resetNavigation(navigation, SCREENS.LOGIN)
    }

    useEffect(() => {
        configureGoogleSignin();
    }, [])

    useEffect(() => {
        getFcmToken().then(token => {
            setFcmToken(token);
        });
    }, []);

    async function handleGoogleSignIn() {
        try {
            const result = await onGoogleButtonPress();
            if (result.user && result.idToken) {
                setUser(result.user);
                setIdToken(result.idToken);
                const credentials = {
                    email: result?.user?.email,
                    device_token: fcmToken,
                    signup_type: "GOOGLE",
                }
                var googleToken = result?.idToken;
                var email = result.user?.email;
                dispatch(login(credentials)).then((result) => {

                    if (result?.payload?.status === "success") {
                        // const { is_requirements_completed } = result?.payload?.result?.user
                        // const { role, token } = result?.payload?.result
                        // if (!is_requirements_completed && role === "BUDDY") {
                        //     dispatch(setTempCred({ email: email, isGoogleAuth: true, token_google: googleToken }));
                        //     dispatch(setAsRemember(null));
                        //     dispatch(setTempToken(token))
                        //     resetNavigation(navigation, SCREENS.STRIPE_ACCOUNT_CREATION)
                        //     return
                        // }
                        showHideModal();

                    } else {
                        showAlert("Error", "error", result?.payload?.message)
                    }

                })
            } else {
                console.error('Sign-In failed: No user or token returned');
            }
        } catch (error) {
            console.error('Sign-In Error:', error);
        }
    }


    const showHideModal = () => {
        setModalVisible(true);
        setTimeout(() => {
            setModalVisible(false);
        }, 3000);
    };

    useEffect(() => {
        Animated.timing(rotateAnim, {
            toValue: 1,
            duration: 1000, // Duration set to 10 seconds
            useNativeDriver: true,
        }).start();
    }, [rotateAnim]);

    const rotateInterpolate = rotateAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ['250deg', '360deg'],
    });

    const animatedStyle = {
        transform: [{ rotate: rotateInterpolate }],
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

    return (
        <SafeAreaView style={styles.container}>
            <Image resizeMode='contain'
                style={styles.imageCurveTop}
                source={onboardingCurveTop} />
            <Image resizeMode='contain'
                style={styles.imageLogo}
                source={onboardingLogo} />

            <Image resizeMode='contain'
                style={[styles.imageCurveCenter]}
                source={onboardingCurveCenter} />
            <View style={styles.contentConatiner}>

                <Animatable.View
                    animation="slideInDown"
                    duration={2500}
                >
                    <Image resizeMode='contain'
                        style={[styles.imagebg]}
                        source={onboarding_img} />
                </Animatable.View>



                <Animatable.View animation="fadeIn"
                    duration={3000}
                >
                    <Image resizeMode='contain'
                        style={[styles.imageWithLabel]}
                        source={onboardingLabelImg} />
                </Animatable.View>



                <View style={styles.buttonContainer}>
                    <Button
                        onPress={() => {
                            handleNavigation();
                        }}
                        title={'Log In'}
                    />
                </View>

                <View style={styles.buttonContainer2}>
                    <Button
                        onPress={() => {
                            handleGoogleSignIn();
                        }}
                        title={'Continue with Google'}
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
                            borderColor: theme.dark.secondary
                        }}
                        textCustomStyle={{
                            color: theme.dark.secondary,
                            fontSize: scaleHeight(16),
                        }}
                    />
                </View>

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
            {showModalView()}
        </SafeAreaView>
    );
};


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.dark.background
    },
    contentConatiner: {
        flex: 1,
    },
    imageCurveTop: {
        width: scaleWidth(123),
        height: scaleHeight(110),
        position: 'absolute',
        top: scaleHeight(-10),
        alignSelf: 'flex-end',
        right: scaleWidth(-20)
    },
    imageLogo: {
        width: scaleWidth(79),
        height: scaleHeight(93),
        alignSelf: 'center',
        top: scaleHeight(30)
    },
    imageCurveCenter: {
        width: scaleWidth(123),
        height: scaleHeight(140),
        position: 'absolute',
        top: scaleHeight(150),
        alignSelf: 'flex-start',
        left: scaleWidth(-30),
    },

    imagebg: {
        width: scaleWidth(342),
        height: scaleHeight(383),
        position: 'absolute',
        top: scaleHeight(35),
        alignSelf: 'center',
        //left: scaleWidth(-30),
    },

    imageWithLabel: {
        width: scaleWidth(342),
        height: scaleHeight(383),
        position: 'absolute',
        top: scaleHeight(270),
        alignSelf: 'center',
        //left: scaleWidth(-30),
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
        position: 'absolute',
        bottom: scaleHeight(10)
    },
    buttonContainer: {
        width: '90%',
        alignSelf: 'center',
        position: 'absolute',
        bottom: '11%'
    },
    buttonContainer2: {
        width: '90%',
        alignSelf: 'center',
        position: 'absolute',
        // bottom: scaleHeight(50)
        bottom: '2%'
    }
});


export default Onboarding;
