import React, { Component, useEffect, useState } from 'react';
import { View, FlatList, StyleSheet, SafeAreaView } from 'react-native';
import { theme } from '../../../assets';
import ProfileHeader from '../../../components/ProfileHeader';
import { homeLogo, warningImg } from '../../../assets/images';
import CustomHeader from '../../../components/CustomHeader';
import ProfileItemContainer from '../../../components/ProfileItemContainer';
import WalletIcon from '../../../assets/svgs/wallet_icon.svg'
import PremiumIcon from '../../../assets/svgs/premium_icon.svg';
import ProfileIcon from '../../../assets/svgs/profile_icon.svg';
import PasswordIcon from '../../../assets/svgs/password_icon.svg';
import RateAppIcon from '../../../assets/svgs/rate_app_icon.svg';
import ShareAppIcon from '../../../assets/svgs/share_app_icon.svg';
import PrivacyPolicyIcon from '../../../assets/svgs/privacy_policy_icon.svg';
import TermsConditionsIcon from '../../../assets/svgs/terms_conditions_icon.svg';
import LogoutIcon from '../../../assets/svgs/logout_icon.svg';
import DeleteAccountIcon from '../../../assets/svgs/delete_account_icon.svg';
import { resetNavigation } from '../../../utils/resetNavigation';
import { SCREENS } from '../../../constant/constants';
import { HeartIcon, UpdateBuddyProfile, UpdateInterests, UpdateRate } from '../../../assets/svgs';
import { useDispatch, useSelector } from 'react-redux';
import { getUserDetail } from '../../../redux/BuddyDashboard/userLikesDetailSlice';
import { setRoute } from '../../../redux/appSlice';
import CustomModal from '../../../components/CustomModal';
import { logout } from '../../../redux/AuthModule/signInSlice';
import { setCurrentUserIndex } from '../../../redux/currentUserIndexSlice';
import { setLastIndex } from '../../../redux/setIndexesSlice';
import { setIsAppOpened } from '../../../redux/appOpenedSlice';
import { clearState } from '../../../redux/AuthModule/signupSlice';


const userList = [
    { id: '1', icon: WalletIcon, text: 'My Wallet', route: SCREENS.MY_WALLET, isRoute: false },
    { id: '2', icon: PremiumIcon, text: 'Go Premium', route: SCREENS.PREMIUM, isRoute: true },
    { id: '3', icon: ProfileIcon, text: 'Update Profile', route: SCREENS.UPDATE_USER_PROFILE, isRoute: true },
    { id: '4', icon: PasswordIcon, text: 'Change Password', route: SCREENS.CHANGE_PASSWORD, isRoute: false },
    { id: '5', icon: RateAppIcon, text: 'Rate App', isRoute: false },
    { id: '6', icon: ShareAppIcon, text: 'Share App', isRoute: false },
    { id: '7', icon: PrivacyPolicyIcon, text: 'Privacy Policy', route: SCREENS.POLICY_TERMS, isRoute: true },
    { id: '8', icon: TermsConditionsIcon, text: 'Terms & Conditions', route: SCREENS.POLICY_TERMS, isRoute: true },
    { id: '9', icon: LogoutIcon, text: 'Logout', isRoute: false },
    { id: '10', icon: DeleteAccountIcon, text: 'Delete Account', route: SCREENS.DELETE_ACCOUNT, isRoute: false },
];

const buddyList = [
    { id: '1', icon: WalletIcon, text: 'My Wallet', route: SCREENS.MY_WALLET, isRoute: false },
    { id: '2', icon: HeartIcon, text: 'My Likes', route: SCREENS.MY_LIKES, isRoute: false },
    { id: '3', icon: RateAppIcon, text: 'My Ratings', route: SCREENS.RATING, isRoute: true },
    { id: '4', icon: UpdateRate, text: 'Update Rate', route: SCREENS.UPDATE_RATE, isRoute: false },
    { id: '5', icon: UpdateInterests, text: 'Update Interests', route: SCREENS.UPDATE_INTERESTS, isRoute: true },
    { id: '6', icon: UpdateBuddyProfile, text: 'Update Profile', route: SCREENS.UPDATE_BUDDY_PROFILE, isRoute: true },
    { id: '4', icon: PasswordIcon, text: 'Change Password', route: SCREENS.CHANGE_PASSWORD, isRoute: false },
    { id: '7', icon: RateAppIcon, text: 'Rate App', isRoute: false },
    { id: '8', icon: ShareAppIcon, text: 'Share App', isRoute: false },
    { id: '9', icon: PrivacyPolicyIcon, text: 'Privacy Policy', route: SCREENS.POLICY_TERMS, isRoute: true },
    { id: '10', icon: TermsConditionsIcon, text: 'Terms & Conditions', route: SCREENS.POLICY_TERMS, isRoute: true },
    { id: '11', icon: LogoutIcon, text: 'Logout', isRoute: false },
    { id: '12', icon: DeleteAccountIcon, text: 'Delete Account', route: SCREENS.DELETE_ACCOUNT, isRoute: false },
];



const Profile = ({ navigation }) => {
    const dispatch = useDispatch();
    const { userDetail, loading } = useSelector((state) => state.getUserDetail)
    const { role, userLoginInfo } = useSelector((state) => state.auth);
    const profileList = role === "USER" ? userList : buddyList
    const profileNav = role === "USER" ? SCREENS.USER_PROFILE_DETAIL : SCREENS.BUDDY_PROFILE_DETAIL;
    const user_id = userLoginInfo?.user?.id
    const [modalVisible, setModalVisible] = useState(false);

    useEffect(() => {
        dispatch(getUserDetail(user_id));
    }, [dispatch, user_id])


    const handleNavigation = (route, isRoute, text) => {
        const type = text === "Privacy Policy" ? "privacy" : "terms"
        if (text === "Logout") {
            handleOpenModal();
            return
        }
        if (isRoute) {
            dispatch(setRoute({
                route: text === "My Ratings" ? SCREENS.PROFILE : SCREENS.MAIN_DASHBOARD,
                type: type,
                isProfilePremium: true,
                ...(role === "BUDDY" && text === "My Ratings" && { buddy_id: user_id }),
                ...(role === "BUDDY" && text === "Update Interests" && { categories: userDetail?.categories })
            }))
        }
        resetNavigation(navigation, route)
    }

    const handleOpenModal = () => {
        setModalVisible(true);
    };

    const handleCloseModal = () => {
        setModalVisible(false);
    };

    const handleLogout = () => {
        dispatch(logout());
        dispatch(clearState());
        dispatch(setCurrentUserIndex(null));
        dispatch(setLastIndex(0));
        dispatch(setIsAppOpened(false))
        handleCloseModal();
    }


    const renderItem = ({ item, index }) => (
        <ProfileItemContainer
            onPress={() => { handleNavigation(item?.route, item?.isRoute, item?.text) }}
            IconComponent={item.icon}
            text={item.text}
            index={index}
        />
    );

    return (
        <SafeAreaView style={styles.container}>
            <CustomHeader
                homeLogo={homeLogo}
                title="Profile"
            />

            <View style={{
                flex: 1,
                paddingHorizontal: 25
            }}>
                <ProfileHeader
                    onPress={() => {
                        resetNavigation(navigation, profileNav)
                    }}
                    image_url={userDetail?.image_urls && userDetail?.image_urls[0]}
                    full_name={userDetail?.full_name && userDetail?.full_name}
                    gender={userDetail?.gender && userDetail?.gender}
                    customHeaderStyle={{
                        marginTop: 20,
                        marginBottom: 10
                    }} />
                <FlatList
                    data={profileList}
                    renderItem={renderItem}
                    keyExtractor={(item, index) => item + index}
                    showsVerticalScrollIndicator={false}
                />
            </View>

            <CustomModal
                isVisible={modalVisible}
                onClose={handleCloseModal}
                headerTitle={"Logout?"}
                imageSource={warningImg}
                isParallelButton={true}
                text={`Do you really want to log out and leave the fun behind? 🤔🎉`}
                parallelButtonText1={"Cancel"}
                parallelButtonText2={"Yes, Logout"}
                parallelButtonPress1={() => {
                    handleCloseModal()
                }}
                parallelButtonPress2={() => {
                    handleLogout()
                }}
            />

        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.dark.primary
    },
});


export default Profile;
