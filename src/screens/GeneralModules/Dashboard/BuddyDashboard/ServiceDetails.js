import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native';
import { Icon } from 'react-native-elements';
import { theme } from '../../../../assets';
import DetailItem from '../../../../components/DetailItem';
import Button from '../../../../components/ButtonComponent';
import { resetNavigation } from '../../../../utils/resetNavigation';
import { scaleHeight } from '../../../../styles/responsive';
import fonts from '../../../../styles/fonts';
import Header from '../../../../components/Header';
import HorizontalDivider from '../../../../components/HorizontalDivider';
import { SCREENS } from '../../../../constant/constants';
import useBackHandler from '../../../../utils/useBackHandler';
import { useDispatch, useSelector } from 'react-redux';
import { getRequestById } from '../../../../redux/BuddyDashboard/getRequestByIdSlice';
import FullScreenLoader from '../../../../components/FullScreenLoader';
import { getAddressByLatLong } from '../../../../redux/getAddressByLatLongSlice';
import moment from 'moment';
import { acceptRejectUserRequest } from '../../../../redux/BuddyDashboard/acceptRejectUserRequestSlice';
import { useAlert } from '../../../../providers/AlertContext';
import { color } from '@rneui/base';
import { setRoute } from '../../../../redux/appSlice';
import { getUserDetailByService } from '../../../../redux/BuddyDashboard/getUserDetailByServiceSlice';
import { calculateAge } from '../../../../utils/calculateAge';
import { setWarningContent } from '../../../../redux/warningModalSlice';
import WarningBanner from '../../../../components/WarningBanner';

const ServiceDetails = ({ navigation }) => {
    const dispatch = useDispatch();
    const { showAlert } = useAlert();
    // const { requestDetail, loading } = useSelector((state) => state.getRequestById)
    const { userDetail: requestDetail, loading } = useSelector((state) => state.getUserDetailByService)
    const { address } = useSelector((state) => state.getAddress)
    const { currentRoute } = useSelector((state) => state.app)
    const [requestLoader, setRequestLoader] = useState(false);
    const [requestStatus, setRequestStatus] = useState('');

    const handleBackPress = () => {
        resetNavigation(navigation, currentRoute?.route, { screen: SCREENS.HOME })
        return true;
    };
    useBackHandler(handleBackPress);

    useEffect(() => {
        // dispatch(getRequestById(currentRoute?.request_id))
        dispatch(getUserDetailByService(currentRoute?.request_id))
    }, [dispatch, currentRoute])

    useEffect(() => {
        if (requestDetail) {
            const { longitude, latitude } = requestDetail?.user?.location
            dispatch(getAddressByLatLong({
                lat: latitude,
                long: longitude
            }));
        }

    }, [dispatch, requestDetail])


    const getNameByStatus = (status) => {
        switch (status) {
            case "ACCEPTED":
                return 'Accepted';

            case "REJECTED":
                return 'Rejected';

            case "REQUEST_BACK":
                return 'Requested by me';

            case "REQUESTED":
                return 'Pending';

            default:
                return ''; // Default color if status doesn't match
        }
    }

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

    const user = requestDetail?.user;
    const location = user?.location;
    const booking = requestDetail;

    const country = location?.country || '';
    const city = location?.city || '';
    const category = booking?.category || {};
    const full_name = user?.full_name || '';
    const gender = user?.gender || '';
    const hourly_rate = booking?.booking_price || '';
    const dob = user?.dob || '';
    const images = user?.images || [];
    const bookingDate = booking?.booking_date || '';
    const bookingTime = booking?.booking_time || '';
    const hours = booking?.hours || '';
    const status = booking?.status || '';

    const date = bookingDate ? moment(bookingDate.split('T')[0]).format('DD/MM/YYYY') : '';
    const time = bookingTime ? moment(bookingTime, 'HH:mm').format('hh:mm A') : '';

    const requestedByMeDate = requestDetail?.buddy_request_back?.booking_date ? moment(requestDetail?.buddy_request_back?.booking_date.split('T')[0]).format('DD/MM/YYYY') : '';
    const requestedByMeTime = requestDetail?.buddy_request_back?.booking_time ? moment(requestDetail?.buddy_request_back?.booking_time, 'HH:mm').format('hh:mm A') : '';
    const requestedByMeLocation = requestDetail?.buddy_request_back?.buddy_location ? requestDetail?.buddy_request_back?.buddy_location : '';

    const handleAcceptRejectRequest = (status) => {
        setRequestLoader(true);
        setRequestStatus(status);
        const acceptRejectPayload = {
            request_id: currentRoute?.request_id,
            status: status
        }

        dispatch(acceptRejectUserRequest(acceptRejectPayload)).then((result) => {
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

    const handleRequestBack = () => {
        const payload = {
            request_id: currentRoute?.request_id,
            route: SCREENS.SERVICE_DETAILS
        }
        dispatch(setRoute(payload))
        resetNavigation(navigation, SCREENS.BUDDY_SEND_REQUEST)
    }

    const renderLoader = () => {
        return <FullScreenLoader
            title={"Please wait fetching service detail..."}
            loading={loading} />
    }

    return (
        <SafeAreaView style={styles.mianContainer}>
            <Header
                onPress={() => {
                    handleBackPress();
                }}
                title={"Service Details"}
            />
            <HorizontalDivider customStyle={{
                marginTop: scaleHeight(10)
            }} />
            <WarningBanner containerStyle={{ marginTop: 0 }} />

            {loading ? renderLoader() : <ScrollView style={{ flex: 1 }}>

                <View style={styles.container}>

                    <View style={styles.profileSection}>
                        <View style={styles.profileView}>
                            <Image
                                
                                style={styles.profileImage}
                                source={{ uri: images[0]?.image_url }}
                            />
                        </View>
                        <View style={styles.profileInfo}>
                            <Text style={styles.profileName}>{`${full_name} (${calculateAge(dob)})`}</Text>
                            <Text style={styles.profileGender}>{gender}</Text>
                        </View>
                    </View>

                    <HorizontalDivider />

                    <View style={styles.locationSection}>
                        <Icon style={{
                            top: 8,
                            marginBottom: 8,
                            alignSelf: 'center'
                        }} name="location-on" type="material" color="#ffd700" />
                        <Text style={styles.locationText}>{country && city ?
                            `${country}, ${city}` :
                            (address?.city || address?.town) && address?.country ?
                                `${address.city || address.town}, ${address.country}` :
                                'Location not available'
                        }</Text>
                    </View>
                    <HorizontalDivider customStyle={{
                        marginTop: scaleHeight(18)
                    }} />
                    <View style={styles.categorySection}>
                        <Text style={{
                            color: theme.dark.secondary,
                            fontSize: scaleHeight(18),
                            fontFamily: fonts.fontsType.medium,
                            marginHorizontal: 10

                        }}>
                            Category
                        </Text>
                        <TouchableOpacity
                            style={[styles.containerItem]}
                        >
                            <Image source={{
                                uri: category?.image_url
                            }} style={styles.image} />
                            <Text style={styles.text}>{category?.name}</Text>
                        </TouchableOpacity>
                    </View>
                    <HorizontalDivider customStyle={{
                        marginTop: scaleHeight(10)
                    }} />
                    <View style={styles.detailsSection}>
                        <DetailItem label="Date" value={date} />
                        <DetailItem label="Time" value={time} />
                        <DetailItem label="Hours For Booking" value={`${hours} HOURS`} />
                        <DetailItem label="Total Price" value={`$${hourly_rate}`} />
                        {(status !== "ACCEPTED" && status !== "COMPLETED") && <DetailItem label="Status" value={getNameByStatus(status)} customTextStyle={{
                            color: getColorByStatus(status)
                        }} />}
                    </View>

                    <HorizontalDivider customStyle={{
                        marginTop: scaleHeight(18)
                    }} />

                    {requestDetail?.buddy_request_back?.buddy_status != null && <View>

                        <View style={styles.statusSection}>
                            <Text style={{
                                color: theme.dark.secondary,
                                fontSize: scaleHeight(18),
                                fontFamily: fonts.fontsType.medium,
                                marginHorizontal: 10,
                                flex: 1

                            }}>
                                Request by me
                            </Text>
                            <TouchableOpacity
                                style={[styles.statusContainer, {
                                    backgroundColor: getColorByStatus(requestDetail?.buddy_request_back?.buddy_status)
                                }]}
                            >
                                <Text style={[styles.text, { fontSize: 12, fontFamily: fonts.fontsType.semiBold }]}>{getNameByStatus(requestDetail?.buddy_request_back?.buddy_status)}</Text>
                            </TouchableOpacity>
                        </View>

                        <View style={styles.detailsSection}>
                            <DetailItem label="Date" value={requestedByMeDate} />
                            <DetailItem label="Time" value={requestedByMeTime} />
                            <DetailItem label="Location" />
                        </View>

                        <View style={[styles.locationSection, { top: -20 }]}>
                            <Icon style={{
                                top: 8,
                                marginBottom: 8,
                                alignSelf: 'center'
                            }} name="location-on" type="material" color={theme.dark.secondary} />
                            <Text style={[styles.locationText, { fontSize: 14 }]}>{requestedByMeLocation}</Text>
                        </View>

                    </View>}


                </View>
            </ScrollView>}
            <View style={styles.buttonSection}>

                {(status === "REQUESTED" &&
                    status !== "ACCEPTED" &&
                    status !== "REJECTED" &&
                    (requestDetail?.buddy_request_back?.buddy_status !== "ACCEPTED" &&
                        requestDetail?.buddy_request_back?.buddy_status !== "REJECTED")) &&
                    <Button
                        onPress={handleRequestBack}
                        title={"Request Back"}
                        customStyle={{
                            width: '95%',
                            top: scaleHeight(30)
                        }}
                        textCustomStyle={{}}
                    />
                }

                {/* {status != "ACCEPTED" && status != "REJECTED" && !loading && <Button
                    onPress={() => {
                        handleRequestBack();
                    }}
                    title={"Request Back"}
                    customStyle={{
                        width: '95%',
                        top: scaleHeight(20)
                    }}
                    textCustomStyle={{
                    }}
                />} */}


                {status === "REQUESTED" && !loading && <View style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    //marginBottom: scaleHeight(-160)
                }}>

                    <Button
                        onPress={() => {
                            setRequestStatus("REJECTED");
                            handleAcceptRejectRequest("REJECTED");
                        }}
                        title={"Reject"}
                        loading={requestStatus === "REJECTED" && requestLoader}
                        customStyle={{
                            width: '48%',
                            borderWidth: 1,
                            borderColor: theme.dark.secondary,
                            backgroundColor: theme.dark.transparentBg,
                            marginHorizontal: '2%',
                        }}
                        textCustomStyle={{
                            color: theme.dark.secondary,

                        }}
                        isBgTransparent={true}
                    />

                    <Button
                        onPress={() => {
                            setRequestStatus("ACCEPTED");
                            handleAcceptRejectRequest("ACCEPTED");
                        }}
                        loading={requestStatus === "ACCEPTED" && requestLoader}
                        title={"Accept"}
                        customStyle={{
                            width: '48%',
                        }}
                    />

                </View>}
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    mianContainer: {
        flex: 1,
        backgroundColor: theme.dark.primary,
    },
    container: {
        flex: 1,
        padding: 20,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    headerTitle: {
        color: theme.dark.secondary,
        fontSize: 20,
        marginLeft: 10,
    },
    profileSection: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    profileImage: {
        width: 60,
        height: 60,
        borderRadius: 30,

    },
    profileView: {
        width: 70,
        height: 70,
        borderRadius: 35,
        borderWidth: 2,
        borderColor: theme.dark.secondary,
        alignItems: 'center',
        justifyContent: 'center'
    },
    profileInfo: {
        marginLeft: 10,
    },
    profileName: {
        color: theme.dark.white,
        fontSize: scaleHeight(18),
        fontFamily: fonts.fontsType.semiBold
    },
    profileGender: {
        color: theme.dark.white,
        fontSize: scaleHeight(14),
        fontFamily: fonts.fontsType.regular
    },
    locationSection: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    locationText: {
        color: theme.dark.white,
        fontFamily: fonts.fontsType.regular,
        fontSize: scaleHeight(17),
        width: '90%',
        alignSelf: 'center',
        top: 8,
        marginBottom: 8,

    },
    categorySection: {
        marginBottom: 10,
    },
    statusSection: {
        flexDirection: 'row',
        marginBottom: 10,
    },
    categoryTitle: {
        color: theme.dark.secondary,
        fontSize: 16,
        marginBottom: 10,
    },
    categoryTag: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#555',
        padding: 10,
        borderRadius: 5,
    },
    categoryText: {
        color: '#fff',
        marginLeft: 5,
    },
    detailsSection: {
        marginBottom: 20,
    },
    detailRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    detailLabel: {
        color: theme.dark.secondary
    },
    detailValue: {
        color: '#fff',
    },
    buttonSection: {
        alignItems: 'center',
    },
    actionButtons: {
        flexDirection: 'row',
    },
    containerItem: {
        width: '40%',
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: theme.dark.inputBg,
        borderRadius: 30,
        borderWidth: 1,
        borderColor: theme.dark.inputLabel,
        padding: 10,
        margin: 5,
        marginTop: 10
        //flex: 0.5,
    },
    text: {
        fontFamily: fonts.fontsType.medium,
        fontSize: scaleHeight(15),
        color: theme.dark.black,
    },
    image: {
        width: 15,
        height: 15,
        marginRight: 10,
    },

    statusContainer: {
        width: '20%',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: theme.dark.inputBg,
        borderRadius: 30,
        borderWidth: 1,
    },
});

export default ServiceDetails;
