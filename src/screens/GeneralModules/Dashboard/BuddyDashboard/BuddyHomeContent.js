import React, { Component, useEffect, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, FlatList, RefreshControl, ScrollView } from 'react-native';
import { theme } from '../../../../assets';
import RequestListItem from '../../../../components/RequestListItem';
import { useNavigation } from '@react-navigation/native';
import { scaleHeight, scaleWidth } from '../../../../styles/responsive';
import fonts from '../../../../styles/fonts';
import { useDispatch, useSelector } from 'react-redux';
import { getAllBuddyRequest } from '../../../../redux/BuddyDashboard/getAllBuddyRequestSlice';
import EmptyListComponent from '../../../../components/EmptyListComponent';
import FullScreenLoader from '../../../../components/FullScreenLoader';
import SkeletonLoader from '../../../../components/SkeletonLoader';

const BuddyHomeContent = () => {
    const dispatch = useDispatch();
    const { requests, loading, error, currentPage, totalPages } = useSelector((state) => state.getAllBuddyRequest);
    const [page, setPage] = useState(1);
    const navigation = useNavigation();
    const [loader, setLoader] = useState(true);
    //const [refreshing, setRefreshing] = useState(false);
    const [requestData, setRequestData] = useState([]);

    useEffect(() => {
        const timer = setTimeout(() => {
            setLoader(false);
        }, 500);

        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        dispatch(getAllBuddyRequest({ page, limit: 10 }));
        //setRequestData(requests)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dispatch, page]);

    useEffect(() => {
        setRequestData(requests);
    }, [requests]);

    const handleLoadMore = () => {
        if (currentPage < totalPages && !loading) {
            setPage((prevPage) => prevPage + 1);
        }
    };

    const onRefresh = () => {
       // setLoader(true);
        setPage(1);
        dispatch(getAllBuddyRequest({ page: 1, limit: 10 }))
            .then(() => setLoader(false))
            .catch(() => setLoader(false));
    };

    const updateRequestStatus = (updatedRequestId, newStatus) => {
        const updatedRequests = requestData?.map(request =>
            request.id === updatedRequestId ? { ...request, status: newStatus } : request
        );
        setRequestData(updatedRequests);
    };

    const renderItem = ({ item, index }) => (
        <RequestListItem
            item={item}
            navigation={navigation}
            onRequestStatusChange={updateRequestStatus}
            index={index}
        />
    );

    // if (loader && !refreshing) {
    //     <SkeletonLoader />
    //     // return <FullScreenLoader
    //     //     title={"Please wait fetching requests..."}
    //     //     loading={loader} />
    // }

    //console.log('requestData', requestData)

    const showLoader = () => {
        return <FullScreenLoader loading={loader} />
    }

    const showFooterSpinner = () => {
        return <FullScreenLoader
            spinnerStyle={styles.footerSpinner}
            loading={loading} />;
    };

    return (
        <SafeAreaView style={styles.container}>

            <View style={{
                padding: 16,
                flex: 1
            }}>
                <Text style={{
                    fontFamily: fonts.fontsType.semiBold,
                    fontSize: scaleHeight(18),
                    color: theme.dark.white,
                    marginHorizontal: 16
                }}>Service Requests</Text>
                {
                    loader ? showLoader() : requestData?.length > 0 ? <View style={{
                        marginBottom: 20
                    }}>

                        <FlatList
                            data={requestData}
                            renderItem={renderItem}
                            keyExtractor={(item, index) => item + index}
                            onEndReached={handleLoadMore}
                            onEndReachedThreshold={1}
                            ListFooterComponent={loading && !loader && showFooterSpinner}
                            refreshControl={
                                <RefreshControl
                                    refreshing={loader}
                                    onRefresh={onRefresh}
                                    colors={[theme.dark.primary]}
                                    progressBackgroundColor={theme.dark.secondary}
                                />
                            }
                        />

                    </View> :
                        (
                            <ScrollView
                                contentContainerStyle={{ flex: 1 }}
                                refreshControl={
                                    <RefreshControl
                                        refreshing={loader}
                                        onRefresh={onRefresh}
                                        colors={[theme.dark.primary]}
                                        progressBackgroundColor={theme.dark.secondary}
                                    />
                                }
                            >
                                <EmptyListComponent title={"No Requests Yet."} />
                            </ScrollView>
                        )
                }
            </View>

        </SafeAreaView>
    );
};


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.dark.primary
    },
    footerSpinner: {
        width: scaleWidth(120),
        height: scaleHeight(120),
    },
});

export default BuddyHomeContent;
