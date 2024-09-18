import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native';
import { Icon } from 'react-native-elements';
import { useDispatch, useSelector } from 'react-redux';
import { useAlert } from '../../../../../providers/AlertContext';
import { resetNavigation } from '../../../../../utils/resetNavigation';
import useBackHandler from '../../../../../utils/useBackHandler';
import { getUserDetail } from '../../../../../redux/BuddyDashboard/userLikesDetailSlice';
import { getAddressByLatLong } from '../../../../../redux/getAddressByLatLongSlice';
import FullScreenLoader from '../../../../../components/FullScreenLoader';
import Header from '../../../../../components/Header';
import HorizontalDivider from '../../../../../components/HorizontalDivider';
import { scaleHeight } from '../../../../../styles/responsive';
import { theme } from '../../../../../assets';
import fonts from '../../../../../styles/fonts';
import DetailItem from '../../../../../components/DetailItem';
import CategoryList from '../../../../../components/CategoryList';
import { calculateAge } from '../../../../../utils/calculateAge';
import { setRoute } from '../../../../../redux/appSlice';
import { SCREENS } from '../../../../../constant/constants';
import { reverseGeocode } from '../../../../../utils/geoCodeUtils';

const UserProfileDetail = ({ navigation }) => {
    const dispatch = useDispatch();
    const { showAlert } = useAlert();
    const { userDetail, loading } = useSelector((state) => state.getUserDetail)
    const { address } = useSelector((state) => state.getAddress)
    const { currentRoute } = useSelector((state) => state.app)
    const { userLoginInfo } = useSelector((state) => state.auth)
    const [placeName, setPlaceName] = useState('')
    const user_id = userLoginInfo?.user?.id

    const userLocation = userDetail?.location?.country && userDetail?.location?.city
        ? `${userDetail.location.country}, ${userDetail.location.city}`
        : null;

        const addressLocation = (address?.city || address?.town || address?.suburb || address?.country) && address?.country
        ? `${address.city || address.town || address.suburb || address.county  || address.state}, ${address.country}`
        : null;

    const handleBackPress = () => {
        if (currentRoute.route === SCREENS.GENERAL_CHAT) {
            resetNavigation(navigation, SCREENS.GENERAL_CHAT)
        } else {
            resetNavigation(navigation, SCREENS.MAIN_DASHBOARD, { screen: SCREENS.PROFILE })
        }
        return true;
    };
    useBackHandler(handleBackPress);

    useEffect(() => {
        dispatch(getUserDetail(currentRoute?.chat_id || user_id))
    }, [dispatch, user_id, currentRoute])

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

    // useEffect(() => {
    //     if (userDetail) {
    //         const { longitude, latitude } = userDetail?.location
    //         console.log(longitude, latitude)
    //         dispatch(getAddressByLatLong({
    //             lat: latitude,
    //             long: longitude
    //         }));
    //     }
    // }, [dispatch, userDetail])

    const renderLoader = () => {
        return <FullScreenLoader
            title={"Please wait..."}
            loading={loading} />
    }

    const handleUpdateProfile = () => {
        dispatch(setRoute({
            route: SCREENS.USER_PROFILE_DETAIL
        }))
        resetNavigation(navigation, SCREENS.UPDATE_USER_PROFILE)
    }

    return (
        <SafeAreaView style={styles.mainContainer}>
            <Header
                onPress={() => {
                    handleBackPress();
                }}
                title={currentRoute?.chat_id ? "User Detail" : "Profile Details"}
                icon={currentRoute?.chat_id ? null : "edit"}
                iconPress={() => {
                    handleUpdateProfile();
                }}
            />

            {loading ? renderLoader() : <ScrollView style={styles.scrollView}>

                <View style={styles.container}>

                    <View style={styles.profileSection}>
                        <View style={styles.profileView}>
                            <Image
                                style={styles.profileImage}
                                source={{ uri: userDetail?.image_urls && userDetail?.image_urls[0] }}
                            />
                        </View>
                        <View style={styles.profileInfo}>
                            <Text style={styles.profileName}>{`${userDetail?.full_name} (${calculateAge(userDetail?.dob)})`}</Text>
                            <Text style={styles.profileGender}>{userDetail?.gender}</Text>
                        </View>
                    </View>

                    <HorizontalDivider />

                    <View style={styles.categorySection}>
                        <Text style={styles.aboutText}>
                            About
                        </Text>
                        <Text style={styles.aboutDescription}>
                            {userDetail?.about}
                        </Text>
                    </View>

                    <HorizontalDivider customStyle={styles.dividerMarginTop10} />

                    <View style={styles.locationSection}>
                        <Icon style={styles.locationIcon} name="location-on" type="material" color={theme.dark.secondary} />
                        <Text style={styles.locationText}>
                            {userLocation || placeName || 'Location not available'}
                        </Text>
                    </View>

                    <HorizontalDivider customStyle={styles.dividerMarginTop18} />

                    <View style={styles.categorySection}>
                        <DetailItem
                            label="Looking for"
                            value={userDetail?.looking_for_gender}
                            customDetailContainer={styles.customDetailContainer}
                        />
                    </View>

                    <HorizontalDivider customStyle={styles.dividerMarginTop5} />

                    <View style={styles.categorySection}>
                        <Text style={styles.categoryTitle}>
                            Category
                        </Text>
                        <CategoryList
                            categories={userDetail?.categories}
                            isPress={false}
                        />
                    </View>
                </View>
            </ScrollView>}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: theme.dark.primary,
    },
    scrollView: {
        flex: 1,
    },
    container: {
        flex: 1,
        padding: 20,
    },
    profileSection: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
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
    profileImage: {
        width: 60,
        height: 60,
        borderRadius: 30,
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
    categorySection: {
        marginBottom: 10,
    },
    aboutText: {
        color: theme.dark.secondary,
        fontSize: scaleHeight(18),
        fontFamily: fonts.fontsType.medium,
    },
    aboutDescription: {
        color: theme.dark.inputLabel,
        fontSize: scaleHeight(15),
        fontFamily: fonts.fontsType.light,
        lineHeight: scaleHeight(28),
    },
    locationSection: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    locationIcon: {
        top: 8,
        marginBottom: 8,
        alignSelf: 'center'
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
    dividerMarginTop10: {
        marginTop: scaleHeight(10),
    },
    dividerMarginTop18: {
        marginTop: scaleHeight(18),
    },
    customDetailContainer: {
        marginVertical: 6,
        marginHorizontal: 0,
    },
    dividerMarginTop5: {
        marginTop: scaleHeight(5),
    },
    categoryTitle: {
        color: theme.dark.secondary,
        fontSize: scaleHeight(19),
        fontFamily: fonts.fontsType.medium,
    },
});

export default UserProfileDetail;
