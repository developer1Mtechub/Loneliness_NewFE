// MyLikes.js
import React, { useEffect, useState } from 'react';
import { View, Text, Image, FlatList, StyleSheet, SafeAreaView, TouchableOpacity, RefreshControl, ScrollView } from 'react-native';
import * as Animatable from 'react-native-animatable';
import { scaleHeight, scaleWidth } from '../../../../../styles/responsive';
import { theme } from '../../../../../assets';
import fonts from '../../../../../styles/fonts';
import LinearGradient from 'react-native-linear-gradient';
import Header from '../../../../../components/Header';
import { resetNavigation } from '../../../../../utils/resetNavigation';
import useBackHandler from '../../../../../utils/useBackHandler';
import { SCREENS } from '../../../../../constant/constants';
import { HeartIcon } from '../../../../../assets/svgs';
import { useDispatch, useSelector } from 'react-redux';
import { getLikes } from '../../../../../redux/BuddyDashboard/getLikesSlice';
import FullScreenLoader from '../../../../../components/FullScreenLoader';
import EmptyListComponent from '../../../../../components/EmptyListComponent';
import { calculateAge } from '../../../../../utils/calculateAge';
import moment from 'moment';
import { setRoute } from '../../../../../redux/appSlice';
import Geolocation from '@react-native-community/geolocation';

const MyLikes = ({ navigation }) => {
    const dispatch = useDispatch();
    const { likes, loading, currentPage, totalPages, totalCount } = useSelector((state) => state.getLikes);
    const [page, setPage] = useState(1);
    const [allLikes, setAllLikes] = useState(4530);
    const [refreshing, setRefreshing] = useState(false);
    const [loader, setLoader] = useState(true);
    const [latLong, setLatlong] = useState({
        latitude: 0,
        longitude: 0,
    });


    const handleBackPress = () => {
        resetNavigation(navigation, SCREENS.MAIN_DASHBOARD, { screen: SCREENS.PROFILE });
        return true;
    };
    useBackHandler(handleBackPress);

    const getLatLong = async () => {
        const getPosition = () => new Promise((resolve, reject) => {
            Geolocation.getCurrentPosition(resolve, reject);
        });
        const { coords: { latitude, longitude } } = await getPosition();
        setLatlong({ ...latLong, latitude, longitude })
    }

    useEffect(() => {
        getLatLong()
        const timer = setTimeout(() => {
            setLoader(false);
        }, 3000);

        return () => clearTimeout(timer);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        dispatch(getLikes({ page, limit: 10, latLong }));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dispatch, page]);

    const onRefresh = () => {
        setRefreshing(true);
        setPage(1); // Reset to first page
        dispatch(getLikes({ page, limit: 10, latLong }))
            .then(() => setRefreshing(false))
            .catch(() => setRefreshing(false));
    };

    const convertMetersToKm = (meters) => {
        return (meters / 1000).toFixed(1);
    };

    const handleLoadMore = () => {
        if (currentPage < totalPages && !loading) {
            setPage((prevPage) => prevPage + 1);
        }
    };

    const handleNavigation = (user_id) => {
        dispatch(setRoute({
            user_id,
            route: SCREENS.MY_LIKES
        }))
        resetNavigation(navigation, SCREENS.USER_LIKES_DETAIL)
    }

    const showLoader = () => {
        return <FullScreenLoader
            title={"Please wait..."}
            loading={loader} />;
    };

    const showFooterSpinner = () => {
        return <FullScreenLoader
            spinnerStyle={styles.footerSpinner}
            loading={loading} />;
    };

    const renderItem = ({ item, index }) => (
        item?.id != null && <Animatable.View
            animation={'flipInX'}
            duration={1200}
            delay={index} style={styles.itemContainer}>
            <TouchableOpacity onPress={() => {
                handleNavigation(item?.id)
            }}>
                <Image source={{ uri: item?.images[0]?.image_url }} style={styles.image} />
                <LinearGradient
                    colors={['transparent', 'rgba(0, 0, 0, 0.7)']}
                    locations={[0, 1]}
                    style={styles.gradient}
                >
                    <Text style={styles.name}>{`${item?.full_name?.split(" ")[0]} (${calculateAge(moment(item?.dob).format("YYYY-MM-DD"))})`}</Text>
                    <Text style={styles.distance}>{`${convertMetersToKm(item?.distance != null ? item?.distance : 0)} km`}</Text>
                </LinearGradient>
            </TouchableOpacity>
        </Animatable.View>
    );

    return (
        <SafeAreaView style={styles.container}>
            <Header
                onPress={handleBackPress}
                title={"My Likes"}
                customTextStyle={styles.headerText} />
            <View style={styles.contentContainer}>

                <View style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                    <Animatable.View
                        animation="pulse"
                        easing="ease-out"
                        iterationCount="infinite"
                    >
                        <HeartIcon
                            width={scaleWidth(40)}
                            height={scaleHeight(40)} />
                    </Animatable.View>
                    <Text
                        style={styles.likeCount}>
                        {totalCount.toLocaleString()}
                    </Text>
                </View>
                <Text style={styles.overallLikes}>Overall Likes</Text>
            </View>



            {loader && !refreshing ? showLoader() :
                likes?.length > 0 ? (
                    <FlatList
                        data={likes}
                        renderItem={renderItem}
                        keyExtractor={(item, index) => item + index}
                        onEndReached={handleLoadMore}
                        onEndReachedThreshold={0.5}
                        showsVerticalScrollIndicator={false}
                        numColumns={2}
                        contentContainerStyle={styles.list}
                        ListFooterComponent={loading && !refreshing && showFooterSpinner}
                        refreshControl={
                            <RefreshControl
                                refreshing={refreshing}
                                onRefresh={onRefresh}
                                colors={[theme.dark.primary]}
                                progressBackgroundColor={theme.dark.secondary}
                            />
                        }
                    />
                ) : (
                    <ScrollView
                        contentContainerStyle={styles.scrollViewContent}
                        refreshControl={
                            <RefreshControl
                                refreshing={refreshing}
                                onRefresh={onRefresh}
                                colors={[theme.dark.primary]}
                                progressBackgroundColor={theme.dark.secondary}
                            />
                        }
                    >
                        <EmptyListComponent title={"Likes not avaibale."} />
                    </ScrollView>
                )
            }


        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.dark.primary,

    },
    headerText: {
        marginStart: '24%',
    },
    contentContainer: {
        paddingHorizontal: 20,
    },
    likeCount: {
        fontFamily: fonts.fontsType.bold,
        fontSize: scaleHeight(34),
        color: theme.dark.white,
        textAlign: 'center',
        alignSelf: 'center',
        left: 8
    },
    overallLikes: {
        fontFamily: fonts.fontsType.medium,
        fontSize: scaleHeight(16),
        color: theme.dark.inputLabel,
        textAlign: 'center',
        marginBottom: 20,
        alignSelf: 'center'
    },
    list: {
        justifyContent: 'space-between',
        paddingHorizontal: 20
    },
    itemContainer: {
        width: scaleWidth(160),
        height: scaleHeight(206),
        flex: 1,
        margin: 10,
        backgroundColor: '#2a2a2a',
        borderRadius: 16,
    },
    image: {
        width: '100%',
        height: '100%',
        borderRadius: 16,
        alignSelf: 'center'
    },
    name: {
        fontFamily: fonts.fontsType.semiBold,
        fontSize: scaleHeight(19),
        color: theme.dark.white,
        marginTop: 10,
        position: 'absolute',
        bottom: 30,
        left: 10
    },
    distance: {
        fontFamily: fonts.fontsType.medium,
        fontSize: scaleHeight(14),
        color: theme.dark.white,
        position: 'absolute',
        bottom: 10,
        left: 10
    },
    gradient: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: '30%', // Adjust height as needed
        justifyContent: 'flex-end',
        padding: 10,
        borderRadius: 16,
    },
    footerSpinner: {
        width: scaleWidth(120),
        height: scaleHeight(120),
    },
    scrollViewContent: {
        flex: 1,
    },
});

export default MyLikes;
