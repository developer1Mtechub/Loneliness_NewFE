//import liraries
import React, { useEffect, useState } from 'react';
import { View, StyleSheet, SafeAreaView, FlatList, ScrollView, RefreshControl, Text } from 'react-native';
import { theme } from '../../../../assets';
import NotificationItem from '../../../../components/NotificationItem';
import Header from '../../../../components/Header';
import { resetNavigation } from '../../../../utils/resetNavigation';
import { SCREENS } from '../../../../constant/constants';
import useBackHandler from '../../../../utils/useBackHandler';
import FullScreenLoader from '../../../../components/FullScreenLoader';
import EmptyListComponent from '../../../../components/EmptyListComponent';
import { scaleHeight, scaleWidth } from '../../../../styles/responsive';
import { useDispatch, useSelector } from 'react-redux';
import { getNotifications } from '../../../../redux/notificationsSlice';
import moment from 'moment';
import fonts from '../../../../styles/fonts';
import HorizontalDivider from '../../../../components/HorizontalDivider';
import { setRoute } from '../../../../redux/appSlice';

const NotificationSection = ({ date, notifications, onPress, index }) => {
    return (
        <View style={styles.sectionContainer}>
            <View style={styles.dateContainer}>
                <Text style={styles.date}>{moment(date).format('MMMM D, YYYY')}</Text>
                <HorizontalDivider customStyle={{ width: '60%' }} />
            </View>
            {notifications.map(notification => (
                <NotificationItem onPress={onPress} key={notification.id} item={notification} index={index} />
            ))}
        </View>
    );
};

const groupNotificationsByDate = (notifications) => {
    return notifications?.reduce((acc, notification) => {
        const date = moment(notification.created_at).format('YYYY-MM-DD');
        if (!acc[date]) {
            acc[date] = [];
        }
        acc[date].push(notification);
        return acc;
    }, {});
};


const Notification = ({ navigation }) => {
    const dispatch = useDispatch();
    const { notifications, loading, currentPage, totalPages } = useSelector((state) => state.notifications);
    const { role } = useSelector((state) => state.auth);
    const [refreshing, setRefreshing] = useState(false);
    const [loader, setLoader] = useState(true);
    const [page, setPage] = useState(1);

    const handleBackPress = () => {
        resetNavigation(navigation, SCREENS.MAIN_DASHBOARD, { screen: SCREENS.HOME })
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
        dispatch(getNotifications({ page, limit: 10 }));
    }, [dispatch, page]);

    const onRefresh = () => {
        setRefreshing(true);
        dispatch(getNotifications({ page: 1, limit: 10 }))
            .then(() => setRefreshing(false))
            .catch(() => setRefreshing(false));
    };


    const handleLoadMore = () => {
        if (currentPage < totalPages && !loading) {
            setPage((prevPage) => prevPage + 1);
        }
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

    const groupedNotifications = groupNotificationsByDate(notifications);

    const handleNotificationPress = (item) => {
        const routePayload = {
            request_id: item[0].request_id,
            route: SCREENS.MAIN_DASHBOARD,
            isNoti: true
        }
        dispatch(setRoute(routePayload))
        if (role === "USER") {
            resetNavigation(navigation, SCREENS.USER_SERVICE_DETAIL)
        } else {
            resetNavigation(navigation, SCREENS.BUDDY_SERVICE_DETAIL)
        }
    }

    const renderSection = ({ item, index }) => (
        <NotificationSection onPress={() => { handleNotificationPress(groupedNotifications[item]) }} date={item} notifications={groupedNotifications[item]} index={index} />
    );

    // const renderItem = ({ item, index }) => (
    //     <NotificationItem item={item} />
    // );

    return (
        <SafeAreaView style={styles.container}>
            <Header
                onPress={() => { handleBackPress(); }}
                title={"Notifications"}
            // icon={"settings"}
            // iconPress={() => {resetNavigation(navigation, SCREENS.NOTIFICATION_SETTING)}}
            />
            {loader && !refreshing ? showLoader() :
                notifications?.length > 0 ? (
                    <FlatList
                        data={Object.keys(groupedNotifications)}
                        renderItem={renderSection}
                        keyExtractor={(item, index) => item?.id + index.toString()}
                        onEndReached={handleLoadMore}
                        onEndReachedThreshold={0.5}
                        showsVerticalScrollIndicator={false}
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
                        <EmptyListComponent title={"No notification yet."} />
                    </ScrollView>
                )
            }
        </SafeAreaView>
    );
};


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.dark.background,
    },
    footerSpinner: {
        width: scaleWidth(120),
        height: scaleHeight(120),
    },
    scrollViewContent: {
        flex: 1,
    },
    list: {
        paddingHorizontal: 20,
    },
    sectionContainer: {
        //marginBottom: 10,
    },
    date: {
        fontSize: scaleHeight(17),
        fontFamily: fonts.fontsType.regular,
        //marginBottom: 10,
        color: theme.dark.white,
        marginHorizontal: scaleWidth(15)
    },
    dateContainer: {
        flexDirection: 'row',
        marginTop: scaleHeight(10)
    }
});

export default Notification;
