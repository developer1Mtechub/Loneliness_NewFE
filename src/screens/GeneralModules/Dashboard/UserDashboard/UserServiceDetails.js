//import liraries
import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, FlatList, Image, TouchableOpacity, Dimensions, Keyboard } from 'react-native';
import { blockUser, locationPin, ratingStar, updateRating, warningImg } from '../../../../assets/images';
import { scaleHeight, scaleWidth } from '../../../../styles/responsive';
import { theme } from '../../../../assets';
import fonts from '../../../../styles/fonts';
import Button from '../../../../components/ButtonComponent';
import { resetNavigation } from '../../../../utils/resetNavigation';
import { SCREENS } from '../../../../constant/constants';
import DetailItem from '../../../../components/DetailItem';
import CategoryList from '../../../../components/CategoryList';
import HorizontalDivider from '../../../../components/HorizontalDivider';
import Header from '../../../../components/Header';
import useBackHandler from '../../../../utils/useBackHandler';
import { useAlert } from '../../../../providers/AlertContext';
import RBSheet from 'react-native-raw-bottom-sheet';
import Icon from 'react-native-vector-icons/MaterialIcons';
import CustomModal from '../../../../components/CustomModal';
import { useDispatch, useSelector } from 'react-redux';
import { getBuddyDetailById } from '../../../../redux/UserDashboard/getBuddyDetailByIdSlice';
import FullScreenLoader from '../../../../components/FullScreenLoader';
import moment from 'moment';
import { StarRatingDisplay } from 'react-native-star-rating-widget';
import CustomStarIcon from '../../../../components/CustomStarIcon';
import { color } from '@rneui/base';
import { acceptRejectBuddyRequest } from '../../../../redux/UserDashboard/acceptRejectBuddyRequestSlice';
import { userBuddyAction } from '../../../../redux/userBuddyActionSlice';
import { setRoute } from '../../../../redux/appSlice';
import { releasePayment } from '../../../../redux/UserDashboard/releasePaymentSlice';
import * as Animatable from 'react-native-animatable';
import { useStripe, CardField } from '@stripe/stripe-react-native';
import { updateUserLoginInfo } from '../../../../redux/AuthModule/signInSlice';
import { attachPaymentMethod } from '../../../../redux/PaymentSlices/attachPaymentMethodSlice';
import { createCustomer } from '../../../../redux/PaymentSlices/createCustomerSlice';
import CrossIcon from 'react-native-vector-icons/AntDesign'
import { calculateAge } from '../../../../utils/calculateAge';
import { cardWalletPaymentTransfer } from '../../../../redux/UserDashboard/cardWalletPaymentTransferSlice';
import { cancelService } from '../../../../redux/cancelServiceSlice';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
const UserServiceDetails = ({ navigation }) => {
    const dispatch = useDispatch();
    const { createPaymentMethod } = useStripe();
    const { userLoginInfo } = useSelector((state) => state.auth)
    const { buddyDetail, loading } = useSelector((state) => state.getBuddyDetailById)
    const { loading: paymentLoading } = useSelector((state) => state.releasePayment);
    const { loading: paymentTransferLoader } = useSelector((state) => state.cardWalletPaymentTransfer);
    const { loading: cancelServiceLoader } = useSelector((state) => state.cancelService)
    const { currentRoute } = useSelector((state) => state.app)
    const { showAlert } = useAlert()
    const [activeIndex, setActiveIndex] = useState(0);
    const refRBSheet = useRef();
    const [modalVisible, setModalVisible] = useState(false);
    const [relesePaymentModal, setReleasePaymentModal] = useState(false);
    const [servicePayModal, setServicePayModal] = useState(false);
    const [requestLoader, setRequestLoader] = useState(false);
    const [keyboardStatus, setKeyboardStatus] = useState(false);
    const [cardDetails, setCradDetails] = useState({});
    const [isOverlayOpened, setOverlayOpened] = useState(false);
    const [paymentLoader, setPaymentLoader] = useState(false);
    const [requestStatus, setRequestStatus] = useState('');
    const [serviceCancelModal, setServiceCancelModal] = useState(false);
    const [serviceErrorMessage, setServiceErrorMessage] = useState('')
    const categories = buddyDetail?.category;
    const { customer_id } = userLoginInfo?.user

    //Rate buddy and release button conditions
    // const isPaid = buddyDetail?.status === "PAID";
    const isPaid = buddyDetail?.status === "ACCEPTED" || buddyDetail?.buddy_request_back?.buddy_status === "ACCEPTED";
    const hasNoRating = buddyDetail?.status === "COMPLETED" && buddyDetail?.rating?.id === null;
    const canRateBuddy = (isPaid || hasNoRating) && !loading;
    const canReleasePayment = isPaid || buddyDetail?.rating?.id !== null;

    // requested button show/hide conditions

    //const isRequested = buddyDetail?.status === "REQUESTED";
    const isBuddyRequestBackRequested = buddyDetail?.buddy_request_back?.buddy_status === "REQUESTED";
    const canRespondToRequest = (isBuddyRequestBackRequested) && !loading;
    // const canRespondToRequest = (isRequested || isBuddyRequestBackRequested) && !loading;

    // pay for service section show/hide conditions 

    const isAccepted = buddyDetail?.status === "ACCEPTED" || buddyDetail?.buddy_request_back?.buddy_status === "ACCEPTED";
    // const isNotPaidOrCompleted = buddyDetail?.status !== "PAID" && buddyDetail?.status !== "COMPLETED";
    const isNotPaidOrCompleted = buddyDetail?.status !== "ACCEPTED" && buddyDetail?.status !== "COMPLETED";
    const canPayForService = isAccepted && isNotPaidOrCompleted && !loading;



    const handleBackPress = () => {
        if (currentRoute?.route === SCREENS.MAIN_DASHBOARD && !currentRoute?.isNoti) {
            resetNavigation(navigation, currentRoute?.route, { screen: SCREENS.SERVICES })
        }
        else if (currentRoute?.isNoti && currentRoute?.route === SCREENS.MAIN_DASHBOARD) {
            resetNavigation(navigation, SCREENS.NOTIFICATION)
        }

        else {
            resetNavigation(navigation, currentRoute?.route)
        }

        return true;
    };
    useBackHandler(handleBackPress);

    useEffect(() => {
        dispatch(getBuddyDetailById(currentRoute?.request_id));
    }, [dispatch, currentRoute])

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


    const getColorByStatus = (status) => {
        switch (status) {
            case "ACCEPTED":
                return '#00E200';

            case "REJECTED":
                return '#FF2A04';

            case "REQUEST_BACK":
                return '#4285F4';

            case "REQUESTED":
                return theme.dark.secondary;

            default:
                return '#00000000'; // Default color if status doesn't match
        }
    }

    const getNameByStatus = (status) => {
        switch (status) {
            case "ACCEPTED":
                return 'Accepted';

            case "REJECTED":
                return 'Rejected';

            case "REQUEST_BACK":
                return 'Requested by buddy';

            case "REQUESTED":
                return 'Pending';

            default:
                return ''; // Default color if status doesn't match
        }
    }

    const handleOpenModal = () => {
        setModalVisible(true);
        refRBSheet.current.close()
    };

    const handleCloseModal = () => {
        setModalVisible(false);
    };

    const handleRelaseOpenModal = () => {
        setReleasePaymentModal(true);
    };

    const handleRelaseCloseModal = () => {
        setReleasePaymentModal(false);
    };

    const handleServicePayOpenModal = () => {
        setServicePayModal(true);
    };

    const handleServicePayCloseModal = () => {
        setServicePayModal(false);
    };

    const handleCloseServiceModal = () => {
        setServiceCancelModal(false);
    };


    const renderItem = ({ item, index }) => (
        <View style={[styles.carouselItem]}>
            <Image source={{ uri: item?.image_url }} style={styles.carouselImage} resizeMode="contain" />
        </View>
    );

    const renderSheet = () => {
        return <RBSheet
            ref={refRBSheet}
            height={100}
            openDuration={250}
            customStyles={{
                wrapper: {
                    backgroundColor: 'rgba(128, 128, 128, 0.80)',
                },
                container: {
                    padding: 20,
                    borderRadius: 20,
                    backgroundColor: theme.dark.background,
                    marginBottom: 20,
                    width: '90%',
                    alignSelf: 'center'
                }
            }}
        >

            <TouchableOpacity
                onPress={() => {
                    handleReportBuddy();

                }}
                style={{
                    justifyContent: 'center',
                    alignItems: 'center'
                }}>
                <Text style={{
                    fontFamily: fonts.fontsType.regular,
                    fontSize: scaleHeight(16),
                    color: theme.dark.white
                }}>Report Buddy</Text>
            </TouchableOpacity>
            <HorizontalDivider />
            <TouchableOpacity
                onPress={() => {
                    handleOpenModal()
                }}
                style={{
                    justifyContent: 'center',
                    alignItems: 'center'
                }}>
                <Text style={{
                    fontFamily: fonts.fontsType.regular,
                    fontSize: scaleHeight(16),
                    color: theme.dark.white
                }}>Block Buddy</Text>
            </TouchableOpacity>
        </RBSheet>
    }



    const handleAcceptRejectRequest = (status) => {
        setRequestLoader(true);
        setRequestStatus(status)
        const acceptRejectPayload = {
            request_back_id: buddyDetail?.buddy_request_back?.id,
            status: status
        }

        dispatch(acceptRejectBuddyRequest(acceptRejectPayload)).then((result) => {
            setRequestLoader(false);
            if (result?.payload?.status === "success") {
                showAlert("Success", "success", result?.payload?.message)

                setTimeout(() => {
                    handleBackPress();
                }, 3000);

            } else {
                setRequestLoader(false);
                showAlert("Error", "error", result?.payload?.message)
            }
        })
    }

    const handleBlockUser = () => {
        dispatch(userBuddyAction({
            buddy_id: buddyDetail?.buddy_id,
            //reason: "Other",
            type: "BLOCK" // BLOCK OR REPORT -- 
        })).then((result) => {
            if (result?.payload?.status === "success") {
                showAlert("Success", "success", result?.payload?.message);
                handleCloseModal();

                setTimeout(() => {
                    handleBackPress();
                }, 3000);

            } else if (result?.payload?.status === "error") {
                showAlert("Error", "error", result?.payload?.message)
            }
        })
    }

    const handleReleasePayment = () => {

        const releasePaymentPayload = {
            buddy_id: buddyDetail?.buddy_id,
            request_id: buddyDetail?.id
        }
        dispatch(releasePayment(releasePaymentPayload)).then((result) => {

            if (result?.payload?.status === "success") {
                showAlert("Success", "success", result?.payload?.message);
                handleRelaseCloseModal();
                setTimeout(() => {
                    handleBackPress();
                }, 3000);

            } else if (result?.payload?.status === "error") {
                handleRelaseCloseModal();
                setTimeout(() => {
                    showAlert("Error", "error", result?.payload?.message)
                }, 1000);
            }
        })
    }

    const handleCancelPayment = () => {

        dispatch(setRoute({
            route: SCREENS.USER_SERVICE_DETAIL,
            request_id: buddyDetail?.id,
        }))
        resetNavigation(navigation, SCREENS.PAYMENT_CANCELLATION);
        handleRelaseCloseModal();
    }

    const handleWalletPayment = (method, payment_method_id = "pm_xyz-testing-id") => {

        let amount = parseInt(buddyDetail?.hours * buddyDetail?.user?.hourly_rate)
        const paymentPayload = {
            payment_method_id: payment_method_id,
            buddy_id: buddyDetail?.buddy_id,
            request_id: buddyDetail?.id,
            type: "SERVICE",
            method: method,   //[CARD,WALLET]
            amount: amount
        }
        dispatch(cardWalletPaymentTransfer(JSON.stringify(paymentPayload))).then((result) => {
            setPaymentLoader(false)
            if (result?.payload?.status === "success") {
                showAlert("Success", "success", result?.payload?.message);
                handleServicePayCloseModal();
                setOverlayOpened(false);
                setTimeout(() => {
                    handleBackPress();
                }, 3000);

            }

            else if (result?.payload?.errors) {
                setPaymentLoader(false)
                setOverlayOpened(false);
                handleServicePayCloseModal();
                setTimeout(() => {
                    showAlert("Error", "error", result?.payload?.errors)
                }, 1000);

            }

            else if (result?.payload?.status === "error") {
                setPaymentLoader(false)
                setOverlayOpened(false);
                handleServicePayCloseModal();
                setTimeout(() => {
                    showAlert("Error", "error", result?.payload?.message)
                }, 1000);
            }
        })
    }

    const handleReportBuddy = () => {

        dispatch(setRoute({
            route: SCREENS.USER_SERVICE_DETAIL,
            buddy_id: buddyDetail?.buddy_id,
            buddy_name: buddyDetail?.user?.full_name,
            request_id: currentRoute?.request_id
        }))
        resetNavigation(navigation, SCREENS.REPORT_BUDDY)
    }

    const handleRateToBuddy = () => {

        dispatch(setRoute({
            route: SCREENS.USER_SERVICE_DETAIL,
            buddy_id: buddyDetail?.buddy_id,
            buddy_image: buddyDetail?.user?.images[0].image_url,
            request_id: currentRoute?.request_id,
            addRate: true
        }))
        resetNavigation(navigation, SCREENS.RATE_BUDDY)
    }

    const handleUpdateBuddyRate = () => {

        dispatch(setRoute({
            route: SCREENS.USER_SERVICE_DETAIL,
            buddy_id: buddyDetail?.buddy_id,
            buddy_image: buddyDetail?.user?.images[0].image_url,
            request_id: currentRoute?.request_id,
            rate_id: buddyDetail?.rating?.id,
            comment: buddyDetail?.rating?.comment,
            stars: buddyDetail?.rating?.stars,
            addRate: false
        }))
        resetNavigation(navigation, SCREENS.RATE_BUDDY)
    }

    const renderLoader = () => {
        return <FullScreenLoader
            title={"Please wait fetching buddy detail..."}
            loading={loading} />
    }

    //card payment trigger from here.....

    const handleUserUpdate = () => {
        const updatedInfo = {
            is_subscribed: true
        };
        dispatch(updateUserLoginInfo(updatedInfo));
    };

    const handleAttachPaymentMethod = (paymentMethodId) => {
        const payload = {
            payment_method_id: paymentMethodId
        }
        dispatch(attachPaymentMethod(payload)).then((result) => {
            setPaymentLoader(true)
            if (result?.payload?.status === "success") {
                console.log("attachPayment--->", result?.payload)
                handleUserUpdate();
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
        try {
            const { paymentMethod, error } = await createPaymentMethod({
                type: 'card',
                card: cardDetails.card,
                paymentMethodType: 'Card',
            },);

            if (error) {
                showAlert("Error", "error", error?.message)
                console.error('Error creating payment method:', error);
            } else {
                console.log('Created payment method:', paymentMethod?.id);
                //call create customer api here..
                if (customer_id === null) {
                    console.log("customer not created")
                    handleCreateCustomer(paymentMethod?.id)
                } else {
                    console.log("customer already created")
                    handleAttachPaymentMethod(paymentMethod?.id)
                }
            }
        } catch (error) {
            console.error('Error creating payment method:', error);
        }
    }

    const handleCancelService = () => {

        const payload = {
            request_id: buddyDetail?.id,
            current_date: moment().format('YYYY-MM-DD'),
            current_time: moment().format('HH:mm:ss'),
            cancel_by: "user" // buddy or user
        };

        console.log(payload)

        dispatch(cancelService(payload)).then((result) => {
            if (result?.payload?.status === "success") {
                showAlert("Success", "success", result?.payload?.message)
                setTimeout(() => {
                    handleBackPress();
                }, 3000);

            } else if (result?.payload?.error) {
                setServiceErrorMessage(result?.payload?.message)
                setServiceCancelModal(true);
                // show modal here....
            }
        })

    }


    const handleBuddyRatingNav = () => {
        dispatch(setRoute({
            ...currentRoute,
            route: SCREENS.USER_SERVICE_DETAIL,
            buddy_id: buddyDetail?.buddy_id
        }))
        resetNavigation(navigation, SCREENS.RATING)
    }



    const Overlay = () => {
        return (
            <View style={styles.overlay}>

                <Animatable.View
                    animation="bounceIn"
                    duration={2000}
                    style={{
                        backgroundColor: 'white',
                        width: '80%',
                        height: keyboardStatus ? '40%' : '25%',
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
                        loading={paymentLoader}
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

    return (
        <SafeAreaView style={styles.container}>
            <Header
                onPress={() => {
                    handleBackPress();
                }}
                title={"Service Details"}
                icon={"more-vert"}
                iconPress={() => {
                    refRBSheet.current.open()
                }}
            />

            {
                loading ? renderLoader() : <ScrollView style={{ flex: 1 }}>
                    <View style={[styles.carouselContainer]}>

                        <FlatList
                            data={buddyDetail?.user?.images}
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


                        <View style={styles.dotContainer}>
                            {buddyDetail?.user?.images?.map((_, index) => (
                                <View
                                    key={index}
                                    style={[
                                        styles.indicator,
                                        index === activeIndex && styles.activeIndicator,
                                    ]}
                                />
                            ))}
                        </View>


                        <View style={styles.detailContainer}>

                            <View style={styles.profileDescription}>


                                <Text style={{
                                    color: theme.dark.white,
                                    fontSize: scaleHeight(22),
                                    fontFamily: fonts.fontsType.semiBold,

                                }}>
                                    {`${buddyDetail?.user?.full_name} (${calculateAge(buddyDetail?.user?.dob)})`}
                                </Text>

                                <TouchableOpacity
                                    onPress={() => {
                                        handleBuddyRatingNav();
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
                                        {buddyDetail?.avg_rating != null ? parseInt(buddyDetail?.avg_rating).toFixed(1) : 0}
                                    </Text>

                                </TouchableOpacity>

                            </View>
                            <HorizontalDivider />

                            <View style={styles.profileDescription}>


                                <Text style={{
                                    color: theme.dark.secondary,
                                    fontSize: scaleHeight(18),
                                    fontFamily: fonts.fontsType.medium,

                                }}>
                                    About
                                </Text>

                            </View>

                            <Text style={{
                                color: theme.dark.inputLabel,
                                fontSize: scaleHeight(15),
                                fontFamily: fonts.fontsType.light,
                                lineHeight: scaleHeight(28),
                                marginBottom: scaleHeight(10)
                            }}>
                                {buddyDetail?.user?.about}
                            </Text>

                            <HorizontalDivider />

                            <DetailItem label="Gender" value={buddyDetail?.user?.gender} />
                            <DetailItem label="Height" value={`${buddyDetail?.user?.height_ft}'${buddyDetail?.user?.height_in}`} />
                            <DetailItem label="Weight" value={`${buddyDetail?.user?.weight} ${buddyDetail?.user?.weight_unit}`} />
                            <DetailItem label="Hourly Rate" value={`$${buddyDetail?.user?.hourly_rate}`} />
                            <DetailItem label="Languages" value={`${buddyDetail?.user?.languages !== null && buddyDetail?.user?.languages != undefined ? JSON.parse(buddyDetail?.user?.languages) : ''}`} />


                            <Text style={{
                                color: theme.dark.secondary,
                                fontSize: scaleHeight(18),
                                fontFamily: fonts.fontsType.medium,
                                marginTop: scaleHeight(10)

                            }}>
                                Categories
                            </Text>

                            <View style={{
                                marginHorizontal: -5,
                                marginTop: scaleHeight(5)
                            }}>
                                <CategoryList
                                    categories={[categories]}
                                    isPress={false}
                                />

                            </View>

                            <HorizontalDivider />


                            <Text style={{
                                color: theme.dark.secondary,
                                fontSize: scaleHeight(18),
                                fontFamily: fonts.fontsType.medium,
                                marginTop: scaleHeight(20)

                            }}>
                                Where to Meet
                            </Text>

                            <View style={{
                                flexDirection: 'row',
                                marginTop: scaleHeight(10),
                                marginHorizontal: -5,
                                marginBottom: scaleHeight(5)
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
                                    fontSize: scaleHeight(14),
                                    fontFamily: fonts.fontsType.regular,
                                    marginHorizontal: 5
                                }}>
                                    {buddyDetail?.location}
                                </Text>

                            </View>

                            <HorizontalDivider />

                            <DetailItem label="Date" value={moment(buddyDetail?.booking_date?.split('T')[0]).format('DD/MM/YYYY')} />
                            <DetailItem label="Time" value={moment(buddyDetail?.booking_time, 'HH:mm').format('hh:mm A')} />
                            <DetailItem label="Hour" value={`${buddyDetail?.hours} hours`} />
                            {(buddyDetail?.status !== "ACCEPTED" && buddyDetail?.status !== "COMPLETED") && <DetailItem label="Status" value={getNameByStatus(buddyDetail?.status)} customTextStyle={{
                                color: getColorByStatus(buddyDetail?.status)
                            }} />}

                            {(buddyDetail?.status == "ACCEPTED" || buddyDetail?.buddy_request_back?.buddy_status === "ACCEPTED") &&
                                <DetailItem label="Meeting Code" value={`${buddyDetail?.meeting_code}`} customTextStyle={{
                                    color: theme.dark.secondary,
                                    fontFamily: fonts.fontsType.bold,
                                    fontSize: scaleHeight(17),
                                }} />}

                            {(buddyDetail?.status == "ACCEPTED" || buddyDetail?.buddy_request_back?.buddy_status === "ACCEPTED") &&
                                <DetailItem label="Meeting Code Verified" value={buddyDetail?.meeting_code_verified ? 'Yes' : 'No'} customTextStyle={{
                                    color: theme.dark.secondary,
                                    fontFamily: fonts.fontsType.bold,
                                    fontSize: scaleHeight(17),
                                }} />}

                            {/* requested back section */}

                            {
                                buddyDetail?.status === "REQUEST_BACK" && <View>

                                    <HorizontalDivider />


                                    <View style={[styles.categorySection, { marginTop: 10, flexDirection: 'row' }]}>
                                        <Text style={{
                                            color: theme.dark.secondary,
                                            fontSize: scaleHeight(18),
                                            fontFamily: fonts.fontsType.medium,
                                            flex: 1
                                            //marginTop: scaleHeight(20)

                                        }}>
                                            Request From Buddy
                                        </Text>

                                        <View style={[styles.statusContainer, { backgroundColor: getColorByStatus(buddyDetail?.buddy_request_back?.buddy_status) },]}>
                                            <Text style={styles.statusText}>
                                                {getNameByStatus(buddyDetail?.buddy_request_back?.buddy_status)}
                                            </Text>
                                        </View>

                                    </View>



                                    <DetailItem label="Date" value={buddyDetail?.buddy_request_back?.booking_date && moment(buddyDetail?.buddy_request_back?.booking_date?.split('T')[0]).format('DD/MM/YYYY')} />
                                    <DetailItem label="Time" value={buddyDetail?.buddy_request_back?.booking_time && moment(buddyDetail?.buddy_request_back?.booking_time, 'HH:mm').format('hh:mm A')} />
                                    <DetailItem label="Location" />
                                    <View style={{
                                        flexDirection: 'row',
                                        marginTop: scaleHeight(10),
                                        marginHorizontal: -5,
                                        marginBottom: scaleHeight(-120)
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
                                            fontSize: scaleHeight(14),
                                            fontFamily: fonts.fontsType.regular,
                                            marginHorizontal: 5
                                        }}>
                                            {buddyDetail?.buddy_request_back?.buddy_location}
                                        </Text>

                                    </View>

                                </View>
                            }

                            {/* rating section */}
                            {buddyDetail?.status === "COMPLETED" &&
                                buddyDetail?.rating?.id != null && <View style={{
                                    //marginTop: '40%'  i have commited this due to spaces if need uncommit it.
                                }}>
                                    <HorizontalDivider />
                                    <View style={{
                                        flexDirection: 'row',
                                        marginTop: 10
                                    }}>
                                        <Text style={{
                                            color: theme.dark.secondary,
                                            fontSize: scaleHeight(18),
                                            fontFamily: fonts.fontsType.medium,

                                            flex: 1,
                                            alignSelf: 'center'

                                        }}>
                                            Rating of Services
                                        </Text>

                                        <TouchableOpacity
                                            onPress={() => {
                                                handleUpdateBuddyRate();
                                            }}
                                            style={{
                                                padding: 8
                                            }}>
                                            <Image style={{
                                                width: scaleWidth(16),
                                                height: scaleHeight(16),
                                                alignSelf: 'center'
                                            }} source={updateRating} />
                                        </TouchableOpacity>


                                    </View>
                                    <StarRatingDisplay
                                        disabled={true}
                                        rating={buddyDetail?.rating?.stars ? buddyDetail?.rating?.stars : 0}
                                        maxStars={5}
                                        color={theme.dark.secondary}
                                        starSize={20}
                                        StarIconComponent={(props) => <CustomStarIcon {...props} />}
                                        style={{
                                            marginTop: 10,
                                            marginStart: -5
                                        }}
                                    />
                                    <Text style={{
                                        color: theme.dark.inputLabel,
                                        fontSize: scaleHeight(15),
                                        fontFamily: fonts.fontsType.light,
                                        lineHeight: scaleHeight(28),
                                        marginBottom: scaleHeight(10)
                                    }}>
                                        {buddyDetail?.rating?.comment}
                                    </Text>
                                </View>}

                        </View>

                    </View>


                </ScrollView>
            }

            {/* payment mechanism changed */}
            {/* {canPayForService && (
                <Button
                    onPress={handleServicePayOpenModal}
                    title="Pay for Service"
                    customStyle={{
                        marginBottom: 20
                    }}
                />
            )} */}


            {/* requested buttons show here..... */}

            {canRespondToRequest && (
                <View style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    padding: 20
                    //marginBottom: scaleHeight(-160)
                }}>
                    <Button
                        onPress={() => {
                            setRequestStatus("REJECTED");
                            handleAcceptRejectRequest("REJECTED");
                        }}
                        title="Reject"
                        loading={requestStatus === "REJECTED" && requestLoader}
                        customStyle={{
                            width: '48%',
                            borderWidth: 1,
                            borderColor: theme.dark.secondary,
                            backgroundColor: theme.dark.transparentBg,
                            marginRight: '2%',
                            marginBottom: scaleHeight(0)
                        }}
                        textCustomStyle={{
                            color: theme.dark.secondary,
                        }}
                    />
                    <Button
                        onPress={() => {
                            setRequestStatus("ACCEPTED");
                            handleAcceptRejectRequest("ACCEPTED");
                        }}
                        loading={requestStatus === "ACCEPTED" && requestLoader}
                        title="Accept"
                        customStyle={{
                            width: '48%',
                            marginBottom: scaleHeight(0)
                        }}
                    />
                </View>
            )}


            {/* {buddyDetail?.status === "REQUEST_BACK" && !loading && <View style={{ */}


            {/* paid buttons show here..... */}

            {canRateBuddy && (
                <View style={{
                    flexDirection: 'row',
                    justifyContent: canReleasePayment ? 'space-between' : 'center',
                    padding: 20,
                    //marginBottom: scaleHeight(-160)
                }}>
                    <Button
                        onPress={handleRateToBuddy}
                        title="Rate Buddy"
                        customStyle={{
                            width: canReleasePayment ? '48%' : '100%',
                            borderWidth: 1,
                            borderColor: theme.dark.secondary,
                            backgroundColor: theme.dark.transparentBg,
                            marginRight: canReleasePayment ? '2%' : '0%',
                            marginBottom: scaleHeight(0),
                        }}
                        textCustomStyle={{
                            color: theme.dark.secondary,
                            fontFamily: fonts.fontsType.bold,
                            fontSize: scaleHeight(13),
                        }}
                    />
                    {canReleasePayment && (

                        <Button
                            onPress={handleRelaseOpenModal}
                            disabled={buddyDetail?.is_released ||
                                (buddyDetail?.canceled_status === "REQUESTED" ||
                                    buddyDetail?.canceled_status === "REJECTED") ? true : false}
                            title={
                                (buddyDetail?.canceled_status === "REQUESTED" || buddyDetail?.canceled_status === "REJECTED")
                                    ? "Cancelled Payment"
                                    : !buddyDetail?.is_released
                                        ? "Release Payment"
                                        : "Payment Released"
                            }
                            customStyle={{
                                width: '48%',
                                marginBottom: scaleHeight(0),
                                backgroundColor: buddyDetail?.is_released || (buddyDetail?.canceled_status === "REQUESTED" || buddyDetail?.canceled_status === "REJECTED")
                                    ? theme.dark.disableButton
                                    : theme.dark.secondary
                            }}
                            textCustomStyle={{
                                fontFamily: fonts.fontsType.bold,
                                fontSize: scaleHeight(13),
                                color: buddyDetail?.is_released || (buddyDetail?.canceled_status === "REQUESTED" || buddyDetail?.canceled_status === "REJECTED")
                                    ? theme.dark.disableButtonText
                                    : theme.dark.buttonText
                            }}
                        />

                        // <Button
                        //     onPress={handleRelaseOpenModal}
                        //     disabled={buddyDetail?.is_released}
                        //     title={!buddyDetail?.is_released ? "Release Payment" : "Payment Released"}
                        //     customStyle={{
                        //         width: '48%',
                        //         marginBottom: scaleHeight(0),
                        //         backgroundColor: !buddyDetail?.is_released ?
                        //             theme.dark.secondary :
                        //             theme.dark.disableButton
                        //     }}
                        //     textCustomStyle={{
                        //         fontFamily: fonts.fontsType.bold,
                        //         fontSize: scaleHeight(13),
                        //         color: !buddyDetail?.is_released ?
                        //             theme.dark.buttonText :
                        //             theme.dark.disableButtonText
                        //     }}
                        // />
                    )}
                </View>
            )}

            {(buddyDetail?.status == "ACCEPTED" ||
                buddyDetail?.buddy_request_back?.buddy_status === "ACCEPTED") && !loading && <View>
                    <Button
                        loading={cancelServiceLoader}
                        onPress={() => {
                            handleCancelService()
                        }}
                        title={"Cancel Service"}
                        customStyle={{
                            width: '90%',

                            backgroundColor: theme.dark.error
                        }}
                        textCustomStyle={{ color: theme.dark.white }}
                    />
                </View>}


            {isOverlayOpened && Overlay()}
            {renderSheet()}
            <CustomModal
                isVisible={modalVisible}
                onClose={handleCloseModal}
                headerTitle={"Block User?"}
                imageSource={blockUser}
                isParallelButton={true}
                text={`Are you sure you want to Block ${buddyDetail?.user?.full_name}?`}
                parallelButtonText1={"Cancel"}
                parallelButtonText2={"Yes, Block"}
                parallelButtonPress1={() => {
                    handleCloseModal()
                }}
                parallelButtonPress2={() => {
                    handleBlockUser();
                }}
            />

            <CustomModal
                isVisible={relesePaymentModal}
                onClose={handleRelaseCloseModal}
                headerTitle={"Release Payment?"}
                imageSource={warningImg}
                isParallelButton={true}
                loading={paymentLoading}
                text={`Ready to release payment for this service?`}
                parallelButtonText1={"Cancel Payment"}
                parallelButtonText2={"Release"}
                parallelButtonPress1={() => {
                    handleCancelPayment();
                }}
                parallelButtonPress2={() => {
                    handleReleasePayment();
                }}
            />

            <CustomModal
                isVisible={servicePayModal}
                onClose={handleServicePayCloseModal}
                headerTitle={"Payment Method"}
                imageSource={warningImg}
                isParallelButton={true}
                //loading={paymentLoading}
                secondaryLoader={paymentTransferLoader}
                text={`Do you want to pay through your wallet?`}
                parallelButtonText1={"Wallet"}
                parallelButtonText2={"Card Payment"}
                parallelButtonPress1={() => {
                    handleWalletPayment("WALLET");
                }}
                parallelButtonPress2={() => {
                    setOverlayOpened(true);
                    handleServicePayCloseModal();
                }}
            />

            <CustomModal
                isVisible={serviceCancelModal}
                onClose={handleCloseServiceModal}
                headerTitle={"Cancel Service"}
                imageSource={warningImg}
                text={serviceErrorMessage}
                buttonText="Ok"
                isParallelButton={false}
                isCross={false}
                buttonAction={() => {
                    handleCloseServiceModal();
                }}
            />

        </SafeAreaView>
    );
};

// define your styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.dark.primary,
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
    imageCircle: {
        width: scaleWidth(118), // Ensure this matches the height scaling for a perfect circle
        height: scaleWidth(118), // Use scaleWidth to keep the dimensions consistent
        borderRadius: scaleWidth(118) / 2, // Half of the width/height to make it a circle
        borderWidth: 4,
        borderColor: theme.dark.secondary,
        alignSelf: 'center',
        position: 'absolute',
        top: scaleHeight(280),
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
        marginBottom: scaleHeight(120)

    },
    carouselItem: {
        width: scaleWidth(375),
        height: scaleHeight(400),
        justifyContent: 'center',
        alignItems: 'center',
    },
    carouselImage: {
        width: '85%',
        height: '75%',
        borderRadius: 20,
        alignSelf: 'center'
    },
    dotContainer: {
        position: 'absolute',
        top: scaleHeight(390),
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
        alignSelf: 'center'
    },

    detailContainer: {
        padding: 30,
        //top: scaleHeight(-20)
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
    indicator: {
        width: 8,
        height: 8,
        borderRadius: 5,
        backgroundColor: theme.dark.transparentBg,
        marginHorizontal: 5,
        borderWidth: 1,
        borderColor: theme.dark.secondary
    },
    activeIndicator: {
        width: 24,
        height: 8,
        borderRadius: 5,
        backgroundColor: theme.dark.secondary,
    },
    overlay: {
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
    statusContainer: {
        height: scaleHeight(30),
        backgroundColor: '#00E200',
        borderRadius: 20,
        padding: 6,
        justifyContent: 'center',
        alignItems: 'center'
    },
    statusText: {
        fontFamily: fonts.fontsType.regular,
        fontSize: scaleHeight(12),
        color: theme.dark.white,
        alignSelf: 'center'
    },
    categorySection: {
        marginBottom: 10,
    },
});

//make this component available to the app
export default UserServiceDetails;
