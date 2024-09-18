//import liraries
import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, Image, TouchableOpacity, TextInput } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import Camera from 'react-native-vector-icons/FontAwesome';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import Modal from "react-native-modal";
import { resetNavigation } from '../../../../../utils/resetNavigation';
import { SCREENS } from '../../../../../constant/constants';
import useBackHandler from '../../../../../utils/useBackHandler';
import { getUserDetail } from '../../../../../redux/BuddyDashboard/userLikesDetailSlice';
import { getAddressByLatLong } from '../../../../../redux/getAddressByLatLongSlice';
import { setRoute } from '../../../../../redux/appSlice';
import Header from '../../../../../components/Header';
import CustomLayout from '../../../../../components/CustomLayout';
import { theme } from '../../../../../assets';
import { editImage, locationPin } from '../../../../../assets/images';
import { scaleHeight, scaleWidth } from '../../../../../styles/responsive';
import CustomTextInput from '../../../../../components/TextInputComponent';
import fonts from '../../../../../styles/fonts';
import HorizontalDivider from '../../../../../components/HorizontalDivider';
import CheckBox from '../../../../../components/CheckboxComponent';
import Button from '../../../../../components/ButtonComponent';
import { HeartIcon } from '../../../../../assets/svgs';
import { useAlert } from '../../../../../providers/AlertContext';
import CategoryList from '../../../../../components/CategoryList';
import { updateProfile } from '../../../../../redux/AuthModule/updateProfileSlice';
import { reverseGeocode } from '../../../../../utils/geoCodeUtils';

const UpdateBuddyProfile = ({ navigation }) => {
    const dispatch = useDispatch();
    const { showAlert } = useAlert();
    const { userDetail } = useSelector((state) => state.getUserDetail)
    const { loading } = useSelector((state) => state.createProfile)
    const { address } = useSelector((state) => state.getAddress)
    const { userLoginInfo } = useSelector((state) => state.auth)
    const user_id = userLoginInfo?.user?.id
    const { currentRoute } = useSelector((state) => state.app)
    const [selectedImage, setSelectedImage] = useState('');
    const [selectedOption, setSelectedOption] = useState('');
    const [modalVisible, setModalVisible] = useState(false);
    const [placeName, setPlaceName] = useState('')
    const [inputValues, setInputValues] = useState({
        full_name: '',
        about: '',
        gender: '',
        location: ''
    });

    const userLocation = userDetail?.location?.country && userDetail?.location?.city
        ? `${userDetail.location.country}, ${userDetail.location.city}`
        : null;

        const addressLocation = (address?.city || address?.town || address?.suburb || address?.country) && address?.country
        ? `${address.city || address.town || address.suburb || address.county  || address.state}, ${address.country}`
        : null;

    const handleBackPress = () => {
        if (currentRoute?.route === SCREENS.MAIN_DASHBOARD) {
            resetNavigation(navigation, SCREENS.MAIN_DASHBOARD, { screen: SCREENS.PROFILE })
        } else {
            resetNavigation(navigation, currentRoute?.route)
        }

        return true;
    };
    useBackHandler(handleBackPress);

    useEffect(() => {
        dispatch(getUserDetail(user_id))
    }, [dispatch, user_id])

    // useEffect(() => {
    //     if (userDetail) {
    //         const { longitude, latitude } = userDetail?.location
    //         dispatch(getAddressByLatLong({
    //             lat: latitude,
    //             long: longitude
    //         }));
    //     }

    // }, [dispatch, userDetail])

    const handleLocation = async () => {

        if (userDetail) {
            const { longitude, latitude } = userDetail?.location
            const address = await reverseGeocode(latitude, longitude);
            setPlaceName(address)
            // dispatch(getAddressByLatLong({
            //     lat: latitude,
            //     long: longitude
            // }));
        }
    };

    useEffect(() => {
        handleLocation();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [userDetail])


    useEffect(() => {
        const {
            full_name,
            about,
            image_urls,
            gender,
            looking_for_gender
        } = userDetail || {};


        setSelectedImage(image_urls && image_urls[0])
        setSelectedOption(looking_for_gender)
        setInputValues(prevValues => ({
            ...prevValues,
            full_name,
            about
        }));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [userDetail]);


    const handleCheckBoxStatusChange = (formField, label, isChecked) => {
        setInputValues({ ...inputValues, gender: label })
    };

    const handleChangeLocation = (screen) => {
        dispatch(setRoute({
            route: SCREENS.UPDATE_USER_PROFILE
        }))
        resetNavigation(navigation, screen)
    }

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

    const handleUpdateInterests = () => {
        dispatch(setRoute({
            route: SCREENS.UPDATE_USER_PROFILE,
            categories: userDetail?.categories
        }))

        resetNavigation(navigation, SCREENS.UPDATE_INTERESTS)
    }

    const handleProfileUpdate = () => {
        const imageType = selectedImage?.file?.endsWith('.png') ? 'image/png' : 'image/jpeg';
        const formData = new FormData();
        formData.append('files', {
            uri: selectedImage,
            type: imageType,
            name: `image_${Date.now()}.${imageType.split('/')[1]}`,
        });
        formData.append('full_name', inputValues?.full_name);
        formData.append('about', inputValues?.about);
        formData.append('looking_for_gender', selectedOption);
        dispatch(updateProfile(formData)).then((result) => {
            if (result?.payload?.status === "success") {
                showAlert("Success", "success", result?.payload?.message)
                setTimeout(() => {
                    handleBackPress();
                }, 3000);
            } else if (result?.payload?.status === "error") {
                showAlert("Error", "error", result?.payload?.message)
            }
        })
    }

    return (
        <SafeAreaView style={styles.container}>
            <Header
                onPress={() => {
                    handleBackPress();
                }}
                title={"Update Profile"}
            />

            <View style={{
                marginHorizontal: 20,
                flex: 1
            }}>

                <CustomLayout>

                    <View style={styles.imagePickerContainer}>
                        <TouchableOpacity
                            onPress={() => {
                                setModalVisible(true);
                            }}
                            style={{
                                width: scaleWidth(90),
                                height: scaleHeight(90),
                                borderWidth: 1,
                                borderColor: theme.dark.heading,
                                backgroundColor: theme.dark.inputBg,
                                borderRadius: 45,
                                justifyContent: 'center',
                                alignItems: 'center'
                            }}>

                            {
                                selectedImage ? <Image
                                    resizeMode='cover'
                                    source={{ uri: selectedImage && selectedImage }}
                                    style={{
                                        width: scaleWidth(90),
                                        height: scaleHeight(90),
                                        borderRadius: 45,
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

                    <CustomTextInput
                        label={"Full Name"}
                        identifier={"full_name"}
                        value={inputValues?.full_name}
                        isColorWhite={true}
                        onValueChange={(text) => setInputValues({ ...inputValues, full_name: text })}
                        mainContainer={{
                            marginTop: scaleHeight(20)
                        }}
                        customInputStyle={{
                            color: theme.dark.white,
                            fontSize: scaleHeight(15),
                            fontFamily: fonts.fontsType.regular,
                        }}

                    />

                    <CustomTextInput
                        label={"About Me"}
                        identifier={"about"}
                        value={inputValues?.about}
                        onValueChange={(text) => setInputValues({ ...inputValues, about: text })}
                        multiline={true}
                        isColorWhite={true}
                        mainContainer={{
                            marginTop: scaleHeight(5)
                        }}

                        customInputStyle={{
                            color: theme.dark.white,
                            fontSize: scaleHeight(15),
                            fontFamily: fonts.fontsType.regular,
                            lineHeight: 26,
                            textAlign: 'justify'
                        }}

                    />

                    <HorizontalDivider customStyle={{
                        marginVertical: 20
                    }} />

                    <View style={{
                        //marginHorizontal: 15,
                        marginTop: scaleHeight(-10)
                    }}>
                        <Text style={{
                            fontFamily: fonts.fontsType.medium,
                            fontSize: scaleHeight(19),
                            color: theme.dark.secondary,
                        }}>
                            Looking For
                        </Text>

                        <View style={{
                            flexDirection: 'row',
                            marginTop: 10,
                            justifyContent: 'space-between',
                        }}>
                            <CheckBox
                                onStatusChange={handleCheckBoxStatusChange}
                                label={"Male"}
                                mode="single"
                                formField={"gender"}
                                selectedOption={selectedOption}
                                setSelectedOption={setSelectedOption}
                                labelStyle={{
                                    color: theme.dark.inputBackground,
                                    fontFamily: fonts.fontsType.semiBold,
                                    fontSize: scaleHeight(15),
                                }} />
                            <CheckBox
                                onStatusChange={handleCheckBoxStatusChange}
                                label={"Female"}
                                mode="single"
                                formField={"gender"}
                                selectedOption={selectedOption}
                                setSelectedOption={setSelectedOption}
                                labelStyle={{
                                    color: theme.dark.inputBackground,
                                    fontFamily: fonts.fontsType.semiBold,
                                    fontSize: scaleHeight(15),
                                }} />

                            <CheckBox
                                onStatusChange={handleCheckBoxStatusChange}
                                label={"Other"}
                                mode="single"
                                formField={"gender"}
                                selectedOption={selectedOption}
                                setSelectedOption={setSelectedOption}
                                labelStyle={{
                                    color: theme.dark.inputBackground,
                                    fontFamily: fonts.fontsType.semiBold,
                                    fontSize: scaleHeight(15),
                                }} />
                        </View>

                    </View>

                    <HorizontalDivider customStyle={{
                        marginVertical: 20
                    }} />

                    <View style={{
                        flexDirection: 'row',
                        marginTop: scaleHeight(-8),
                    }}>
                        <View style={{
                            flexDirection: 'row',
                            flex: 1
                        }}>

                            <Image
                                resizeMode='contain'
                                style={{

                                    width: scaleWidth(18),
                                    height: scaleHeight(18),
                                    alignSelf: 'center',

                                }} source={locationPin} />

                            <Text style={styles.locationText}>
                                {userLocation || placeName || 'Location not available'}
                            </Text>

                        </View>
                        <Button
                            onPress={() => {
                                handleChangeLocation(SCREENS.CHANGE_LOCATION);
                            }}
                            title={"Change"}
                            customStyle={{
                                width: '25%',
                                height: scaleHeight(25),
                                marginBottom: 0,
                                marginTop: 0
                            }}
                            textCustomStyle={{
                                fontSize: scaleHeight(14),
                            }}
                        />

                    </View>

                    <HorizontalDivider customStyle={{
                        marginVertical: 20
                    }} />

                    <View>

                        <View style={{
                            flexDirection: 'row',
                            marginTop: scaleHeight(-8),
                        }}>
                            <View style={{
                                flexDirection: 'row',
                                flex: 1
                            }}>

                                <HeartIcon width={22} height={22} />

                                <Text style={styles.locationText}>{"My Interests"}</Text>

                            </View>
                            <Button
                                onPress={() => {
                                    handleUpdateInterests();
                                }}
                                title={"Update"}
                                customStyle={{
                                    width: '25%',
                                    height: scaleHeight(25),
                                    marginBottom: 0,
                                    marginTop: 0
                                }}
                                textCustomStyle={{
                                    fontSize: scaleHeight(14),
                                }}
                            />

                        </View>

                        <CategoryList
                            categories={userDetail?.categories}
                            isPress={false}
                        />

                    </View>

                    <Button
                        loading={loading}
                        onPress={() => {
                            handleProfileUpdate();
                        }}
                        title={"Update Profile"}
                        customStyle={{
                            marginTop: 50,
                            width: '100%'
                        }} />

                </CustomLayout>
            </View>
            {showModalView()}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.dark.primary,
    },

    modalContainer: {
        backgroundColor: '#111111',
        width: '90%',
        height: scaleHeight(241),
        alignSelf: 'center',
        borderRadius: 20,
        elevation: 20,
        padding: 20,
    },
    modalTitle: {
        color: theme.dark.white,
        fontFamily: fonts.fontsType.medium,
        fontSize: scaleHeight(16),
        flex: 1,
    },
    modalOptions: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        marginTop: scaleHeight(40),
    },
    modalOption: {
        alignItems: 'center',
    },
    optionButton: {
        width: scaleWidth(80),
        height: scaleHeight(80),
        borderWidth: 1,
        borderColor: theme.dark.secondary,
        backgroundColor: 'rgba(252, 226, 32, 0.13)',
        borderRadius: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    optionText: {
        color: theme.dark.white,
        fontFamily: fonts.fontsType.medium,
        fontSize: scaleHeight(16),
        marginTop: scaleHeight(10),
    },
    imagePickerContainer: {
        justifyContent: 'space-evenly',
        alignItems: 'center',
        marginTop: scaleHeight(20),
        flexDirection: 'row',
    },
    imagePicker: {
        width: scaleWidth(100),
        height: scaleHeight(147),
        borderWidth: 1,
        borderColor: theme.dark.heading,
        backgroundColor: theme.dark.inputBg,
        borderRadius: 22,
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: scaleWidth(10),
    },
    plusButton: {
        position: 'absolute',
        bottom: 4,
        right: 8,
    },
    selectedImageStyle: {
        width: scaleWidth(100),
        height: scaleHeight(147),
        borderRadius: 22,
    },
    label: {
        fontFamily: fonts.fontsType.medium,
        fontSize: scaleHeight(17),
        color: theme.dark.inputLabel,
        marginHorizontal: 8,
        top: scaleHeight(20)
    },
    inputContainerStyle: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: theme.dark.inputBg,
        marginTop: scaleHeight(30),
        height: scaleHeight(45),
        borderRadius: 30,
        borderWidth: 1,
        borderColor: theme.dark.text,
        justifyContent: 'space-evenly'
    },
    verticleLine: {
        height: '60%',
        width: 1,
        backgroundColor: '#909090',
    },
    inputStyle: {
        fontFamily: fonts.fontsType.medium,
        fontSize: scaleHeight(18),
        color: theme.dark.inputLabel,
        textAlign: 'center',
        flex: 1
    },
    locationText: {
        color: theme.dark.white,
        fontFamily: fonts.fontsType.regular,
        fontSize: scaleHeight(15),
        width: '90%',
        alignSelf: 'center',
        marginHorizontal: scaleWidth(10)
    },
});

export default UpdateBuddyProfile;
