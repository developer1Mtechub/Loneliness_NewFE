import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Image } from 'react-native';
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
import { BottomSheet, Overlay } from "@rneui/themed";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import Camera from 'react-native-vector-icons/FontAwesome'
import EvilIcons from 'react-native-vector-icons/EvilIcons'
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { requestCameraPermission } from '../../../utils/cameraPermission';
import Modal from "react-native-modal";
import { editImage } from '../../../assets/images';
import { useAlert } from '../../../providers/AlertContext';
import { useDispatch, useSelector } from 'react-redux';
import { setDataPayload } from '../../../redux/appSlice';

const ProfilePicture = ({ navigation }) => {
    const dispatch = useDispatch();
    const { dataPayload } = useSelector((state) => state.app);
    const { showAlert } = useAlert();
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedImage, setSelectedImage] = useState('');

    const handleBackPress = () => {
        resetNavigation(navigation, SCREENS.PHONE_NUMBER)
        return true;
    };
    useBackHandler(handleBackPress);


    useEffect(() => {
        if (dataPayload?.file) {
            setSelectedImage(dataPayload?.file)
        }
    }, [dataPayload]);



    const handleNavigation = () => {
        if (selectedImage) {
            const newPayload = { ...dataPayload, file: selectedImage };
            dispatch(setDataPayload(newPayload))
            resetNavigation(navigation, SCREENS.ABOUT);
        } else {
            showAlert("Error", "error", "Add at least 1 photo to continue.")
        }
    };

    const openImagePicker = () => {
        setModalVisible(false)
        const options = {
            mediaType: 'photo',
            includeBase64: false,
            maxHeight: 2000,
            maxWidth: 2000,
        };
        launchImageLibrary(options, (response) => {
            if (response.didCancel) {
                console.log('User cancelled image picker');
            } else if (response.error) {
                console.log('Image picker error: ', response.error);
            } else {
                let imageUri = response.uri || response.assets?.[0]?.uri;
                setSelectedImage(imageUri);
            }
        });
    };

    const handleCameraLaunch = () => {
        setModalVisible(false)
        const options = {
            mediaType: 'photo',
            includeBase64: false,
            maxHeight: 2000,
            maxWidth: 2000,
            cameraType: 'front', // Use 'back' for the rear camera
        };

        launchCamera(options, response => {
            if (response.didCancel) {
                console.log('User cancelled camera');
            } else if (response.error) {
                console.log('Camera Error: ', response.error);
            } else {
                let imageUri = response.uri || response.assets?.[0]?.uri;
                setSelectedImage(imageUri);
                console.log(imageUri);
            }
        });
    }


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
                height: scaleHeight(241),
                alignSelf: 'center',
                borderRadius: 20,
                elevation: 20,
                padding: 20
            }}>
                <View style={{ flexDirection: 'row' }}>
                    <Text style={{
                        color: theme.dark.white,
                        fontFamily: fonts.fontsType.medium,
                        fontSize: scaleHeight(16),
                        flex: 1
                    }}>Upload photos from</Text>

                    <Icon
                        onPress={() => {
                            setModalVisible(false);
                        }}
                        size={24}
                        color={theme.dark.white}
                        name='close' style={{

                        }} />
                </View>

                <View style={{ flexDirection: 'row', justifyContent: 'space-evenly' }}>

                    <View style={{ marginTop: scaleHeight(40) }}>

                        <TouchableOpacity
                            onPress={() => {
                                openImagePicker();
                            }}
                            style={{
                                width: scaleWidth(80),
                                height: scaleHeight(80),
                                borderWidth: 1,
                                borderColor: theme.dark.secondary,
                                backgroundColor: 'rgba(252, 226, 32, 0.13)',
                                borderRadius: 40,
                                justifyContent: 'center',
                                alignItems: 'center',
                                alignSelf: 'center'
                            }}>

                            <EvilIcons size={40} color={theme.dark.secondary} name='image' />

                        </TouchableOpacity>

                        <Text style={{
                            color: theme.dark.white,
                            fontFamily: fonts.fontsType.medium,
                            fontSize: scaleHeight(16),
                            marginTop: scaleHeight(10)

                        }}>Your photos</Text>

                    </View>


                    <View style={{ marginTop: scaleHeight(40) }}>

                        <TouchableOpacity
                            onPress={() => {
                                handleCameraLaunch();
                            }}
                            style={{
                                width: scaleWidth(80),
                                height: scaleHeight(80),
                                borderWidth: 1,
                                borderColor: theme.dark.secondary,
                                backgroundColor: 'rgba(252, 226, 32, 0.13)',
                                borderRadius: 40,
                                justifyContent: 'center',
                                alignItems: 'center',
                                alignSelf: 'center'
                            }}>

                            <Camera size={26} color={theme.dark.secondary} name='camera' />

                        </TouchableOpacity>

                        <Text style={{
                            color: theme.dark.white,
                            fontFamily: fonts.fontsType.medium,
                            fontSize: scaleHeight(16),
                            marginTop: scaleHeight(10)

                        }}>From Camera</Text>

                    </View>

                </View>



            </View>
        </Modal>
    }

    return (
        <SafeAreaView style={styles.container}>
            <ProfileProgressBar progress={30} onPress={() => {
                resetNavigation(navigation, SCREENS.PHONE_NUMBER)
            }} />
            <CustomLayout>
                <View style={styles.contentContainer}>
                    <Text style={styles.welcomeText}>
                        Show Your Best Self
                    </Text>
                    <Text style={styles.subTitle}>
                        Upload your best photos to make a fantastic first impression. Let your personality shine.
                    </Text>
                    <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: scaleHeight(50) }}>

                        <TouchableOpacity
                            onPress={() => {
                                setModalVisible(true);
                            }}
                            style={{
                                width: scaleWidth(120),
                                height: scaleHeight(120),
                                borderWidth: 1,
                                borderColor: theme.dark.heading,
                                backgroundColor: theme.dark.inputBg,
                                borderRadius: 100,
                                justifyContent: 'center',
                                alignItems: 'center'
                            }}>

                            {
                                selectedImage ? <Image
                                    resizeMode='cover'
                                    source={{ uri: selectedImage && selectedImage }}
                                    style={{
                                        width: scaleWidth(120),
                                        height: scaleHeight(120),
                                        borderRadius: 100,
                                    }}
                                /> :
                                    <Camera size={30} color={theme.dark.heading} name='camera' />
                            }


                            {
                                !selectedImage ? <Icon
                                    onPress={() => {
                                        setModalVisible(true);
                                    }}
                                    size={24}
                                    color={theme.dark.secondary}
                                    name='plus-circle' style={{
                                        position: 'absolute',
                                        bottom: -2,
                                        right: 12
                                    }} />

                                    : <Image source={editImage} style={[{
                                        width: scaleWidth(40), height: scaleHeight(40), position: 'absolute',
                                        bottom: -10,
                                        right: 8
                                    }]} />

                            }

                        </TouchableOpacity>

                    </View>

                </View>

                <View style={styles.buttonContainer}>

                    <HorizontalDivider
                        customStyle={{
                            marginTop: 40
                        }} />

                    <Button
                        onPress={() => {
                            handleNavigation();
                        }}
                        title={'Continue'}
                        customStyle={{ backgroundColor: !selectedImage ? '#E7E7E7' : theme.dark.secondary }}
                        textCustomStyle={{ color: !selectedImage ? '#6C6C6C' : theme.dark.black }}
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

    buttonContainer: {
        width: '90%',
        alignSelf: 'center',
        marginTop: scaleHeight(250),
        marginBottom: scaleHeight(20)
    },

    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 22,
    },
    modalView: {
        margin: 20,
        backgroundColor: 'black',
        borderRadius: 20,
        padding: 35,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    textStyle: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    modalText: {
        marginBottom: 15,
        textAlign: 'center',
        color: 'white',
    },
    optionsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
    },
    optionButton: {
        backgroundColor: '#FFEB3B',
        padding: 20,
        borderRadius: 10,
        margin: 10,
    },
    optionText: {
        color: 'black',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    closeButton: {
        backgroundColor: 'red',
        padding: 10,
        borderRadius: 20,
        position: 'absolute',
        top: 10,
        right: 10,
    },

});


export default ProfilePicture;
