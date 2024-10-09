//import liraries
import React, { Component, useEffect, useState } from 'react';
import { StyleSheet, SafeAreaView, View, FlatList, Dimensions, Image, ScrollView, TouchableOpacity } from 'react-native';
import { resetNavigation } from '../../../../../utils/resetNavigation';
import { SCREENS } from '../../../../../constant/constants';
import useBackHandler from '../../../../../utils/useBackHandler';
import Header from '../../../../../components/Header';
import { theme } from '../../../../../assets';
import { useDispatch, useSelector } from 'react-redux';
import { useAlert } from '../../../../../providers/AlertContext';
import { getUserDetail } from '../../../../../redux/BuddyDashboard/userLikesDetailSlice';
import { scaleHeight, scaleWidth } from '../../../../../styles/responsive';
import HorizontalDivider from '../../../../../components/HorizontalDivider';
import { Text } from 'react-native';
import fonts from '../../../../../styles/fonts';
import { calculateAge } from '../../../../../utils/calculateAge';
import CategoryList from '../../../../../components/CategoryList';
import { locationPin } from '../../../../../assets/images';
import { getAddressByLatLong } from '../../../../../redux/getAddressByLatLongSlice';
import DetailItem from '../../../../../components/DetailItem';
import FullScreenLoader from '../../../../../components/FullScreenLoader';
import { setRoute } from '../../../../../redux/appSlice';
import { MAP_API_KEY } from '@env';
import { reverseGeocode } from '../../../../../utils/geoCodeUtils';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const BuddyProfileDetail = ({ navigation }) => {

    const dispatch = useDispatch();
    const { showAlert } = useAlert();
    const { userDetail, loading } = useSelector((state) => state.getUserDetail)
    const { address } = useSelector((state) => state.getAddress)
    const { currentRoute } = useSelector((state) => state.app)
    const { userLoginInfo } = useSelector((state) => state.auth)
    const [placeName, setPlaceName] = useState('')
    const user_id = userLoginInfo?.user?.id
    const [activeIndex, setActiveIndex] = useState(0);




    const handleBackPress = () => {
        if (currentRoute.route === SCREENS.GENERAL_CHAT) {
            resetNavigation(navigation, SCREENS.GENERAL_CHAT)
        }
        else if (currentRoute.route === SCREENS.MY_LIKES_DISLIKES) {
            resetNavigation(navigation, SCREENS.MY_LIKES_DISLIKES)
        }
        else {
            resetNavigation(navigation, SCREENS.MAIN_DASHBOARD, { screen: SCREENS.PROFILE })
        }

        return true;
    };
    useBackHandler(handleBackPress);

    useEffect(() => {
        dispatch(getUserDetail(currentRoute?.chat_id || currentRoute?.user_id || user_id))
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


    const userLocation = userDetail?.location?.country && userDetail?.location?.city
        ? `${userDetail.location.country}, ${userDetail.location.city}`
        : null;

    const addressLocation = (address?.city || address?.town || address?.suburb || address?.country) && address?.country
        ? `${address.city || address.town || address.suburb || address.county || address.state}, ${address.country}`
        : null;

    const renderItem = ({ item, index }) => (
        <View style={[styles.carouselItem]}>
            <Image source={{
                uri: item
            }}
                style={styles.carouselImage}
            />
        </View>
    );

    const renderLoader = () => {
        return <FullScreenLoader
            title={"Please wait..."}
            loading={loading} />
    }

    const handleUpdateProfile = () => {
        dispatch(setRoute({
            route: SCREENS.BUDDY_PROFILE_DETAIL
        }))
        resetNavigation(navigation, SCREENS.UPDATE_BUDDY_PROFILE)
    }

    return (
        <SafeAreaView style={styles.container}>
            <Header
                onPress={() => {
                    handleBackPress();
                }}
                title={currentRoute?.chat_id || currentRoute?.user_id ? "Buddy Detail" : "Profile Details"}
                icon={currentRoute?.chat_id || currentRoute?.user_id ? null : "edit"}
                iconPress={() => {
                    handleUpdateProfile();
                }}
            />

            {loading ? renderLoader() : <ScrollView
                showsVerticalScrollIndicator={false}
                style={{
                    flex: 1,
                }}>


                <View style={{ marginTop: -40 }}>
                    <FlatList
                        data={userDetail?.image_urls}
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
                        {userDetail?.image_urls?.map((_, index) => (
                            <View
                                key={index}
                                style={[
                                    styles.indicator,
                                    index === activeIndex && styles.activeIndicator,
                                ]}
                            />
                        ))}
                    </View>
                </View>


                <View style={{
                    marginHorizontal: 20,
                    marginTop: 10
                }}>

                    <View style={styles.profileDescription}>


                        <Text style={{
                            color: theme.dark.white,
                            fontSize: scaleHeight(22),
                            fontFamily: fonts.fontsType.semiBold,

                        }}>
                            {`${userDetail?.full_name}`}
                        </Text>

                        <View style={{
                            flexDirection: 'row'
                        }}>
                            <Text style={{
                                color: theme.dark.inputLabel,
                                fontSize: scaleHeight(18),
                                fontFamily: fonts.fontsType.regular,

                            }}>
                                {`${calculateAge(userDetail?.dob)} - ${userDetail?.gender} `}
                            </Text>
                        </View>


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

                        <Text style={{
                            color: theme.dark.inputLabel,
                            fontSize: scaleHeight(15),
                            fontFamily: fonts.fontsType.light,
                            lineHeight: scaleHeight(28),
                            marginBottom: scaleHeight(10)
                        }}>
                            {userDetail?.about}
                        </Text>

                    </View>

                    <HorizontalDivider />

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
                            categories={userDetail?.categories}
                            isPress={false}
                        />

                    </View>

                    <View style={{
                        flexDirection: 'row',
                        marginTop: scaleHeight(15),
                        marginHorizontal: -5,
                        marginBottom: scaleHeight(5),
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
                        {/* <Text style={styles.locationText}>{userDetail?.location?.country && userDetail?.location?.city ?
                            `${userDetail?.location?.country}, ${userDetail?.location?.city}` :
                            (address?.city || address?.town) && address?.country ?
                                `${address.city || address.town}, ${address.country}` :
                                'Location not available'
                        }</Text> */}

                    </View>

                    <HorizontalDivider />

                    <DetailItem
                        customDetailContainer={{
                            marginHorizontal: 0
                        }}
                        label="Gender"
                        value={userDetail?.gender} />
                    <DetailItem
                        customDetailContainer={{
                            marginHorizontal: 0
                        }}
                        label="Height"
                        value={`${userDetail?.height_ft}'${userDetail?.height_in}`} />
                    <DetailItem
                        customDetailContainer={{
                            marginHorizontal: 0
                        }}
                        label="Weight"
                        value={`${userDetail?.weight} ${userDetail?.weight_unit}`} />

                    {userDetail?.image_urls?.length > 0 && <View style={{
                        marginBottom: scaleHeight(30)
                    }}>
                        {userDetail?.image_urls?.length > 0 && (
                            <View>
                                <Image
                                    // resizeMode='contain'
                                    style={{
                                        width: '100%',
                                        height: scaleHeight(350),
                                        marginTop: scaleHeight(10),
                                        borderRadius: 10
                                    }}
                                    source={{ uri: userDetail?.image_urls[0] }}
                                />
                            </View>
                        )}

                        {userDetail?.image_urls?.length > 1 && (
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                {userDetail?.image_urls?.slice(1, 3).map((image, index) => (
                                    image && <View key={index}>
                                        <Image
                                            style={{
                                                width: scaleWidth(150),
                                                height: scaleHeight(230),
                                                marginTop: scaleHeight(10),
                                                borderRadius: 10
                                            }}
                                            source={{ uri: image }}
                                        />
                                    </View>
                                ))}
                            </View>
                        )}
                    </View>}

                </View>

            </ScrollView>
            }


        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.dark.primary,
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
        borderRadius: 20,
    },
    carouselImage: {
        width: '90%',
        height: '75%',
        borderRadius: 20,
        alignSelf: 'center'
    },
    activeIndicator: {
        width: 24,
        height: 8,
        borderRadius: 5,
        backgroundColor: theme.dark.secondary,
    },
    dotContainer: {
        // position: 'absolute',
        // top: scaleHeight(390),
        // left: 0,
        // right: 0,
        marginTop: -20,
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
    indicator: {
        width: 8,
        height: 8,
        borderRadius: 5,
        backgroundColor: theme.dark.transparentBg,
        marginHorizontal: 5,
        borderWidth: 1,
        borderColor: theme.dark.secondary
    },
    profileDescription: {
        justifyContent: 'space-between',
        marginBottom: scaleHeight(5)
    },
    locationText: {
        color: theme.dark.white,
        fontFamily: fonts.fontsType.regular,
        fontSize: scaleHeight(17),
        width: '90%',
        alignSelf: 'center',
        // top: 8,
        //  marginBottom: 8,

    },
});

export default BuddyProfileDetail;
