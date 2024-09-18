import React, { Component, useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, FlatList, RefreshControl, ScrollView, TouchableOpacity } from 'react-native';
import RequestListItem from '../../../../components/RequestListItem';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { scaleHeight, scaleWidth } from '../../../../styles/responsive';
import fonts from '../../../../styles/fonts';
import { theme } from '../../../../assets';
import ServicesListItem from '../../../../components/ServicesListItem';
import ButtonGroup from '../../../../components/ButtonGroup';
import { useDispatch, useSelector } from 'react-redux';
import { getAllServiceRequests } from '../../../../redux/UserDashboard/getAllServiceRequestsSlice';
import FullScreenLoader from '../../../../components/FullScreenLoader';
import EmptyListComponent from '../../../../components/EmptyListComponent';
import Skeleton from '../../../../components/Skeleton';
import SkeletonLoader from '../../../../components/SkeletonLoader';
import RBSheet from 'react-native-raw-bottom-sheet';
import { CrossWhite } from '../../../../assets/svgs';
import HorizontalDivider from '../../../../components/HorizontalDivider';
import Button from '../../../../components/ButtonComponent';
import { releasePayment } from '../../../../redux/UserDashboard/releasePaymentSlice';
import { useAlert } from '../../../../providers/AlertContext';
import CustomModal from '../../../../components/CustomModal';
import { warningImg } from '../../../../assets/images';
import { setRoute } from '../../../../redux/appSlice';
import { SCREENS } from '../../../../constant/constants';
import { resetNavigation } from '../../../../utils/resetNavigation';

const filterOptions = [
    { label: "Accepted Requests", value: "ACCEPTED" },
    { label: "Rejected Requests", value: "REJECTED" },
    { label: "Pending Requests", value: "REQUESTED" },
    { label: "Buddy's Requests", value: "REQUEST_BACK" },
];

const UserServicesContent = ({ setCurrentIndex, initialIndex = 0, isFilter, setFilter, setIsFilterApllied, searchQuery }) => {
    const dispatch = useDispatch();
    const { showAlert } = useAlert();
    const { serviceRequests, loading, currentPage, totalPages } = useSelector((state) => state.getAllServiceRequests);
    const { loading: paymentLoading } = useSelector((state) => state.releasePayment);
    const { lastIndex } = useSelector((state) => state.setLastIndex);
    const [selectedIndex, setSelectedIndex] = useState(initialIndex);
    const [page, setPage] = useState(1);
    const [refreshing, setRefreshing] = useState(false);
    const [selectedOption, setSelectedOption] = useState(null);
    const [relesePaymentModal, setReleasePaymentModal] = useState(false);
    const [releasePaymentDetail, setReleasePaymentDetail] = useState(null);
    const [loader, setLoader] = useState(true);
    const navigation = useNavigation();
    const buttons = ['Upcoming', 'Requested', 'Completed'];
    const refRBSheet = useRef();


    const handleSelectedChange = (button, index) => {
        setLoader(true)
        setSelectedIndex(index)
        setCurrentIndex(index)
        setPage(1);
    };

    const getStatusByIndex = (index) => {
        switch (index) {
            case 0:
                return 'ACCEPTED';
            // return 'PAID';
            case 1:
                return '';
            case 2:
                return 'COMPLETED';
            default:
                return '';
        }
    };

    const selectedStatus = getStatusByIndex(selectedIndex);


    useEffect(() => {
        const timer = setTimeout(() => {
            setLoader(false);
        }, 1000);

        return () => clearTimeout(timer);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedIndex]);

    useEffect(() => {
        dispatch(getAllServiceRequests({ page, limit: 10, status: selectedStatus }))
    }, [dispatch, page, selectedStatus])


    useFocusEffect(
        React.useCallback(() => {
            setSelectedIndex(lastIndex)
        }, [lastIndex])
    );

    const onRefresh = () => {
        setRefreshing(true);
        setPage(1); // Reset to first page
        dispatch(getAllServiceRequests({ page: 1, limit: 10, status: selectedStatus }))
            .then(() => setRefreshing(false))
            .catch(() => setRefreshing(false));
    };

    const handleLoadMore = () => {
        if (currentPage < totalPages && !loading) {
            setPage((prevPage) => prevPage + 1)
        }
    };

    const applyFilter = () => {
        setIsFilterApllied(true)
        handleSheetClose();
        dispatch(getAllServiceRequests({ page: 1, limit: 10, status: selectedOption }))
    }

    const resetFilter = () => {
        handleSheetClose();
        setSelectedOption(null)
        setIsFilterApllied(false)
        dispatch(getAllServiceRequests({ page: 1, limit: 10, status: selectedStatus }))
    }

    // Function to filter service requests based on search query
    const filterServiceRequests = (requests, query) => {
        if (!query) return requests;
        return requests?.filter(request => request?.buddy?.full_name.toLowerCase().includes(query.toLowerCase()));
    };

    const handleRelaseOpenModal = (item) => {
        setReleasePaymentDetail(item)
        setReleasePaymentModal(true);
    };

    const handleRelaseCloseModal = () => {
        setReleasePaymentModal(false);
    };


    const handleReleasePayment = (item) => {

        const releasePaymentPayload = {
            buddy_id: item?.buddy_id,
            request_id: item?.id
        }
        dispatch(releasePayment(releasePaymentPayload)).then((result) => {

            if (result?.payload?.status === "success") {
                showAlert("Success", "success", result?.payload?.message);
                handleRelaseCloseModal();
                setTimeout(() => {
                    dispatch(getAllServiceRequests({ page, limit: 10, status: selectedStatus }))
                }, 3000);

            } else if (result?.payload?.status === "error") {
                handleRelaseCloseModal();
                setTimeout(() => {
                    showAlert("Error", "error", result?.payload?.message)
                }, 1000);
            }
        })
    }

    const handleCancelPayment = (item) => {
        handleRelaseCloseModal();
        dispatch(setRoute({
            route: SCREENS.SERVICES,
            request_id: item?.id,
        }))
        resetNavigation(navigation, SCREENS.PAYMENT_CANCELLATION);

    }

    const renderItem = ({ item }) => (
        <ServicesListItem
            item={item}
            navigation={navigation}
            index={selectedIndex}
            upComingPaymentPress={() => {
                handleRelaseOpenModal(item)
            }}
        />
    );

    const showLoader = () => {
        return <FullScreenLoader loading={loader} />
    }

    // const showLoader = () => {
    //     return <SkeletonLoader />
    // }


    const handleSheetClose = () => {
        refRBSheet.current.close()
        setFilter(false)
    };

    useEffect(() => {
        if (isFilter) {
            refRBSheet.current.open()
        }
    }, [isFilter])

    const renderSheet = () => {
        return (
            <RBSheet
                ref={refRBSheet}
                openDuration={1000}
                customStyles={{
                    wrapper: styles.wrapper,
                    container: [styles.sheetContainer, { backgroundColor: theme.dark.background }]
                }}
            >
                <View style={styles.header}>
                    <Text style={styles.sheetHeaderText}>{"Apply Filter"}</Text>
                    <TouchableOpacity onPress={handleSheetClose} style={styles.closeButton}>
                        <CrossWhite />
                    </TouchableOpacity>
                </View>

                <View style={styles.content}>

                    {filterOptions.map((option, index) => (
                        <View>
                            <TouchableOpacity
                                style={[styles.sheetButton, { backgroundColor: selectedOption === option.value ? theme.dark.secondary : 'transparent', }]}
                                key={index}
                                onPress={() => setSelectedOption(option.value)}>
                                <Text style={[styles.textStyle, { color: selectedOption === option.value ? theme.dark.black : theme.dark.heading, }]}>
                                    {option.label}
                                </Text>
                            </TouchableOpacity>
                            {index < filterOptions.length - 1 && <HorizontalDivider />}
                        </View>
                    ))}

                    <View style={{ flexDirection: 'row', marginTop: scaleHeight(10), }}>
                        <Button
                            title={"Reset"}
                            onPress={() => { resetFilter() }}
                            isBgTransparent={true}
                            customStyle={{
                                width: '48%',
                                marginHorizontal: '2%',
                                backgroundColor: theme.dark.transparentBg,
                                borderWidth: 1,
                                borderColor: theme.dark.secondary,
                                marginBottom: scaleHeight(0)
                            }}
                            textCustomStyle={{
                                color: theme.dark.secondary,
                                fontFamily: fonts.fontsType.bold,
                                fontSize: scaleHeight(12),
                            }}
                        />

                        <Button
                            title={"Apply"}
                            onPress={() => { applyFilter() }}
                            customStyle={{
                                width: '48%',
                                marginBottom: scaleHeight(0)
                            }}
                            textCustomStyle={{
                                fontFamily: fonts.fontsType.bold,
                                fontSize: scaleHeight(13),
                            }}
                        />
                    </View>

                </View>
            </RBSheet>
        );
    };

    const renderReleasePaymentModal = () => {
        return <CustomModal
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
                handleCancelPayment(releasePaymentDetail);
            }}
            parallelButtonPress2={() => {
                handleReleasePayment(releasePaymentDetail);
            }}
        />
    }

    const filteredServiceRequests = filterServiceRequests(serviceRequests, searchQuery);

    const showFooterSpinner = () => {
        return <FullScreenLoader
            spinnerStyle={styles.footerSpinner}
            loading={loading} />;
    };

    return (

        <SafeAreaView style={styles.container}>

            <View style={{
                flex: 1,
                padding: 16,
                marginBottom: scaleHeight(70)
            }}>
                <ButtonGroup
                    onSelectedChange={handleSelectedChange}
                    buttons={buttons}
                    selectedIndex={selectedIndex}
                />
                {
                    loader && !refreshing ? showLoader() : filteredServiceRequests?.length > 0 ? <View>

                        <FlatList
                            data={filteredServiceRequests}
                            renderItem={renderItem}
                            keyExtractor={(item, index) => item + index}
                            onEndReached={handleLoadMore}
                            onEndReachedThreshold={0.5}
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

                    </View> :
                        (
                            <ScrollView
                                contentContainerStyle={{ flex: 1 }}
                                refreshControl={
                                    <RefreshControl
                                        refreshing={refreshing}
                                        onRefresh={onRefresh}
                                        colors={[theme.dark.primary]}
                                        progressBackgroundColor={theme.dark.secondary}
                                    />
                                }
                            >
                                <EmptyListComponent title={"No requests yet."} />
                            </ScrollView>
                        )
                }
            </View>
            {renderSheet()}
            {renderReleasePaymentModal()}
        </SafeAreaView>
    );
};


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.dark.primary
    },
    wrapper: {
        backgroundColor: 'rgba(128, 128, 128, 0.80)',
    },
    sheetContainer: {
        borderTopEndRadius: 30,
        borderTopStartRadius: 30,
        width: '100%',
        alignSelf: 'center',
        height: '43%'
    },
    header: {
        flexDirection: 'row',

    },
    sheetHeaderText: {
        fontFamily: fonts.fontsType.medium,
        color: theme.dark.white,
        fontSize: scaleHeight(20),
        alignSelf: 'center',
        textAlign: 'center',
        flex: 1

    },
    closeButton: {
        alignSelf: 'center'
    },
    content: {
        paddingHorizontal: 20,
        marginTop: 20
    },
    sheetButton: {
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 4,
    },
    textStyle: {
        fontFamily: fonts.fontsType.regular,
        fontSize: scaleHeight(16),

    },
    footerSpinner: {
        width: scaleWidth(120),
        height: scaleHeight(120),
    },
});

export default UserServicesContent;
