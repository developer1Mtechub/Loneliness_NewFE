import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
    Image, SafeAreaView, StyleSheet, Dimensions,
    View, FlatList, Text, TouchableOpacity,
    ScrollView, TextInput, Animated, findNodeHandle, UIManager,
    Keyboard
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import LottieView from 'lottie-react-native';
import Icon from 'react-native-vector-icons/AntDesign'
import { scaleHeight, scaleWidth } from '../../../../styles/responsive';
import { theme } from '../../../../assets';
import {
    bellHome,
    blockUser,
    chatHome,
    disLikeHome,
    disLikeLabel,
    dummyImg,
    filterHome,
    homeLogo,
    likeHome,
    likeLabel,
    locationPin,
    lockImg,
    ratingStar,
    sendHome,
    warningImg
} from '../../../../assets/images';
import fonts from '../../../../styles/fonts';
import { resetNavigation } from '../../../../utils/resetNavigation';
import { SCREENS } from '../../../../constant/constants';
import DetailItem from '../../../../components/DetailItem';
import CategoryList from '../../../../components/CategoryList';
import Button from '../../../../components/ButtonComponent';
import { color } from '@rneui/base';
import CustomModal from '../../../../components/CustomModal';
import Modal from 'react-native-modal';
import HorizontalDivider from '../../../../components/HorizontalDivider';
import CustomRangeSlider from '../../../../components/CustomSlider';
import CheckBox from '../../../../components/CheckboxComponent';
import CustomTextInput from '../../../../components/TextInputComponent';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { getAllNearbyBuddy, resetNearbyData } from '../../../../redux/UserDashboard/getAllNearbyBuddySlice';
import { getAddressByLatLong } from '../../../../redux/getAddressByLatLongSlice';
import { setIsAppOpened } from '../../../../redux/appOpenedSlice';
import { setRoute } from '../../../../redux/appSlice';
import { userBuddyAction } from '../../../../redux/userBuddyActionSlice';
import { useAlert } from '../../../../providers/AlertContext';
import Geolocation from '@react-native-community/geolocation';
import { applyFilterTogetBuddies } from '../../../../redux/UserDashboard/applyFilterTogetBuddiesSlice';
import Spinner from '../../../../components/Spinner';
import { setIsPremium } from '../../../../redux/accountSubscriptionSlice';
import { likeDislikeBuddy } from '../../../../redux/UserDashboard/likeDislikeBuddySlice';
import EmptyListComponent from '../../../../components/EmptyListComponent';
import { AutocompleteDropdown } from 'react-native-autocomplete-dropdown';
import { calculateAge } from '../../../../utils/calculateAge';
import { checkChatPayment } from '../../../../redux/PaymentSlices/checkChatPaymentSlice';
import { attachPaymentMethod } from '../../../../redux/PaymentSlices/attachPaymentMethodSlice';
import { cardWalletPaymentTransfer } from '../../../../redux/UserDashboard/cardWalletPaymentTransferSlice';
import { createCustomer } from '../../../../redux/PaymentSlices/createCustomerSlice';
import { useStripe, CardField, StripeProvider } from '@stripe/stripe-react-native';
import * as Animatable from 'react-native-animatable';
import CrossIcon from 'react-native-vector-icons/AntDesign'
import { setCurrentUserIndex } from '../../../../redux/currentUserIndexSlice';
import io from 'socket.io-client';
import { SOCKET_URL } from '@env'
import { requestLocationPermission } from '../../../../utils/cameraPermission';
import { Dropdown } from 'react-native-element-dropdown';
import { getAllCategories } from '../../../../redux/getAllCategoriesSlice';
import { openPaymentSheet } from '../../../../utils/paymentUtils';
import { getUserDetail } from '../../../../redux/BuddyDashboard/userLikesDetailSlice';
import { reverseGeocode } from '../../../../utils/geoCodeUtils';
import RBSheet from 'react-native-raw-bottom-sheet';
import { API_BASE_URL_PAYMENT } from '@env'

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const window = Dimensions.get('window');

let screenIndex = 0;


const UserHomeContent = ({ showFilterModal, setFilterModal, setFilter }) => {
    const dispatch = useDispatch();
    const { createPaymentMethod, initPaymentSheet, presentPaymentSheet } = useStripe();
    const { response, loading } = useSelector((state) => state.nearByBuddy)
    const { filteredData, filterLoader } = useSelector((state) => state.applyFilter)
    const blockUserLoader = useSelector((state) => state.userBuddyAction)
    const { categories } = useSelector((state) => state.getCategories)
    const { userLoginInfo } = useSelector((state) => state.auth)
    const { userDetail } = useSelector((state) => state.getUserDetail)
    const { address } = useSelector((state) => state.getAddress)
    const { isAppOpened } = useSelector((state) => state.appOpened)
    const { isPremiumPlan } = useSelector((state) => state.accountSubscription)
    const { loading: paymentTransferLoader } = useSelector((state) => state.cardWalletPaymentTransfer);
    const { showAlert } = useAlert();
    const lottieRef = useRef(null);
    const navigation = useNavigation();
    const [showCarousel, setShowCarousel] = useState(false);
    const [isfilterApplied, setFilterApplied] = useState(false);
    const [activeIndex, setActiveIndex] = useState(0);
    const [min, setMin] = useState(20);
    const [max, setMax] = useState(80);
    const [hieghtFtSelected, setHeightFtSelected] = useState(true);
    const [hieghtInSelected, setHeightInSelected] = useState(false);
    const [weightKgSelected, setWeightKgSelected] = useState(true);
    const [weightLbSelected, setWeightLbSelected] = useState(false);

    const [modalVisible1, setModalVisible1] = useState(false);
    const [modalVisible2, setModalVisible2] = useState(false);
    const [modalVisible3, setModalVisible3] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const { currentUser } = useSelector((state) => state.currentUserIndex)
    const [userCurrentIndex, setUserCurrentIndex] = useState(0);
    //const [currentUser, setCurrentUser] = useState(filteredData?.data[userIndex] || response?.data[userIndex]);
    //const [currentUser, setCurrentUser] = useState({});
    const scrollOffsetY = useRef(0);
    const [scrollDirection, setScrollDirection] = useState(null);
    const [action, setAction] = useState({ index: null, type: null });
    const translateX = useRef(new Animated.Value(0)).current;
    const translateY = useRef(new Animated.Value(0)).current;
    const scaleY = useRef(new Animated.Value(1)).current;
    const rotateZ = useRef(new Animated.Value(0)).current;
    const { is_subscribed, customer_id, id } = userLoginInfo?.user;
    const [selectedOption, setSelectedOption] = useState('');
    const [isOverlayOpened, setOverlayOpened] = useState(false);
    const [paymentLoader, setPaymentLoader] = useState(false);
    const [cardDetails, setCradDetails] = useState({});
    const [keyboardStatus, setKeyboardStatus] = useState(false);
    const [selectedValue, setSelectedValue] = useState('');
    const [chatPaymentLoader, setChatPaymentLoader] = useState(false);
    const [socket, setSocket] = useState(null);
    const scrollViewRef = useRef(null);
    const refRBSheet = useRef();
    const [placeName, setPlaceName] = useState('')
    const [form, setForm] = useState({
        category: '',
        city: '',
        language: '',
        height_ft: '',
        height_in: '',
        weight_kg: '',
        weight_lb: '',
        weight_unit: '',
        top_rated_profile: false,
        top_liked_profile: false,
        gender: '',
        latitude: 0,
        longitude: 0,
        distance: 3200,
        page: 1,
        limit: 10,
        min_age: 0,
        max_age: 0

    });

    //user profile lat long....

    useEffect(() => {
        dispatch(getUserDetail(id))
    }, [dispatch, id])


    const handleLocation = async () => {

        if (currentUser) {
            const { longitude, latitude } = currentUser?.location
            const address = await reverseGeocode(latitude, longitude);
            setPlaceName(address)
        }
    };

    useEffect(() => {
        handleLocation();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentUser])


    const getAllNearByBuddies = async () => {
        let latitude, longitude;
        if (userDetail?.location?.latitude && userDetail?.location?.longitude) {
            // Use userDetail location if available
            ({ latitude, longitude } = userDetail.location);
        } else {
            // Request location permission and get current location
            await requestLocationPermission();
            const getPosition = () => new Promise((resolve, reject) => {
                Geolocation.getCurrentPosition(resolve, reject);
            });
            const { coords } = await getPosition();
            latitude = coords.latitude;
            longitude = coords.longitude;
        }

        setForm({ ...form, latitude, longitude });

        const payload = {
            latitude,
            longitude
        };

        dispatch(getAllNearbyBuddy(payload));
    }

    useEffect(() => {
        if (!isfilterApplied) {
            getAllNearByBuddies();
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dispatch, userDetail])

    useEffect(() => {
        dispatch(getAllCategories())
    }, [dispatch])

    useEffect(() => {
        if (currentUser) {
            dispatch(getAddressByLatLong({
                lat: currentUser?.location?.latitude,
                long: currentUser?.location?.longitude
            }));
        }

    }, [dispatch, currentUser])

    useEffect(() => {
        if (!currentUser) {

            if (isfilterApplied) {
                //setCurrentUser(filteredData?.data[userCurrentIndex]);
                dispatch(setCurrentUserIndex(filteredData?.data[0]));

            } else {
                //setCurrentUser(response?.data[userCurrentIndex]);
                dispatch(setCurrentUserIndex(response?.data[0]));
            }
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dispatch, response, isfilterApplied]);


    useEffect(() => {
        const newSocket = io(SOCKET_URL);
        setSocket(newSocket);
        newSocket.on('connect', () => {
            console.log('Socket connected');
        });

        return () => {
            newSocket.disconnect();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);


    function updateCurrentUser(updatedUser) {
        //setCurrentUser(updatedUser);
        dispatch(setCurrentUserIndex(updatedUser));

    }

    const handleToggleKg = () => {
        setWeightKgSelected(true);
        setWeightLbSelected(false);
    };

    const handleToggleLb = () => {
        setWeightKgSelected(false);
        setWeightLbSelected(true);
    };

    const like = (index) => {
        setAction({ index, type: 'like' });
        setTimeout(() => {
            Animated.sequence([
                Animated.timing(translateY, {
                    toValue: -50, // Move up
                    duration: 300,
                    useNativeDriver: true,
                }),
                Animated.timing(translateX, {
                    toValue: -screenWidth, // Slide out to the left
                    duration: 500,
                    useNativeDriver: true,
                }),
            ]).start(() => {
                let newImageUrls = [...currentUser.image_urls];
                newImageUrls.splice(index, 1);
                updateCurrentUser({ ...currentUser, image_urls: newImageUrls });
                //currentUser?.image_urls?.splice(index, 1);
                setActiveIndex((prev) => (prev > 0 ? prev - 1 : 0));
                translateX.setValue(0);
                translateY.setValue(0);
                setAction({ index: null, type: null });

                if (isfilterApplied) {
                    setUserCurrentIndex((prevIndex) => {
                        const newIndex = (prevIndex + 1) % (filteredData?.data?.length || 1);
                        dispatch(setCurrentUserIndex(filteredData?.data[newIndex])); // Dispatch the action with the new index
                        return newIndex;
                    });
                } else {
                    setUserCurrentIndex((prevIndex) => {
                        const newIndex = (prevIndex + 1) % (response?.data?.length || 1);
                        dispatch(setCurrentUserIndex(response?.data[newIndex])); // Dispatch the action with the new index
                        return newIndex;
                    });
                }

            });
        }, 500);
    };

    const handleDislike = (index) => {
        setAction({ index, type: 'dislike' });
        setTimeout(() => {
            Animated.parallel([
                // Rotation animation
                Animated.timing(rotateZ, {
                    toValue: -45, // Rotate to -45 degrees (counter-clockwise)
                    duration: 1000, // Duration of rotation animation
                    useNativeDriver: true,
                }),
                // Translation animation to move the image to the left
                Animated.timing(translateX, {
                    toValue: -screenWidth, // Move the image to the left
                    duration: 1000, // Duration of translation animation
                    useNativeDriver: true,
                }),
            ]).start(() => {
                let newImageUrls = [...currentUser.image_urls];
                newImageUrls.splice(index, 1);
                updateCurrentUser({ ...currentUser, image_urls: newImageUrls });
                // After the animation, remove the image from the list
                // currentUser?.image_urls?.splice(index, 1);
                setActiveIndex((prev) => (prev > 0 ? prev - 1 : 0)); // Adjust the active index
                rotateZ.setValue(0); // Reset the rotation value for the next use
                translateX.setValue(0); // Reset the translation value for the next use
                setAction({ index: null, type: null }); // Reset the action
                if (isfilterApplied) {
                    // setUserCurrentIndex((prevIndex) => (prevIndex + 1) % filteredData?.data?.length);
                    setUserCurrentIndex((prevIndex) => {
                        const newIndex = (prevIndex + 1) % (filteredData?.data?.length || 1);
                        // setCurrentUser(filteredData?.data[newIndex]);
                        dispatch(setCurrentUserIndex(filteredData?.data[newIndex])); // Dispatch the action with the new index
                        return newIndex;
                    });
                } else {
                    // setUserCurrentIndex((prevIndex) => (prevIndex + 1) % response?.data?.length);
                    setUserCurrentIndex((prevIndex) => {
                        const newIndex = (prevIndex + 1) % (response?.data?.length || 1);
                        //setCurrentUser(response?.data[newIndex]);
                        dispatch(setCurrentUserIndex(response?.data[newIndex])); // Dispatch the action with the new index
                        return newIndex;
                    });
                }
            });
        }, 500); // Wait for 3 seconds before sliding out
    };

    const handleScroll = (event) => {
        const currentOffsetY = event.nativeEvent.contentOffset.y;
        const direction = currentOffsetY > scrollOffsetY.current ? 'down' : 'up';
        setScrollDirection(direction);
        scrollOffsetY.current = currentOffsetY;
    };

    useEffect(() => {
        scrollOffsetY.current = 0;
    }, []);

    useEffect(() => {
        const keyboardDidShowListener = Keyboard.addListener(
            'keyboardDidShow',
            () => {
                setKeyboardStatus(true);
            }
        );
        const keyboardDidHideListener = Keyboard.addListener(
            'keyboardDidHide',
            () => {
                setKeyboardStatus(false);
            }
        );

        // Cleanup listeners on unmount
        return () => {
            keyboardDidShowListener.remove();
            keyboardDidHideListener.remove();
        };
    }, []);

    const handleOpenModal = () => {
        setModalVisible(true);
    };

    const handleCloseModal = () => {
        setModalVisible(false);
    };

    const handleOpenModal1 = () => {
        setModalVisible1(true);
    };

    const handleCloseModal1 = () => {
        setModalVisible1(false);
    };

    const handleOpenModal2 = () => {
        setModalVisible2(true);
    };

    const handleCloseModal2 = () => {
        setModalVisible2(false);
    };

    const handleOpenModal3 = () => {
        setModalVisible3(true);
    };

    const handleCloseModal3 = () => {
        setModalVisible3(false);
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            if (lottieRef.current) {
                lottieRef.current.pause();
                setShowCarousel(true);
                dispatch(setIsAppOpened(true))
            }
        }, 4000);

        return () => clearTimeout(timer);
    }, [dispatch, isAppOpened]);

    const renderItem = ({ item, index }) => (
        <Animated.View
            style={[styles.carouselItem, {
                transform: [{ translateX }, { translateY }, { scaleY },
                {
                    rotateZ: action.index === index && action.type === 'dislike' ? rotateZ.interpolate({
                        inputRange: [0, 45],
                        outputRange: ['0deg', '45deg'],
                    }) : '0deg'
                }, // Apply rotation if it's a dislike action
                ]
            }]}>
            <TouchableOpacity
                activeOpacity={1}
                onPress={() => { scrollUp() }}
                style={styles.carouselImageContainer}>
                <Image
                    source={{ uri: item }}
                    style={styles.carouselImage}
                    resizeMode="contain"
                />
            </TouchableOpacity>
            <LinearGradient
                colors={['transparent', theme.dark.primary]}
                style={styles.gradientOverlay}
            />
            {action.index === index && (
                <View style={styles.labelContainer}>
                    <Image source={action.type === 'like' ? likeLabel : disLikeLabel} style={{
                        width: scaleWidth(173),
                        height: scaleHeight(82)
                    }} resizeMode="contain" />
                </View>
            )}

        </Animated.View>
    );


    const handleChange = (name, value) => {
        setForm({ ...form, [name]: value });
    };

    const onChange = (min, max) => {
        setMin(Math.round(min))
        setMax(Math.round(max))
    };

    const handleCheckBoxStatusChange = (formField, label, isChecked) => {
        if (formField === "top_rated_profile" || formField === "top_liked_profile") {
            handleChange(formField, isChecked);
        } else {
            handleChange(formField, label);
        }

    };

    const applyFilter = () => {
        dispatch(resetNearbyData())
        setFilterModal(false)
        setFilter(true)
        setFilterApplied(true)
        const filterPayload = { ...form, min_age: min, max_age: max };

        dispatch(applyFilterTogetBuddies(filterPayload)).then((result) => {
            if (result?.payload?.status === "success") {
                //setCurrentUser(result?.payload?.result?.data[userCurrentIndex]);
                dispatch(setCurrentUserIndex(result?.payload?.result?.data[0]));
            }

        });
    }

    const resetFilter = () => {
        getAllNearByBuddies();
        setFilterModal(false)
        setFilter(false)
        setFilterApplied(false)
    }

    const renderCategoryItem = item => {

        return (
            <View style={styles.item}>
                <Text style={styles.textItem}>{item.name}</Text>
                {item.name === selectedValue && (
                    <MaterialIcons
                        color={theme.dark.secondary}
                        name="check-circle"
                        size={20}
                    />
                )}

            </View>
        );
    };

    const renderFilterModal = () => {
        return <Modal
            backdropOpacity={0.90}
            backdropColor={'rgba(85, 85, 85, 0.95)'}
            isVisible={showFilterModal}
            animationIn={'slideInUp'}
            animationOut={'slideOutDown'}
            animationInTiming={1000}
            animationOutTiming={1000}
        >
            <View style={{
                backgroundColor: '#111111',
                width: '110%',
                height: '110%',
                alignSelf: 'center',
                elevation: 20,
                padding: 20,
                marginTop: scaleHeight(120),
                borderTopEndRadius: 30,
                borderTopStartRadius: 30,

            }}>

                <Icon
                    name='close'
                    size={24}
                    color={theme.dark.white}
                    style={{
                        alignSelf: 'flex-end'
                    }}

                    onPress={() => {
                        setFilterModal(false)
                    }}
                />

                <Text style={{
                    fontFamily: fonts.fontsType.semiBold,
                    fontSize: scaleHeight(20),
                    color: theme.dark.white,
                    alignSelf: 'center'
                }}>
                    Appy Filter
                </Text>

                <HorizontalDivider customStyle={{
                    marginTop: 15
                }} />

                <ScrollView
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps={'always'}
                    style={{
                        flex: 1,
                        marginBottom: scaleHeight(40)
                    }}>

                    <View style={{
                        flexDirection: 'row',
                        marginHorizontal: 15,

                    }}>
                        <Text style={{
                            fontFamily: fonts.fontsType.semiBold,
                            fontSize: scaleHeight(17),
                            color: theme.dark.white,
                            flex: 1
                        }}>
                            Age Range
                        </Text>
                        <Text style={{
                            fontFamily: fonts.fontsType.regular,
                            fontSize: scaleHeight(17),
                            color: theme.dark.inputBackground
                        }}>
                            {`${min} - ${max}`}
                        </Text>
                    </View>

                    <CustomRangeSlider
                        min={0}
                        max={100}
                        step={1}
                        initialLow={20}
                        initialHigh={80}
                        onValueChange={onChange}
                    />

                    <HorizontalDivider customStyle={{
                        marginTop: 60
                    }} />

                    <View style={{
                        marginHorizontal: 15
                    }}>
                        <Text style={{
                            fontFamily: fonts.fontsType.semiBold,
                            fontSize: scaleHeight(17),
                            color: theme.dark.white,
                        }}>
                            Show Me
                        </Text>

                        <View style={{
                            flexDirection: 'row',
                            marginTop: 10,
                            justifyContent: 'space-between'
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
                        marginTop: 20
                    }} />

                    <View style={{
                        marginHorizontal: 15,
                        marginTop: 10
                    }}>
                        <CheckBox
                            onStatusChange={handleCheckBoxStatusChange}
                            label={"Top liked Profiles"}
                            formField={"top_liked_profile"}
                            labelStyle={{
                                color: theme.dark.white,
                                fontFamily: fonts.fontsType.semiBold,
                                fontSize: scaleHeight(15),
                            }}
                            checkBoxStyle={{
                                backgroundColor: theme.dark.white
                            }}
                        />
                    </View>

                    <HorizontalDivider customStyle={{
                        marginTop: 20
                    }} />

                    <View style={{
                        marginHorizontal: 15,
                        marginTop: 10
                    }}>
                        <CheckBox
                            onStatusChange={handleCheckBoxStatusChange}
                            label={"Top Rated Profiles"}
                            formField={"top_rated_profile"}
                            labelStyle={{
                                color: theme.dark.white,
                                fontFamily: fonts.fontsType.semiBold,
                                fontSize: scaleHeight(15),
                            }}
                            checkBoxStyle={{
                                backgroundColor: theme.dark.white
                            }}
                        />
                    </View>

                    <HorizontalDivider customStyle={{
                        marginTop: 20
                    }} />


                    <Dropdown
                        style={[styles.dropdown]}
                        placeholderStyle={styles.placeholderStyle}
                        selectedTextStyle={styles.selectedTextStyle}
                        iconStyle={styles.iconStyle}
                        data={categories}
                        maxHeight={250}
                        dropdownPosition='auto'
                        containerStyle={{
                            backgroundColor: theme.dark.primary,
                            borderColor: theme.dark.inputLabel
                        }}
                        labelField="name"
                        valueField="name"
                        placeholder={'Select Category'}
                        value={selectedValue}
                        onChange={item => {
                            handleChange('category', item?.name)
                            setSelectedValue(item?.name);
                        }}
                        renderItem={renderCategoryItem}
                    />

                    {/* <CustomTextInput
                        label={'Category'}
                        placeholder={"Select Category"}
                        identifier={'category'}
                        value={form.category}
                        onValueChange={(value) => handleChange('category', value)}
                        mainContainer={{ marginTop: 15 }}
                        iconComponent={
                            <MaterialIcons
                                style={{
                                    marginEnd: 8

                                }} name={"keyboard-arrow-down"} size={24}
                                color={theme.dark.text} />
                        }
                    /> */}

                    <HorizontalDivider customStyle={{
                        marginTop: 20
                    }} />

                    {/* // height wieght */}

                    <View style={{ marginTop: scaleHeight(10) }}>

                        <Text style={styles.label}>{'Height'}</Text>

                        <View

                            style={{

                                flexDirection: "row",
                                alignItems: "center",
                                backgroundColor: theme.dark.white,
                                height: 45,
                                borderRadius: 30,
                                borderWidth: 1,
                                borderColor: theme.dark.text,
                                marginTop: scaleHeight(30)

                            }}>

                            <View style={{ flexDirection: 'row', marginHorizontal: scaleWidth(10), flex: 1 }}>

                                <TextInput
                                    style={{
                                        fontFamily: fonts.fontsType.medium,
                                        fontSize: scaleHeight(14),
                                        color: theme.dark.primary,
                                        marginHorizontal: 10,
                                        width: scaleWidth(50)
                                    }}
                                    maxLength={2}
                                    placeholder='00'
                                    keyboardType='number-pad'
                                    placeholderTextColor={theme.dark.text}
                                    value={form.height_ft}
                                    onChangeText={(value) => handleChange('height_ft', value)}
                                />

                                <View style={styles.verticleLine}></View>

                                <TextInput
                                    style={{
                                        fontFamily: fonts.fontsType.medium,
                                        fontSize: scaleHeight(14),
                                        color: theme.dark.primary,
                                        width: scaleWidth(50)
                                    }}
                                    maxLength={2}
                                    placeholder='00'
                                    keyboardType='number-pad'
                                    placeholderTextColor={theme.dark.text}
                                    value={form.height_in}
                                    onChangeText={(value) => handleChange('height_in', value)}
                                />

                            </View>

                            <View style={{
                                flexDirection: 'row',
                                borderRadius: 30,
                                borderWidth: 1,
                                borderColor: theme.dark.secondary,
                                width: scaleWidth(70),
                                height: '70%',
                                marginEnd: scaleWidth(10),
                                justifyContent: 'space-evenly',
                            }}>

                                <View
                                    style={{
                                        backgroundColor: theme.dark.secondary,
                                        width: scaleWidth(35),
                                        height: '100%',
                                        alignSelf: 'center',
                                        borderBottomLeftRadius: 30,
                                        borderTopLeftRadius: 30,
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                    }}
                                >
                                    <Text style={{
                                        fontFamily: fonts.fontsType.medium,
                                        fontSize: scaleHeight(12),
                                        color: theme.dark.black,
                                        alignSelf: 'center'

                                    }}>Ft</Text>
                                </View>

                                <View
                                    style={{
                                        backgroundColor: '#333333',
                                        width: scaleWidth(35),
                                        height: '100%',
                                        alignSelf: 'center',
                                        borderBottomEndRadius: 30,
                                        borderTopEndRadius: 30,
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}
                                >
                                    <Text style={{
                                        fontFamily: fonts.fontsType.medium,
                                        fontSize: scaleHeight(12),
                                        color: theme.dark.white,
                                        alignSelf: 'center'

                                    }}>In</Text>
                                </View>

                            </View>


                        </View>

                        <Text style={styles.label}>{'Weight'}</Text>

                        <View

                            style={{

                                flexDirection: "row",
                                alignItems: "center",
                                backgroundColor: theme.dark.white,
                                height: 45,
                                borderRadius: 30,
                                borderWidth: 1,
                                borderColor: theme.dark.text,
                                marginTop: scaleHeight(30)

                            }}>

                            <View style={{ flexDirection: 'row', marginHorizontal: scaleWidth(10), flex: 1 }}>

                                <TextInput
                                    style={{
                                        fontFamily: fonts.fontsType.medium,
                                        fontSize: scaleHeight(14),
                                        color: theme.dark.primary,
                                        marginHorizontal: 10,
                                        width: scaleWidth(50)
                                    }}
                                    maxLength={2}
                                    keyboardType='number-pad'
                                    placeholder='00'
                                    placeholderTextColor={theme.dark.text}
                                    value={form.weight_kg}
                                    onChangeText={(value) => handleChange('weight_kg', value)}
                                />

                                <View style={styles.verticleLine}></View>

                                <TextInput
                                    style={{
                                        fontFamily: fonts.fontsType.medium,
                                        fontSize: scaleHeight(14),
                                        color: theme.dark.primary,
                                        width: scaleWidth(50)
                                    }}
                                    maxLength={2}
                                    keyboardType='number-pad'
                                    placeholder='00'
                                    placeholderTextColor={theme.dark.text}
                                    value={form.weight_lb}
                                    onChangeText={(value) => handleChange('weight_lb', value)}
                                />

                            </View>

                            <View style={{
                                flexDirection: 'row',
                                borderRadius: 30,
                                borderWidth: 1,
                                borderColor: theme.dark.secondary,
                                width: scaleWidth(70),
                                height: '70%',
                                marginEnd: scaleWidth(10),
                                justifyContent: 'space-evenly',
                            }}>

                                <TouchableOpacity
                                    onPress={() => {
                                        handleToggleKg();
                                    }}
                                    style={{
                                        backgroundColor: weightKgSelected ? theme.dark.secondary : '#333333',
                                        width: scaleWidth(35),
                                        height: '100%',
                                        alignSelf: 'center',
                                        borderBottomLeftRadius: 30,
                                        borderTopLeftRadius: 30,
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                    }}
                                >
                                    <Text style={{
                                        fontFamily: fonts.fontsType.medium,
                                        fontSize: scaleHeight(12),
                                        color: weightKgSelected ? theme.dark.black : theme.dark.white,
                                        alignSelf: 'center'

                                    }}>Kg</Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    onPress={() => {
                                        handleToggleLb();
                                    }}
                                    style={{
                                        backgroundColor: weightLbSelected ? theme.dark.secondary : '#333333',
                                        width: scaleWidth(35),
                                        height: '100%',
                                        alignSelf: 'center',
                                        borderBottomEndRadius: 30,
                                        borderTopEndRadius: 30,
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}
                                >
                                    <Text style={{
                                        fontFamily: fonts.fontsType.medium,
                                        fontSize: scaleHeight(12),
                                        color: weightLbSelected ? theme.dark.black : theme.dark.white,
                                        alignSelf: 'center'

                                    }}>Lb</Text>
                                </TouchableOpacity>

                            </View>


                        </View>

                    </View>

                    <HorizontalDivider customStyle={{
                        marginTop: 20
                    }} />

                    <CustomTextInput
                        label={'City'}
                        placeholder={"Enter city name"}
                        identifier={'city'}
                        value={form.city}
                        onValueChange={(value) => handleChange('city', value)}
                        mainContainer={{ marginTop: 10 }}
                    />

                    <HorizontalDivider customStyle={{
                        marginTop: 20
                    }} />

                    <CustomTextInput
                        label={'Language'}
                        placeholder={"Enter Language"}
                        identifier={'language'}
                        value={form.language}
                        onValueChange={(value) => handleChange('language', value)}
                        mainContainer={{ marginTop: 10 }}
                    />


                    <View style={{
                        flexDirection: 'row',
                        justifyContent: 'space-evenly',
                        marginTop: 20
                    }}>

                        <Button
                            onPress={() => {
                                resetFilter();
                            }}
                            title={"Reset"}
                            customStyle={{
                                width: '48%',
                                marginHorizontal: '2%',
                                borderWidth: 1,
                                borderColor: theme.dark.secondary,
                                backgroundColor: theme.dark.transparentBg,
                            }}
                            textCustomStyle={{
                                color: theme.dark.secondary,
                            }}

                        />

                        <Button
                            onPress={() => {
                                applyFilter();
                            }}
                            title={"Apply"}
                            customStyle={{
                                width: '48%',
                            }} />

                    </View>



                </ScrollView>

            </View>
        </Modal>
    }

    const getBackgroundColor = () => {
        if (scrollDirection === 'up') {
            return theme.dark.primary;  // Color when scrolling up
        } else if (scrollDirection === 'down') {
            return theme.dark.primary;    // Color when scrolling down
        } else if (scrollOffsetY.current = 0) {
            return '#4C4615';   // Default color
        }
    };


    const convertMetersToKm = (meters) => {
        return (meters / 1000).toFixed(1);
    };

    const images = currentUser?.image_urls || [];

    const handlePress = (index) => {
        dispatch(setRoute({
            route: SCREENS.MAIN_DASHBOARD,
            buddy_images: currentUser?.image_urls,
            selectedIndex: index
        }))
        resetNavigation(navigation, SCREENS.IMAGE_VIEWER);
    };

    const handleRequestBuddy = () => {

        if (is_subscribed) {
            dispatch(setRoute({
                route: SCREENS.MAIN_DASHBOARD,
                buddy_id: currentUser?.id,
                hourly_rate: currentUser?.hourly_rate ? currentUser?.hourly_rate : 50,
                categories: currentUser?.categories
            }))
            resetNavigation(navigation, SCREENS.SEND_REQUEST)
        } else {
            handleOpenModal1();
        }
    }

    const handleReportBuddy = () => {

        dispatch(setRoute({
            route: SCREENS.MAIN_DASHBOARD,
            buddy_id: currentUser?.id,
            buddy_name: currentUser?.full_name
        }))
        resetNavigation(navigation, SCREENS.REPORT_BUDDY)
    }
    const handlePremium = () => {
        handleCloseModal1()
        resetNavigation(navigation, SCREENS.PREMIUM);
    }
    const handleBlockUser = () => {
        dispatch(userBuddyAction({
            buddy_id: currentUser?.id,
            //reason: "Other",
            type: "BLOCK" // BLOCK OR REPORT -- 
        })).then((result) => {
            if (result?.payload?.status === "success") {

                dispatch(setIsAppOpened(false))
                showAlert("Success", "success", result?.payload?.message);
                handleCloseModal();
                dispatch(setCurrentUserIndex(null))
                // let updatedUser = { ...currentUser, block_status: "BLOCK" };
                // setCurrentUser(updatedUser);
                getAllNearByBuddies();
            } else if (result?.payload?.status === "error") {
                showAlert("Error", "error", result?.payload?.message)
            }
        })
    }

    const handleLikeDislike = (likeDislikeStatus) => {

        const likeDislikePayload = {
            buddy_id: currentUser?.id,
            like_status: likeDislikeStatus
        }
        dispatch(likeDislikeBuddy(likeDislikePayload)).then((result) => {
            console.log(result?.payload)
            if (result?.payload?.status === "success") {

                let updatedUser = { ...currentUser, is_liked: likeDislikeStatus };
                //setCurrentUser(updatedUser);
                dispatch(setCurrentUserIndex(updatedUser));
            }
        })

    }

    const handleChatNavigation = () => {
        if (socket) {
            const userId = parseInt(id)
            const newBuddy = parseInt(currentUser?.id)
            socket.emit("addContact", { userId, contactId: newBuddy });
        }
        dispatch(setRoute({
            route: SCREENS.MAIN_DASHBOARD,
            receiver_id: currentUser?.id,
            image_url: currentUser?.image_urls[0],
            user_name: currentUser?.full_name
        }))
        resetNavigation(navigation, SCREENS.GENERAL_CHAT)
        //resetNavigation(navigation, SCREENS.CHAT)
    }

    const handleChatPayment = (buddyId) => {
        const payload = {
            user_id: buddyId
        }
        dispatch(checkChatPayment(payload)).then((result) => {
            if (result?.payload?.status === "success") {
                handleChatNavigation();
            } else if (result?.payload?.status === "error") {
                handleOpenModal2();
            }
        })
    }

    const payPalWebviewNav = () => {
        dispatch(setRoute({
            route: SCREENS.MAIN_DASHBOARD,
            user_id: id,
            buddy_id: currentUser?.id,
            amount: 1,
            isSubscription: false,
        }))
        resetNavigation(navigation, SCREENS.PAYPAL_WEBVIEW)
    }

    const handleWalletPayment = (method = "CARD", payment_method_id = "pm_xyz-testing-id") => {
        const payload = {
            payment_method_id: payment_method_id,
            buddy_id: currentUser?.id,
            type: "CHAT",
            method: method,   //[CARD,WALLET]
            amount: 1
        }
        dispatch(cardWalletPaymentTransfer(payload)).then((result) => {
            setPaymentLoader(false)
            if (result?.payload?.status === "success") {
                showAlert("Success", "success", result?.payload?.message);
                handleCloseModal3();
                setOverlayOpened(false)
                setTimeout(() => {
                    handleChatNavigation()
                }, 3000);

            }
            else if (result?.payload?.errors) {
                showAlert("Error", "error", result?.payload?.errors)
            }
            else if (result?.payload?.status === "error") {
                setPaymentLoader(false)
                setOverlayOpened(false);
                handleCloseModal3();
                setTimeout(() => {
                    showAlert("Error", "error", result?.payload?.message)
                }, 1000);
            }
        })
    }


    const handleAttachPaymentMethod = (paymentMethodId) => {
        const payload = {
            payment_method_id: paymentMethodId
        }
        dispatch(attachPaymentMethod(payload)).then((result) => {
            setPaymentLoader(true)
            if (result?.payload?.status === "success") {
                handleWalletPayment("CARD", paymentMethodId)
                // transfer card payemnt here...

            } else {
                setPaymentLoader(false)
                showAlert("Error", "error", result?.payload?.message)
            }
        })
    }

    const handleCreateCustomer = (paymentMethodId) => {
        setPaymentLoader(true)
        dispatch(createCustomer()).then((result) => {
            if (result?.payload?.status === "success") {
                handleAttachPaymentMethod(paymentMethodId)
            } else {
                setPaymentLoader(false)
                showAlert("Error", "error", result?.payload?.message)
            }
        })
    }

    const handleCreatePaymentMethod = async () => {
        //console.log('cardDetails', cardDetails)
        setChatPaymentLoader(true)
        try {
            const { paymentMethod, error } = await createPaymentMethod({
                type: 'card',
                card: cardDetails.card,
                paymentMethodType: 'Card',
            },);

            if (error) {
                showAlert("Error", "error", error?.message)
                console.error('Error creating payment method:', error);
                setChatPaymentLoader(false)
            } else {
                console.log('Created payment method:', paymentMethod?.id);
                setChatPaymentLoader(false)
                handleChatPaymentStripe(paymentMethod?.id)

                //call create customer api here..
                // if (customer_id === null) {
                //     console.log("customer not created")
                //     handleCreateCustomer(paymentMethod?.id)
                // } else {
                //     console.log("customer already created")
                //     handleAttachPaymentMethod(paymentMethod?.id)
                // }
            }
        } catch (error) {
            setChatPaymentLoader(false)
            console.error('Error creating payment method:', error);
        }
    }

    const handleBuddyRatingNav = () => {
        dispatch(setRoute({
            route: SCREENS.MAIN_DASHBOARD,
            buddy_id: currentUser?.id
        }))
        resetNavigation(navigation, SCREENS.RATING)
    }


    const Overlay = () => {
        return (
            <View style={styles.overlayPayment}>

                <Animatable.View
                    animation="bounceIn"
                    duration={2000}
                    style={{
                        backgroundColor: 'white',
                        width: '80%',
                        height: keyboardStatus ? '45%' : '30%',
                        borderRadius: 16,
                        margin: 30
                    }}>

                    <CrossIcon
                        onPress={() => {
                            setOverlayOpened(false)
                        }}
                        style={{
                            alignSelf: 'flex-end',
                            left: 4,
                            bottom: 4
                        }}
                        size={26}
                        name='closecircle'
                        color={theme.dark.secondary} />

                    <Text style={styles.cardHeading}>
                        Enter Card Detail
                    </Text>

                    <CardField
                        postalCodeEnabled={false}
                        // autofocus={true}
                        placeholder={{
                            number: '4242 4242 4242 4242',
                        }}
                        cardStyle={{
                            backgroundColor: '#FFFFFF',
                            textColor: '#000000',
                        }}
                        style={{
                            width: '80%',
                            height: '20%',
                        }}
                        onCardChange={(cardDetails) => {
                            setCradDetails({ type: 'card', card: cardDetails });
                        }}
                    />

                    <Button
                        loading={chatPaymentLoader}
                        isBgTransparent={true}
                        onPress={() => {
                            handleCreatePaymentMethod();
                        }}
                        title={"Pay"}
                        customStyle={{
                            backgroundColor: theme.dark.primary,
                            width: '80%',
                            marginBottom: 0,
                            marginTop: 40
                        }}
                        textCustomStyle={{
                            color: theme.dark.secondary
                        }}
                    />

                </Animatable.View>
            </View >
        );
    };

    const scrollUp = () => {
        scrollViewRef.current.scrollTo({ x: 500, animated: true });
    };

    const handleChatPaymentStripe = async (payment_method_id = "pm_1Q68hgGui44lwdb4jDU50UPO") => {
        const response = await fetch(`${API_BASE_URL_PAYMENT}/create-payment-stripe-chat`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                amount_body: 1,
                paymentMethodId: payment_method_id,
                user_id: id,
                buddy_id: currentUser?.id,
                return_url: "http://localhost:3001/success"
            }),
        });

        const result = await response.json();
        setOverlayOpened(false)
        if (!result?.error) {
            showAlert("Success", "success", result?.message)
        } else {
            showAlert("Error", "error", result?.message)
        }

    }

    const renderPaymentMethodSheet = () => {
        return (
            <RBSheet
                ref={refRBSheet}
                height={100}
                openDuration={250}
                customStyles={{
                    wrapper: styles.wrapper,
                    container: [
                        styles.sheetContainer,
                        { backgroundColor: theme.dark.background } // For dynamic theme-based styling
                    ]
                }}
            >
                <TouchableOpacity
                    onPress={() => {
                        refRBSheet.current.close()
                        payPalWebviewNav();
                    }}
                    style={styles.paymentButton}
                >
                    <Text style={[styles.paymentText, { color: theme.dark.white }]}>
                        Paypal
                    </Text>
                </TouchableOpacity>
                <HorizontalDivider />
                <TouchableOpacity
                    onPress={() => {
                        refRBSheet.current.close();
                        setOverlayOpened(true)
                        //openPaymentSheet(100, handleWalletPayment, 'user@gmail.com', 'usd', 'Test User');
                    }}
                    style={styles.paymentButton}
                >
                    <Text style={[styles.paymentText, { color: theme.dark.white }]}>
                        Stripe
                    </Text>
                </TouchableOpacity>
            </RBSheet>
        );
    };

    return (
        <LinearGradient
            colors={[theme.dark.primary, '#4C4615', '#4C4615']}
            locations={[0.19, 0.7, 0.7]}
            style={styles.gradient}
        >
            {filterLoader ? <Spinner
                isTimer={false}
                label={`Please wait... ${'\n'}We are applying filtering the list.`}
                lottieCustomStyle={{
                    width: scaleWidth(150),
                    height: scaleHeight(150),
                }}
            /> : !isAppOpened ? (
                <>
                    <LottieView
                        ref={lottieRef}
                        style={styles.lottieView}
                        source={require('../../../../assets/ripple_lottie.json')}
                        autoPlay
                        loop
                        speed={0.5}
                    />

                    <View style={styles.imageCircle}>
                        <Image
                            style={styles.imageStyle}
                            resizeMode='cover'
                            source={{ uri: userLoginInfo?.image_url }}
                        />
                    </View>

                    <View style={{
                        flex: 1,
                        bottom: scaleHeight(180),
                        position: 'absolute',
                        justifyContent: 'center',
                        alignItems: 'center',
                        alignSelf: 'center'
                    }}>
                        <Text style={styles.lottieText}>
                            Finding people near you...
                        </Text>
                    </View>
                </>
            ) : (response?.data?.length > 0 || filteredData?.data?.length > 0 || currentUser != undefined) ?
                <SafeAreaView style={styles.container}>

                    {(
                        <ScrollView
                            ref={scrollViewRef}
                            onScroll={handleScroll}
                            scrollEventThrottle={16}
                            style={[styles.carouselContainer, { backgroundColor: getBackgroundColor() }]}>
                            <FlatList
                                data={currentUser?.image_urls}
                                horizontal
                                pagingEnabled
                                showsHorizontalScrollIndicator={false}
                                onScroll={(e) => {
                                    const index = Math.round(e.nativeEvent.contentOffset.x / screenWidth);
                                    setActiveIndex(index);
                                }}
                                renderItem={renderItem}
                                keyExtractor={(item, index) => index.toString()}
                            />


                            {currentUser?.image_urls?.length > 0 && <View style={styles.dotContainer}>
                                {currentUser?.image_urls?.map((_, index) => (
                                    <View
                                        key={index}
                                        style={[
                                            styles.dot,
                                            { backgroundColor: index === activeIndex ? theme.dark.secondary : 'rgba(17, 17, 17, 1)' },
                                        ]}
                                    />
                                ))}
                            </View>}

                            <View style={styles.overlay}>
                                <View style={{ flexDirection: 'row' }}>
                                    <Text style={styles.nameText}>
                                        {`${currentUser?.full_name} (${calculateAge(currentUser?.dob)})`}
                                    </Text>
                                    <TouchableOpacity onPress={() => {
                                        handleChatPayment(currentUser?.id)
                                    }}>
                                        <Image source={chatHome} style={{
                                            width: scaleWidth(60),
                                            height: scaleHeight(60),
                                            alignSelf: 'center',
                                            marginEnd: 20,
                                            top: scaleHeight(20)

                                        }} />
                                    </TouchableOpacity>
                                </View>
                                <Text style={styles.distanceText}>
                                    {`${convertMetersToKm(currentUser?.distance)} km away`}
                                </Text>
                                <View style={styles.actionButtons}>
                                    <TouchableOpacity
                                        onPress={() => {
                                            if (userCurrentIndex === 2) {
                                                dispatch(setIsPremium(false))
                                            }
                                            if (!is_subscribed && !isPremiumPlan) {
                                                handleOpenModal1();
                                            } else {
                                                handleLikeDislike(false)
                                                handleDislike(activeIndex)
                                            }
                                        }}
                                        style={styles.iconButton}>
                                        {/* <Icon name="close" type="material" color="#ff4d4d" /> */}
                                        <Image source={disLikeHome}
                                            resizeMode='contain'
                                            style={{
                                                width: scaleWidth(50),
                                                height: scaleHeight(50),
                                                alignSelf: 'center',
                                                //right: scaleWidth(-20),

                                            }} />
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        onPress={() => {

                                            if (userCurrentIndex === 2) {
                                                dispatch(setIsPremium(false))
                                            }
                                            if (!is_subscribed && !isPremiumPlan) {
                                                handleOpenModal1();
                                            } else {
                                                handleLikeDislike(true)
                                                like(activeIndex);
                                            }
                                        }}
                                        style={styles.iconButton2}>
                                        {/* <Icon name="favorite" type="material" color={theme.dark.secondary} /> */}
                                        <Image source={likeHome}
                                            resizeMode='contain'
                                            style={{
                                                width: scaleWidth(60),
                                                height: scaleHeight(60),
                                                alignSelf: 'center',
                                                //right: scaleWidth(-20),

                                            }} />
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        onPress={() => {
                                            handleRequestBuddy()
                                        }}
                                        style={styles.iconButton3}>
                                        {/* <Icon name="send" type="material" color="#4da6ff" /> */}
                                        <Image source={sendHome}
                                            resizeMode='contain'
                                            style={{
                                                width: scaleWidth(50),
                                                height: scaleHeight(50),
                                                alignSelf: 'center',
                                                //right: scaleWidth(-20),

                                            }} />
                                    </TouchableOpacity>
                                </View>
                            </View>

                            <View style={styles.detailContainer}>

                                <View style={styles.profileDescription}>


                                    <Text style={{
                                        color: theme.dark.secondary,
                                        fontSize: scaleHeight(18),
                                        fontFamily: fonts.fontsType.medium,

                                    }}>
                                        About
                                    </Text>

                                    <TouchableOpacity
                                        onPress={() => {
                                            handleBuddyRatingNav()
                                        }}
                                        style={{
                                            flexDirection: 'row',
                                            alignSelf: 'center'
                                        }}>

                                        <Image
                                            resizeMode='cover'
                                            style={{

                                                width: scaleWidth(18),
                                                height: scaleHeight(18),
                                                alignSelf: 'center',
                                                marginHorizontal: 5
                                            }} source={ratingStar} />

                                        <Text style={{
                                            color: theme.dark.inputLabel,
                                            fontSize: scaleHeight(15),
                                            fontFamily: fonts.fontsType.medium
                                        }}>
                                            {
                                                currentUser?.avg_rating > 0 ? parseInt(currentUser?.avg_rating)?.toFixed(1) : 0
                                            }
                                        </Text>

                                    </TouchableOpacity>

                                </View>

                                <Text style={{
                                    color: theme.dark.inputLabel,
                                    fontSize: scaleHeight(15),
                                    fontFamily: fonts.fontsType.light,
                                    lineHeight: scaleHeight(28),
                                    marginBottom: scaleHeight(20)
                                }}>
                                    {currentUser?.about}
                                </Text>

                                <DetailItem label="Gender" value={currentUser?.gender} />
                                <DetailItem label="Height" value={`${currentUser?.height_ft}'${currentUser?.height_in}`} />
                                <DetailItem label="Weight" value={`${currentUser?.weight} ${currentUser?.weight_unit}`} />
                                <DetailItem label="Hourly Rate" value={`$${currentUser?.hourly_rate}`} />
                                <DetailItem label="Languages" value={`${currentUser?.languages !== null &&
                                    currentUser?.languages != undefined ? JSON.parse(currentUser?.languages) : ''}`} />

                                <View style={{
                                    flexDirection: 'row',
                                    marginTop: scaleHeight(20),
                                    marginHorizontal: -5
                                }}>

                                    <Image
                                        resizeMode='contain'
                                        style={{

                                            width: scaleWidth(22),
                                            height: scaleHeight(22),
                                            alignSelf: 'center',

                                        }} source={locationPin} />

                                    <Text style={{
                                        color: theme.dark.white,
                                        fontSize: scaleHeight(16),
                                        fontFamily: fonts.fontsType.medium,
                                        marginHorizontal: 5
                                    }}>

                                        {currentUser?.location?.country && currentUser?.location?.city ?
                                            `${currentUser.location.country}, ${currentUser.location.city}` :
                                            placeName ||
                                            'Location not available'
                                        }
                                    </Text>

                                </View>

                                <Text style={{
                                    color: theme.dark.secondary,
                                    fontSize: scaleHeight(18),
                                    fontFamily: fonts.fontsType.medium,
                                    marginTop: scaleHeight(40)

                                }}>
                                    Categories
                                </Text>

                                <View style={{
                                    marginHorizontal: -5,
                                    marginTop: scaleHeight(5)
                                }}>
                                    <CategoryList
                                        categories={currentUser?.categories}
                                        isPress={false}
                                    />

                                </View>

                                <View>
                                    {images?.length > 0 && (
                                        <TouchableOpacity onPress={() => {
                                            handlePress(0)
                                        }}>
                                            <Image
                                                style={{
                                                    width: '100%',
                                                    height: scaleHeight(300),
                                                    marginTop: scaleHeight(10),
                                                    borderRadius: 10
                                                }}
                                                source={{ uri: images[0] }}
                                            />
                                        </TouchableOpacity>
                                    )}

                                    {images?.length > 1 && (
                                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                            {images?.slice(1, 3).map((image, index) => (
                                                image && <TouchableOpacity key={index} onPress={() => {
                                                    handlePress(index + 1)
                                                }}>
                                                    <Image
                                                        style={{
                                                            width: scaleWidth(150),
                                                            height: scaleHeight(230),
                                                            marginTop: scaleHeight(10),
                                                            borderRadius: 10
                                                        }}
                                                        source={{ uri: image }}
                                                    />
                                                </TouchableOpacity>
                                            ))}
                                        </View>
                                    )}
                                </View>

                                <Button
                                    onPress={() => {
                                        handleRequestBuddy();
                                    }}
                                    title={"Send Request"}
                                    customStyle={{
                                        width: '95%',
                                        top: scaleHeight(30)
                                    }}
                                    textCustomStyle={{
                                    }}
                                />

                                <View style={{
                                    flexDirection: 'row',
                                    justifyContent: 'space-between',
                                    marginBottom: scaleHeight(-160)
                                }}>

                                    <Button
                                        onPress={() => {
                                            handleReportBuddy();
                                        }}
                                        title={"Report"}
                                        customStyle={{
                                            width: '48%',
                                            borderWidth: 1,
                                            borderColor: theme.dark.secondary,
                                            backgroundColor: theme.dark.transparentBg,
                                        }}
                                        textCustomStyle={{
                                            color: theme.dark.secondary,
                                            marginRight: '2%',
                                        }}
                                    />

                                    <Button title={"Block"}
                                        onPress={() => {
                                            handleOpenModal();
                                        }}
                                        customStyle={{
                                            width: '48%',
                                            borderWidth: 1,
                                            borderColor: theme.dark.secondary,
                                            backgroundColor: theme.dark.transparentBg
                                        }}
                                        textCustomStyle={{
                                            color: theme.dark.secondary
                                        }}
                                    />

                                </View>

                            </View>

                        </ScrollView>
                    )}

                    <CustomModal
                        isVisible={modalVisible1}
                        onClose={handleCloseModal1}
                        headerTitle={"Unlock More Friendships!"}
                        imageSource={lockImg}
                        text={`Want to meet more amazing friends? Unlock additional profiles with our premium access. Discover endless possibilities and connections!`}
                        buttonText="Go Premium"
                        isParallelButton={false}
                        isCross={true}
                        buttonAction={() => {
                            handlePremium();
                        }}
                    />

                    <CustomModal
                        isVisible={modalVisible2}
                        onClose={handleCloseModal2}
                        headerTitle={"Opps!"}
                        imageSource={warningImg}
                        isParallelButton={true}
                        text={`Unlock the conversation for only $1 and dive into an engaging chat experience with us! 💬✨`}
                        parallelButtonText1={"Cancel"}
                        parallelButtonText2={"Pay Now!"}
                        parallelButtonPress1={() => {
                            refRBSheet.current.close()
                            handleCloseModal2()
                        }}
                        parallelButtonPress2={() => {
                            handleCloseModal2()
                            refRBSheet.current.open()
                            //handleOpenModal3();
                        }}
                    />

                    <CustomModal
                        isVisible={modalVisible3}
                        onClose={handleCloseModal3}
                        headerTitle={"Payment Method"}
                        imageSource={warningImg}
                        secondaryLoader={paymentTransferLoader}
                        isParallelButton={false}
                        // text={`Do you want to pay through your wallet?`}
                        text={`Do you want to pay through your paypal?`}
                        parallelButtonText1={"Wallet"}
                        parallelButtonText2={"PayPal"}
                        buttonText={'PayPal'}
                        buttonAction={() => {
                            refRBSheet.current.open()
                            //payPalWebviewNav();
                            //openPaymentSheet(100, handleWalletPayment, 'user@gmail.com', 'usd', 'Test User')
                            //setOverlayOpened(true);
                            handleCloseModal3();
                        }}
                        parallelButtonPress1={() => {
                            handleWalletPayment("WALLET");
                        }}
                        parallelButtonPress2={() => {
                            refRBSheet.current.open()
                            //payPalWebviewNav();
                            //openPaymentSheet(100, handleWalletPayment, 'user@gmail.com', 'usd', 'Test User')
                            //setOverlayOpened(true);
                            handleCloseModal3();
                        }}
                    />

                    <CustomModal
                        isVisible={modalVisible}
                        //loading={blockUserLoader}
                        onClose={handleCloseModal}
                        headerTitle={"Block User?"}
                        imageSource={blockUser}
                        isParallelButton={true}
                        text={`Are you sure you want to Block ${currentUser?.full_name}?`}
                        parallelButtonText1={"Cancel"}
                        parallelButtonText2={"Yes, Block"}
                        parallelButtonPress1={() => {
                            handleCloseModal()
                        }}
                        parallelButtonPress2={() => {
                            handleBlockUser();
                        }}
                    />

                    {isOverlayOpened && Overlay()}

                    {renderPaymentMethodSheet()}

                </SafeAreaView>
                :
                <EmptyListComponent title={"Buddies not found."} />

            }
            {renderFilterModal()}

        </LinearGradient>

    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    gradient: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 10,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#fff',
    },
    headerIcons: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    lottieView: {
        flex: 1,
        width: scaleWidth(268),
        height: scaleHeight(264),
        alignSelf: 'center'
    },
    lottieText: {
        alignSelf: 'center',
        fontFamily: fonts.fontsType.medium,
        fontSize: scaleHeight(18),
        color: theme.dark.white,
    },
    imageCircle: {
        width: scaleWidth(118),
        height: scaleWidth(118),
        borderRadius: scaleWidth(118) / 2,
        borderWidth: 4,
        borderColor: theme.dark.secondary,
        alignSelf: 'center',
        position: 'absolute',
        top: scaleHeight(285),
        justifyContent: 'center'
    },
    imageStyle: {
        width: scaleWidth(110),
        height: scaleWidth(110),
        borderRadius: scaleWidth(110) / 2,
        alignSelf: 'center'
    },
    carouselContainer: {
        flex: 1,
        //backgroundColor: 'rgba(17, 17, 17, 1)'
    },
    carouselItem: {
        width: screenWidth,
        height: screenHeight,
        justifyContent: 'center',
        alignItems: 'center',
    },
    carouselImageContainer: {
        width: '85%',
        height: '75%',
        marginBottom: scaleHeight(120),
        borderRadius: 20,
        // opacity:0.7,
        // backgroundColor:'rgba(0, 0, 0, 0.7)'
    },
    carouselImage: {
        width: '100%',
        height: '100%',
        borderRadius: 20,
    },
    overlay: {
        position: 'absolute',
        top: scaleHeight(480),
        left: 20,
        right: 20,
        //alignItems: 'center',
    },
    nameText: {
        fontSize: scaleHeight(20),
        color: '#fff',
        fontFamily: fonts.fontsType.bold,
        left: 30,
        flex: 1,
        top: 10,
        alignSelf: 'center'
    },
    distanceText: {
        fontSize: scaleHeight(14),
        color: '#fff',
        fontFamily: fonts.fontsType.medium,
        left: 30,
        marginBottom: 10,
        //top: -10,
    },
    actionButtons: {
        flexDirection: 'row',
        justifyContent: 'center',
        width: '100%',
        marginBottom: scaleHeight(90),
    },
    iconButton: {
        top: scaleHeight(10)
        // height: scaleHeight(40),
        // width: scaleWidth(40),
        // alignItems: 'center',
        // justifyContent: 'center',
        // borderRadius: scaleWidth(40) / 2,
        // borderWidth: 2,
        // borderColor: '#ff4d4d',

        //backgroundColor: 'rgba(0, 0, 0, 0.6)',
    },

    iconButton2: {
        padding: 10,
        bottom: scaleHeight(10),
        //borderRadius: 30,
        // borderWidth: 2,
        borderColor: theme.dark.secondary,
        marginHorizontal: 20
        // backgroundColor: 'rgba(0, 0, 0, 0.6)',
    },

    iconButton3: {
        top: scaleHeight(10)
        // height: scaleHeight(40),
        // width: scaleWidth(40),
        // alignItems: 'center',
        // justifyContent: 'center',
        // borderRadius: scaleWidth(40) / 2,
        // borderWidth: 2,
        // borderColor: '#4da6ff',
        // // backgroundColor: 'rgba(0, 0, 0, 0.6)',
    },
    dotContainer: {
        position: 'absolute',
        top: 55,
        left: 0,
        right: 0,
        flexDirection: 'row',
        justifyContent: 'center',
    },
    dot: {
        width: 20,
        height: 5,
        borderRadius: 5,
        backgroundColor: 'white',
        marginHorizontal: 5,
    },

    detailContainer: {
        padding: 30,
        top: scaleHeight(-140)
    },
    profileDescription: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: scaleHeight(5)
    },

    slider: {
        marginBottom: 15,
    },

    verticleLine: {
        height: '60%',
        width: 1,
        backgroundColor: '#909090',
        alignSelf: 'center'
    },
    label: {
        fontFamily: fonts.fontsType.medium,
        fontSize: scaleHeight(17),
        color: theme.dark.inputLabel,
        marginHorizontal: 8,
        top: scaleHeight(20)
    },
    labelContainer: {
        position: 'absolute',
        top: '40%',
        left: '40%',
        transform: [{ translateX: -50 }, { translateY: -50 }],
    },
    gradientOverlay: {
        position: 'absolute',
        bottom: scaleHeight(120),
        left: 0,
        right: 0,
        height: '30%', // Adjust this value as needed
    },
    overlayPayment: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        zIndex: 100,
        justifyContent: 'center',
        alignItems: 'center',
    },
    cardHeading: {
        fontFamily: fonts.fontsType.semiBold,
        fontSize: 16,
        color: theme.dark.primary,
        alignSelf: 'center',
        marginBottom: 20
    },

    dropdown: {
        backgroundColor: theme.dark.inputBg,
        marginTop: scaleHeight(30),
        height: scaleHeight(50),
        borderRadius: 30,
        borderWidth: 1,
        borderColor: theme.dark.text,
        paddingHorizontal: 8,
    },
    iconStyle: {
        width: 20,
        height: 20,
    },
    placeholderStyle: {
        fontSize: scaleHeight(16),
        color: theme.dark.text,
        marginHorizontal: 10
    },
    selectedTextStyle: {
        fontFamily: fonts.fontsType.medium,
        fontSize: scaleHeight(18),
        color: theme.dark.inputLabel,
        marginHorizontal: 10
    },

    item: {
        padding: 17,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: theme.dark.primary,

    },
    textItem: {
        flex: 1,
        fontFamily: fonts.fontsType.medium,
        fontSize: scaleHeight(16),
        color: theme.dark.white
    },
    wrapper: {
        backgroundColor: 'rgba(128, 128, 128, 0.80)',
    },
    sheetContainer: {
        padding: 20,
        borderRadius: 20,
        marginBottom: 20,
        width: '90%',
        alignSelf: 'center',
    },
    paymentButton: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    paymentText: {
        fontFamily: fonts.fontsType.regular,
        fontSize: scaleHeight(16),
    },
});

export default UserHomeContent;
