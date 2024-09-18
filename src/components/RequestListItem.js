//import liraries
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { theme } from '../assets';
import { scaleHeight, scaleWidth } from '../styles/responsive';
import fonts from '../styles/fonts';
import Button from './ButtonComponent';
import { resetNavigation } from '../utils/resetNavigation';
import { SCREENS } from '../constant/constants';
import { useAlert } from '../providers/AlertContext';
import moment from 'moment';
import { useDispatch, useSelector } from 'react-redux';
import { acceptRejectUserRequest } from '../redux/BuddyDashboard/acceptRejectUserRequestSlice';
import { setRoute } from '../redux/appSlice';
import * as Animatable from 'react-native-animatable';

const RequestListItem = ({ item, navigation, onRequestStatusChange, index }) => {
    const dispatch = useDispatch();
    const { showAlert } = useAlert();
    //const dateTime = moment(`${item?.booking_date?.split('T')[0]}T${item?.booking_time}Z`);
    const [requestStatus, setRequestStatus] = useState('');
    const [loading, setLoading] = useState(false);


    const getColorByStatus = (status) => {
        switch (status) {
            case "ACCEPTED":
                return '#00E200';

            case "REJECTED":
                return '#FF2A04';

            case "REQUEST_BACK":
                return '#4285F4';

            case "REQUESTED":
                return '#4285F4';

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
                return 'Requested by me';

            case "REQUESTED":
                return 'Requested';

            default:
                return '';
        }
    }

    const getNameByBackStatus = (status) => {
        switch (status) {
            case "ACCEPTED":
                return 'Accepted';

            case "REJECTED":
                return 'Rejected';
            default:
                return '';
        }
    }

    const getColorByBackStatus = (status) => {
        switch (status) {
            case "ACCEPTED":
                return '#00E200';

            case "REJECTED":
                return '#FF2A04';

            default:
                return '#00000000'; // Default color if status doesn't match
        }
    }

    const handleAcceptRejectRequest = (status) => {
        setLoading(true);
        setRequestStatus(status)
        const acceptRejectPayload = {
            request_id: item?.id,
            status: status
        }

        dispatch(acceptRejectUserRequest(acceptRejectPayload)).then((result) => {
            setLoading(false);
            if (result?.payload?.status === "success") {
                showAlert("Success", "success", result?.payload?.message)
                onRequestStatusChange(item?.id, status);

            } else {
                showAlert("Error", "error", result?.payload?.message)
            }
        })
    }

    const handleRequestDetail = (request_id) => {
        const route = {
            request_id: request_id,
            route: SCREENS.MAIN_DASHBOARD
        }
        dispatch(setRoute(route));
        resetNavigation(navigation, SCREENS.SERVICE_DETAILS);
    }

    return (
        // <Animatable.View
        //     animation={'flipInX'}
        //     duration={500}
        //     delay={index}>
        <TouchableOpacity
            onPress={() => {
                handleRequestDetail(item?.id)
            }}
            style={styles.container}>
            <View style={styles.row}>
                <Image
                    style={styles.image}
                    source={{ uri: item?.user?.images[0]?.image_url }}
                    resizeMode='cover'
                />

                <View style={styles.flex1}>
                    <View style={styles.headerRow}>
                        <Text style={styles.userName}>
                            {item?.user?.full_name}
                        </Text>
                        {item?.status !== "REQUESTED" && <View style={[styles.statusContainer,
                        {
                            backgroundColor: (item?.buddy_request_back?.buddy_status === "ACCEPTED" ||
                                item?.buddy_request_back?.buddy_status === "REJECTED") ?
                                getColorByBackStatus(item?.buddy_request_back?.buddy_status) :
                                getColorByStatus(item?.status)
                        },]}>
                            <Text style={styles.statusText}>
                                {(item?.buddy_request_back?.buddy_status === "ACCEPTED" ||
                                    item?.buddy_request_back?.buddy_status === "REJECTED") ?
                                    getNameByBackStatus(item?.buddy_request_back?.buddy_status) :
                                    getNameByStatus(item?.status)}
                                {/* {
                                    item?.status !== "REQUESTED"
                                        ? getNameByStatus(item?.status)
                                        : ''
                                } */}
                            </Text>
                        </View>}
                    </View>

                    <View style={styles.infoRow}>
                        <Text style={styles.categoryText}>
                            Category
                        </Text>
                        <Text style={styles.infoText}>
                            {item?.category?.name}
                        </Text>
                    </View>

                    <View style={styles.infoRow}>
                        <Text style={styles.categoryText}>
                            Date/Time
                        </Text>
                        <Text style={styles.infoText}>
                            {/* {dateTime?.format('DD/MM/YYYY/hh:mma')} */}
                            {`${moment(item?.booking_date, "YYYY-MM-DD").format("DD/MM/YYYY")}/${moment(item?.booking_time, "HH:mm:ss").format("hh:mma")}`}
                        </Text>
                    </View>
                </View>
            </View>

            {item?.status === 'REQUESTED' && <View style={styles.buttonRow}>
                <Button
                    onPress={() => {
                        setRequestStatus("REJECTED");
                        handleAcceptRejectRequest("REJECTED");
                    }}
                    loading={requestStatus === "REJECTED" && loading}
                    title={"Reject Request"}
                    customStyle={styles.rejectButton}
                    textCustomStyle={styles.rejectButtonText}
                    isBgTransparent={true}
                />

                <Button
                    onPress={() => {
                        setRequestStatus("ACCEPTED");
                        handleAcceptRejectRequest("ACCEPTED");
                    }}
                    loading={requestStatus === "ACCEPTED" && loading}
                    title={"Accept Request"}
                    customStyle={styles.acceptButton}
                    textCustomStyle={styles.acceptButtonText}
                />
            </View>}
        </TouchableOpacity>
        // </Animatable.View>
    );
};

// define your styles
const styles = StyleSheet.create({
    container: {
        backgroundColor: theme.dark.inputBackground,
        borderWidth: 1,
        borderColor: theme.dark.inputLabel,
        margin: 8,
        borderRadius: 20,
        padding: 8,
        marginTop: 10,
    },
    row: {
        flexDirection: 'row'
    },
    image: {
        width: scaleWidth(60),
        height: scaleHeight(70),
        borderRadius: 12,
        alignSelf: 'center'
    },
    flex1: {
        flex: 1
    },
    headerRow: {
        flexDirection: 'row',
        marginHorizontal: 8,
        // marginTop: 5
    },
    userName: {
        fontFamily: fonts.fontsType.semiBold,
        fontSize: scaleHeight(16),
        color: theme.dark.white,
        flex: 1
    },
    statusContainer: {
        height: scaleHeight(25),
        backgroundColor: '#00E200',
        borderRadius: 20,
        padding: 4,
        justifyContent: 'center',
        alignItems: 'center'
    },
    statusText: {
        fontFamily: fonts.fontsType.regular,
        fontSize: scaleHeight(12),
        color: theme.dark.white,
        alignSelf: 'center'
    },
    infoRow: {
        flexDirection: 'row',
        marginHorizontal: 8,
        marginTop: 5,

    },
    categoryText: {
        fontFamily: fonts.fontsType.medium,
        fontSize: scaleHeight(15),
        color: theme.dark.white,
        flex: 1
    },
    infoText: {
        fontFamily: fonts.fontsType.regular,
        fontSize: scaleHeight(14),
        color: theme.dark.inputLabel
    },
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10
    },
    rejectButton: {
        width: '48%',
        height: scaleHeight(35),
        borderWidth: 1,
        borderColor: theme.dark.secondary,
        backgroundColor: theme.dark.transparentBg,
        marginHorizontal: '2%',
        marginBottom: 0,
        marginTop: 0
    },
    rejectButtonText: {
        color: theme.dark.secondary,
        fontSize: scaleHeight(14)
    },
    acceptButton: {
        width: '48%',
        height: scaleHeight(35),
        marginBottom: 0,
        marginTop: 0
    },
    acceptButtonText: {
        fontSize: scaleHeight(14)
    }
});

//make this component available to the app
export default RequestListItem;
