import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native';
import { Icon } from 'react-native-elements';
import HorizontalDivider from '../../../../../components/HorizontalDivider';
import { useDispatch, useSelector } from 'react-redux';
import { resetNavigation } from '../../../../../utils/resetNavigation';
import { SCREENS } from '../../../../../constant/constants';
import useBackHandler from '../../../../../utils/useBackHandler';
import FullScreenLoader from '../../../../../components/FullScreenLoader';
import Header from '../../../../../components/Header';
import { scaleHeight } from '../../../../../styles/responsive';
import { blockUser, dummyImg } from '../../../../../assets/images';
import Button from '../../../../../components/ButtonComponent';
import { theme } from '../../../../../assets';
import fonts from '../../../../../styles/fonts';
import { useAlert } from '../../../../../providers/AlertContext';
import CategoryList from '../../../../../components/CategoryList';
import DetailItem from '../../../../../components/DetailItem';
import { getAddressByLatLong } from '../../../../../redux/getAddressByLatLongSlice';
import { getUserDetail } from '../../../../../redux/BuddyDashboard/userLikesDetailSlice';
import CustomModal from '../../../../../components/CustomModal';
import { userBuddyAction } from '../../../../../redux/userBuddyActionSlice';
import { setRoute } from '../../../../../redux/appSlice';

const UserLikesDetail = ({ navigation }) => {
    const dispatch = useDispatch();
    const { showAlert } = useAlert();
    const { userDetail, loading } = useSelector((state) => state.getUserDetail)
    const { address } = useSelector((state) => state.getAddress)
    const { currentRoute } = useSelector((state) => state.app)
    const [modalVisible, setModalVisible] = useState(false);

    console.log(currentRoute)

    const handleBackPress = () => {
        resetNavigation(navigation, currentRoute.route)
        return true;
    };
    useBackHandler(handleBackPress);

    useEffect(() => {
        dispatch(getUserDetail(currentRoute?.user_id))
    }, [dispatch, currentRoute])


    useEffect(() => {
        if (userDetail) {
            const { longitude, latitude } = userDetail?.location
            dispatch(getAddressByLatLong({
                lat: latitude,
                long: longitude
            }));
        }

    }, [dispatch, userDetail])

    function calculateAge(birthdate) {
        const today = new Date();
        const birthDate = new Date(birthdate);
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDifference = today.getMonth() - birthDate.getMonth();
        if (
            monthDifference < 0 ||
            (monthDifference === 0 && today.getDate() < birthDate.getDate())
        ) {
            age--;
        }

        return age;
    }

    const handleOpenModal = () => {
        setModalVisible(true);
    };

    const handleCloseModal = () => {
        setModalVisible(false);
    };

    const handleBlockUser = () => {
        dispatch(userBuddyAction({
            user_id: userDetail?.id,
            type: "BLOCK"
        })).then((result) => {
            if (result?.payload?.status === "success") {
                handleCloseModal();
                showAlert("Success", "success", result?.payload?.message);
                setTimeout(() => {
                    handleBackPress();
                }, 3000);
            } else if (result?.payload?.status === "error") {
                showAlert("Error", "error", result?.payload?.message)
            }
        })
    }


    const handleReportBuddy = () => {

        dispatch(setRoute({
            route: SCREENS.USER_LIKES_DETAIL,
            user_id: userDetail?.id,
            buddy_name: userDetail?.full_name
        }))
        resetNavigation(navigation, SCREENS.REPORT_BUDDY)
    }

    const renderLoader = () => {
        return <FullScreenLoader
            title={"Please wait..."}
            loading={loading} />
    }
    const renderBlockModal = () => {
        return <CustomModal
            isVisible={modalVisible}
            //loading={blockUserLoader}
            onClose={handleCloseModal}
            headerTitle={"Block User?"}
            imageSource={blockUser}
            isParallelButton={true}
            text={`Are you sure you want to Block ${userDetail?.full_name}?`}
            parallelButtonText1={"Cancel"}
            parallelButtonText2={"Yes, Block"}
            parallelButtonPress1={() => {
                handleCloseModal()
            }}
            parallelButtonPress2={() => {
                handleBlockUser();
            }}
        />
    }

    return (
        <SafeAreaView style={styles.mianContainer}>
            <Header
                onPress={() => {
                    handleBackPress();
                }}
                title={"User Details"}
            />
            <HorizontalDivider customStyle={{
                marginTop: scaleHeight(10)
            }} />

            {loading ? renderLoader() : <ScrollView style={{ flex: 1 }}>

                <View style={styles.container}>

                    <View style={styles.profileSection}>
                        <View style={styles.profileView}>
                            <Image
                                style={styles.profileImage}
                                source={{ uri: userDetail?.image_urls[0] }}
                            />
                        </View>
                        <View style={styles.profileInfo}>
                            <Text style={styles.profileName}>{`${userDetail?.full_name} (${calculateAge(userDetail?.dob)})`}</Text>
                            <Text style={styles.profileGender}>{userDetail?.gender}</Text>
                        </View>
                    </View>

                    <HorizontalDivider />

                    <View style={styles.categorySection}>
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
                        }}>
                            {userDetail?.about}
                        </Text>

                    </View>

                    <HorizontalDivider customStyle={{
                        marginTop: scaleHeight(10)
                    }} />

                    <View style={styles.locationSection}>
                        <Icon style={{
                            top: 8,
                            marginBottom: 8,
                            alignSelf: 'center'
                        }} name="location-on" type="material" color={theme.dark.secondary} />
                        <Text style={styles.locationText}>{userDetail?.location?.country && userDetail?.location?.city ?
                            `${userDetail?.location?.country}, ${userDetail?.location?.city}` :
                            (address?.city || address?.town) && address?.country ?
                                `${address.city || address.town}, ${address.country}` :
                                'Location not available'
                        }</Text>
                    </View>
                    <HorizontalDivider customStyle={{
                        marginTop: scaleHeight(18)
                    }} />

                    <View style={styles.categorySection}>
                        <DetailItem
                            label="Looking for"
                            value={userDetail?.looking_for_gender}
                            customDetailContainer={{
                                marginVertical: 6,
                                marginHorizontal: 0
                            }}
                        />
                    </View>
                    <HorizontalDivider customStyle={{
                        marginTop: scaleHeight(5)
                    }} />

                    <View style={styles.categorySection}>
                        <Text style={{
                            color: theme.dark.secondary,
                            fontSize: scaleHeight(19),
                            fontFamily: fonts.fontsType.medium,

                        }}>
                            Category
                        </Text>

                        <CategoryList
                            categories={userDetail?.categories}
                            isPress={false}
                        />

                    </View>

                </View>
            </ScrollView>}
         {  !loading && <View style={styles.buttonSection}>


                <View style={{
                    flexDirection: 'row',
                }}>

                    <Button
                        onPress={() => {
                            handleReportBuddy();
                        }}
                        title={"Report"}
                        customStyle={{
                            width: '40%',
                            borderWidth: 1,
                            borderColor: theme.dark.secondary,
                            backgroundColor: theme.dark.transparentBg,
                            // marginHorizontal: '4%',
                        }}
                        textCustomStyle={{
                            color: theme.dark.secondary,

                        }}
                    />

                    <Button
                        onPress={() => {
                            handleOpenModal();
                        }}
                        title={"Block"}
                        customStyle={{
                            width: '40%',
                            borderWidth: 1,
                            borderColor: theme.dark.secondary,
                            backgroundColor: theme.dark.transparentBg,
                            marginHorizontal: '2%',
                        }}
                        textCustomStyle={{
                            color: theme.dark.secondary,

                        }}
                    />

                </View>
            </View>}
            {renderBlockModal()}
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

export default UserLikesDetail;
