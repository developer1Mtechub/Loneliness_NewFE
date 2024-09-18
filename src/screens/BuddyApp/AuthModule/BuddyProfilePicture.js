import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Image } from 'react-native';
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
import Modal from "react-native-modal";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Camera from 'react-native-vector-icons/FontAwesome';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { useAlert } from '../../../providers/AlertContext';
import { useDispatch, useSelector } from 'react-redux';
import { editImage } from '../../../assets/images';
import { setDataPayload } from '../../../redux/appSlice';
import Cross from 'react-native-vector-icons/Entypo'

const BuddyProfilePicture = ({ navigation }) => {
    const dispatch = useDispatch();
    const { dataPayload } = useSelector((state) => state.app);
    const { showAlert } = useAlert();
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedImages, setSelectedImages] = useState([]);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    const handleBackPress = () => {
        resetNavigation(navigation, SCREENS.BUDDY_USER_NAME);
        return true;
    };
    useBackHandler(handleBackPress);

    useEffect(() => {
        if (dataPayload?.profile_pics) {
            setSelectedImages(dataPayload?.profile_pics)
        }
    }, [dataPayload])

    const openImagePicker = () => {
        setModalVisible(false);
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
                const imageUri = response.uri || response.assets?.[0]?.uri;
                if (currentImageIndex === null) {
                    // Adding a new image
                    setSelectedImages((prevImages) => [...prevImages, imageUri].slice(0, 3));
                } else {
                    // Editing an existing image
                    const updatedImages = [...selectedImages];
                    updatedImages[currentImageIndex] = imageUri;
                    setSelectedImages(updatedImages);
                }
                // const updatedImages = [...selectedImages];
                // updatedImages[currentImageIndex] = imageUri;
                // setSelectedImages([...selectedImages, updatedImages]);
                //setSelectedImages(updatedImages);
            }
        });
    };

    const handleCameraLaunch = () => {
        setModalVisible(false);
        const options = {
            mediaType: 'photo',
            includeBase64: false,
            maxHeight: 2000,
            maxWidth: 2000,
            cameraType: 'front',
        };

        launchCamera(options, (response) => {
            if (response.didCancel) {
                console.log('User cancelled camera');
            } else if (response.error) {
                console.log('Camera Error: ', response.error);
            } else {
                const imageUri = response.uri || response.assets?.[0]?.uri;
                if (currentImageIndex === null) {
                    // Adding a new image
                    setSelectedImages((prevImages) => [...prevImages, imageUri].slice(0, 3));
                } else {
                    // Editing an existing image
                    const updatedImages = [...selectedImages];
                    updatedImages[currentImageIndex] = imageUri;
                    setSelectedImages(updatedImages);
                }

                // const imageUri = response.uri || response.assets?.[0]?.uri;
                // const updatedImages = [...selectedImages];
                // updatedImages[currentImageIndex] = imageUri;
                // setSelectedImages([...selectedImages, updatedImages]);
                //setSelectedImages(updatedImages);
            }
        });
    };

    const showModalView = () => (
        <Modal
            backdropOpacity={0.90}
            backdropColor={'rgba(85, 85, 85, 0.70)'}
            isVisible={modalVisible}
            animationIn={'bounceIn'}
            animationOut={'bounceOut'}
            animationInTiming={1000}
            animationOutTiming={1000}
        >
            <View style={styles.modalContainer}>
                <View style={{ flexDirection: 'row' }}>
                    <Text style={styles.modalTitle}>Upload photos from</Text>
                    <Icon
                        onPress={() => setModalVisible(false)}
                        size={24}
                        color={theme.dark.white}
                        name='close'
                    />
                </View>
                <View style={styles.modalOptions}>
                    <View style={styles.modalOption}>
                        <TouchableOpacity onPress={openImagePicker} style={styles.optionButton}>
                            <EvilIcons size={40} color={theme.dark.secondary} name='image' />
                        </TouchableOpacity>
                        <Text style={styles.optionText}>Your photos</Text>
                    </View>
                    <View style={styles.modalOption}>
                        <TouchableOpacity onPress={handleCameraLaunch} style={styles.optionButton}>
                            <Camera size={26} color={theme.dark.secondary} name='camera' />
                        </TouchableOpacity>
                        <Text style={styles.optionText}>From Camera</Text>
                    </View>
                </View>
            </View>
        </Modal>
    );

    const handleNavigation = () => {
        if (selectedImages.some(image => image)) {
            const newPayload = { ...dataPayload, profile_pics: selectedImages };
            dispatch(setDataPayload(newPayload));
            resetNavigation(navigation, SCREENS.BUDDY_ABOUT);
        } else {
            showAlert("Error", "error", "Add at least 1 photo to continue.");
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <ProfileProgressBar progress={30} onPress={() => resetNavigation(navigation, SCREENS.BUDDY_USER_NAME)} />
            <CustomLayout>
                <View style={styles.contentContainer}>
                    <Text style={styles.welcomeText}>Show Your Best Self</Text>
                    <Text style={styles.subTitle}>Upload your best photos to make a fantastic first impression. Let your personality shine.</Text>
                    <View style={styles.mediaImageContainer}>
                        {selectedImages?.map((image, index) => (
                            <TouchableOpacity
                                key={index}
                                onPress={() => {
                                    setCurrentImageIndex(index);
                                    setModalVisible(true);
                                }}
                                style={styles.imageWrapper}
                            >
                                {image ? (
                                    <Image resizeMode='cover' source={{ uri: image }} style={styles.selectedImageStyle} />
                                ) : (
                                    <Camera size={30} color={theme.dark.heading} name='camera' />
                                )}
                                {!image ? (
                                    <Icon size={24} color={theme.dark.secondary} name='plus-circle' style={styles.plusButton} />
                                ) : (
                                    <Image source={editImage} style={[styles.plusButton, { width: scaleWidth(40), height: scaleHeight(40), bottom: 0, right: 0 }]} />
                                )}
                            </TouchableOpacity>
                        ))}
                        {selectedImages.length < 3 && (
                            <TouchableOpacity style={styles.addButton} onPress={() => {
                                setCurrentImageIndex(null);
                                setModalVisible(true);
                            }}>
                                <Cross name='plus' size={24} color={"#888888"} />
                            </TouchableOpacity>
                        )}
                    </View>
                    {/* <View style={styles.imagePickerContainer}>
                        {selectedImages.map((image, index) => (
                            <TouchableOpacity
                                key={index}
                                onPress={() => {
                                    setCurrentImageIndex(index);
                                    setModalVisible(true);
                                }}
                                style={styles.imagePicker}
                            >
                                {image ? (
                                    <Image resizeMode='cover' source={{ uri: image }} style={styles.selectedImageStyle} />
                                ) : (
                                    <Camera size={30} color={theme.dark.heading} name='camera' />
                                )}
                                {!image ? (
                                    <Icon size={24} color={theme.dark.secondary} name='plus-circle' style={styles.plusButton} />
                                ) : (
                                    <Image source={editImage} style={[styles.plusButton, { width: scaleWidth(40), height: scaleHeight(40), bottom: 0, right: 0 }]} />
                                )}
                            </TouchableOpacity>
                        ))}
                    </View> */}
                </View>
            </CustomLayout>
            <View style={styles.buttonContainer}>
                <HorizontalDivider customStyle={{ marginTop: 40 }} />
                <Button
                    onPress={() => {
                        handleNavigation()
                    }}
                    title={'Continue'}
                    customStyle={{ backgroundColor: selectedImages.some(image => image) ? theme.dark.secondary : '#E7E7E7' }}
                    textCustomStyle={{ color: selectedImages.some(image => image) ? theme.dark.black : '#6C6C6C' }}
                />
            </View>
            {showModalView()}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.dark.background,
    },
    contentContainer: {
        padding: 25,
        flex: 1,
    },
    welcomeText: {
        fontFamily: fonts.fontsType.semiBold,
        fontSize: scaleHeight(22),
        color: theme.dark.white,
        marginTop: 15,
    },
    subTitle: {
        fontFamily: fonts.fontsType.regular,
        fontSize: scaleHeight(14),
        color: theme.dark.heading,
        marginTop: 5,
    },
    buttonContainer: {
        width: '90%',
        alignSelf: 'center',
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
        marginTop: scaleHeight(50),
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    imagePicker: {
        width: scaleWidth(100),
        height: scaleHeight(110),
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
        height: scaleHeight(120),
        borderRadius: 22,
    },
    mediaImageContainer: {
        flexDirection: 'row',
        // flexWrap: 'wrap',
        marginTop: scaleHeight(30),
    },
    imageWrapper: {
        position: 'relative',
        margin: 5,
    },
    mediaImage: {
        width: 100,
        height: 110,
        borderRadius: 20,
    },
    addButton: {
        width: 100,
        height: 110,
        borderRadius: 20,
        borderWidth: 2,
        borderColor: '#888888',
        justifyContent: 'center',
        alignItems: 'center',
        margin: 5,
        borderStyle: 'dashed'

    },
});

export default BuddyProfilePicture;
