import React, { useEffect, useState } from 'react';
import { View, FlatList, StyleSheet, SafeAreaView, ScrollView, Image, RefreshControl } from 'react-native';
import { Text } from 'react-native-elements';
import fonts from '../../../../styles/fonts';
import { Rating } from 'react-native-ratings';
import { resetNavigation } from '../../../../utils/resetNavigation';
import useBackHandler from '../../../../utils/useBackHandler';
import { SCREENS } from '../../../../constant/constants';
import { theme } from '../../../../assets';
import RatingListItem from '../../../../components/RatingListItem'
import ProfileProgressBar from '../../../../components/ProfileProgressBar';
import Header from '../../../../components/Header';
import { scaleHeight, scaleWidth } from '../../../../styles/responsive';
import { StarRatingDisplay } from 'react-native-star-rating-widget';
import CustomStarIcon from '../../../../components/CustomStarIcon';
import { useDispatch, useSelector } from 'react-redux';
import { getAllRating } from '../../../../redux/UserDashboard/getRatingSlice';
import FullScreenLoader from '../../../../components/FullScreenLoader';
import EmptyListComponent from '../../../../components/EmptyListComponent';
import { current } from '@reduxjs/toolkit';
import { setRoute } from '../../../../redux/appSlice';


const MyReviewScreen = ({ navigation }) => {
    const dispatch = useDispatch();
    const { ratings, loading, currentPage, totalPages, avg_rating } = useSelector((state) => state.getRating);
    const { currentRoute } = useSelector((state) => state.app);
    const [page, setPage] = useState(1);
    const [refreshing, setRefreshing] = useState(false);
    const [loader, setLoader] = useState(true);

    const handleBackPress = () => {
        if (currentRoute?.route === SCREENS.MAIN_DASHBOARD) {
            resetNavigation(navigation, SCREENS.MAIN_DASHBOARD, { screen: SCREENS.HOME })
        } else if (currentRoute?.route === SCREENS.PROFILE) {
            resetNavigation(navigation, SCREENS.MAIN_DASHBOARD, { screen: SCREENS.PROFILE })
        }
        else {
            dispatch(setRoute({
                ...currentRoute,
                route: SCREENS.MAIN_DASHBOARD
            }))
            resetNavigation(navigation, currentRoute?.route, { screen: SCREENS.HOME })
        }

        return true;
    };
    useBackHandler(handleBackPress);

    useEffect(() => {
        const timer = setTimeout(() => {
            setLoader(false);
        }, 3000);

        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        dispatch(getAllRating({
            page,
            limit: 10,
            buddy_id: currentRoute?.buddy_id
        }))
    }, [dispatch, page, currentRoute])


    const handleLoadMore = () => {
        if (currentPage < totalPages && !loading) {
            setPage((prevPage) => prevPage + 1);
        }
    };

    const onRefresh = () => {
        setRefreshing(true);
        setPage(1);
        dispatch(getAllRating({
            page,
            limit: 10,
            buddy_id: currentRoute?.buddy_id
        })).then(() => setRefreshing(false))
            .catch(() => setRefreshing(false));

    };

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

    return (
        <SafeAreaView style={styles.container}>

            <Header
                onPress={() => {
                    handleBackPress()
                }}
                title={"Ratings"}
                customTextStyle={styles.headerText} />

            {

                loader && !refreshing ? showLoader() :

                    ratings?.length > 0 ? <ScrollView style={styles.scrollView}>

                        <View style={styles.ratingContainer}>
                            <Text style={styles.avgRating}>
                                {parseInt(avg_rating).toFixed(1)}
                            </Text>

                            <View style={styles.starRating}>
                                <StarRatingDisplay
                                    disabled={true}
                                    rating={avg_rating}
                                    maxStars={5}
                                    color={theme.dark.secondary}
                                    starSize={28}
                                    StarIconComponent={(props) => <CustomStarIcon {...props} />}
                                />
                            </View>

                            <Text style={styles.overallRatings}>
                                {"Overall Ratings"}
                            </Text>

                        </View>
                        <View style={styles.listContainer}>
                            <FlatList
                                showsVerticalScrollIndicator={false}
                                data={ratings}
                                renderItem={({ item }) => (
                                    <RatingListItem
                                        profilePic={item?.image_url}
                                        name={item?.full_name}
                                        rating={item?.stars}
                                        comment={item?.comment}

                                    />
                                )}
                                onEndReached={handleLoadMore}
                                onEndReachedThreshold={0.5}
                                keyExtractor={(item, index) => item + index}
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
                        </View>
                    </ScrollView> :
                        (
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
                                <EmptyListComponent title={"Rating not avaibale."} />
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
        fontFamily: fonts.fontsType.semiBold,
        marginStart: scaleWidth(95),
    },
    scrollView: {
        flex: 1,
    },
    ratingContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20,
    },
    avgRating: {
        fontFamily: fonts.fontsType.bold,
        fontSize: 41,
        color: theme.dark.white,
    },
    starRating: {
        flex: 1,
        marginTop: 10,
    },
    overallRatings: {
        fontFamily: fonts.fontsType.medium,
        fontSize: 16,
        color: theme.dark.inputLabel,
        marginTop: 15,
    },
    listContainer: {
        flex: 1,
        paddingHorizontal: 20,
        paddingTop: 20,
    },
    emptyList: {
        flex: 1,
    },
    footerSpinner: {
        width: scaleWidth(120),
        height: scaleHeight(120),
    },
    scrollViewContent: {
        flex: 1,
    },
});

export default MyReviewScreen;
