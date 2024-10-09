import React, { Component, useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, FlatList, RefreshControl, ScrollView, TouchableOpacity, Image } from 'react-native';
import EmptyListComponent from '../../../../../components/EmptyListComponent';
import { useDispatch, useSelector } from 'react-redux';
import { theme } from '../../../../../assets';
import { scaleHeight, scaleWidth } from '../../../../../styles/responsive';
import { getUserLikeDislike } from '../../../../../redux/UserDashboard/getUserLikeDislikeSlice';
import fonts from '../../../../../styles/fonts';
import LinearGradient from 'react-native-linear-gradient';
import ButtonGroup from '../../../../../components/ButtonGroup';
import FullScreenLoader from '../../../../../components/FullScreenLoader';
import * as Animatable from 'react-native-animatable';
import { calculateAge } from '../../../../../utils/calculateAge';
import moment from 'moment';
import { resetNavigation } from '../../../../../utils/resetNavigation';
import useBackHandler from '../../../../../utils/useBackHandler';
import Header from '../../../../../components/Header';
import { SCREENS } from '../../../../../constant/constants';
import { setRoute } from '../../../../../redux/appSlice';

const MyLikesDislikes = ({ navigation }) => {
    const dispatch = useDispatch();
    const { likeDislikes, loading, currentPage, totalPages } = useSelector((state) => state.getUserLikeDislike)
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [page, setPage] = useState(1);
    const [headerTitle, setHeaderTitle] = useState("My Likes");
    const [refreshing, setRefreshing] = useState(false);
    const [endpoint, setEndpoint] = useState('get-likes');
    const buttons = ['Likes', 'Dislikes'];

    const handleSelectedChange = (button, index) => {
        if (index === 0) {
            setEndpoint("get-likes")
            setHeaderTitle("My Likes")
        } else {
            setEndpoint("get-dislikes")
            setHeaderTitle("My Dislikes")
        }
        setSelectedIndex(index)
        setPage(1);
    };

    const handleBackPress = () => {
        resetNavigation(navigation, SCREENS.MAIN_DASHBOARD, { screen: SCREENS.PROFILE });
        return true;
    };
    useBackHandler(handleBackPress);

    useEffect(() => {
        dispatch(getUserLikeDislike({ page, limit: 10, endpoint: endpoint }))
    }, [dispatch, page, endpoint])


    const onRefresh = () => {
        setRefreshing(true);
        setPage(1); // Reset to first page
        dispatch(getUserLikeDislike({ page: 1, limit: 10, endpoint: endpoint }))
            .then(() => setRefreshing(false))
            .catch(() => setRefreshing(false));
    };

    const handleLoadMore = () => {
        if (currentPage < totalPages && !loading) {
            setPage((prevPage) => prevPage + 1)
        }
    };

    const handleBuddyProfileDetail = (userId) => {
        const updatedRoute = {
            route: SCREENS.MY_LIKES_DISLIKES,
            user_id: userId
        };

        dispatch(setRoute(updatedRoute));
        resetNavigation(navigation, SCREENS.BUDDY_PROFILE_DETAIL);

    };

    const showLoader = () => {
        return <FullScreenLoader loading={loading} />
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
                handleBuddyProfileDetail(item?.id)
            }}>
                <Image source={{ uri: item?.images[0]?.image_url }} style={styles.image} />
                <LinearGradient
                    colors={['transparent', 'rgba(0, 0, 0, 0.7)']}
                    locations={[0, 1]}
                    style={styles.gradient}
                >
                    <Text style={styles.name}>{`${item?.full_name?.split(" ")[0]} (${calculateAge(moment(item?.dob).format("YYYY-MM-DD"))})`}</Text>
                </LinearGradient>
            </TouchableOpacity>
        </Animatable.View>
    );

    return (

        <SafeAreaView style={styles.container}>

            <Header
                onPress={handleBackPress}
                title={headerTitle}
                customTextStyle={styles.headerText} />

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
                    loading && page == 1 && !refreshing ? showLoader() : likeDislikes?.length > 0 ? <View>

                        <FlatList
                            data={likeDislikes}
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
    list: {
        justifyContent: 'space-between',
        // paddingHorizontal: 20
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
    headerText: {
        marginStart: '24%',
    },
});

export default MyLikesDislikes;
