import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import BottomTabNavigator from './BottomTabBar';
import { SCREENS } from '../constant/constants';
import { BuddyProfileDetail, BuddySendRequest, BuddyServiceDetails, ChangeLocation, ChangePassword, DeleteAccount, GeneralChat, ImageViewer, MyLikes, MyWallet, NotificationSetting, Notifications, PayPalWebview, PaymentCancellation, PolicyAndTerms, Premium, RateBuddy, Rating, ReportBuddy, SearchServices, SendRequest, ServiceDetails, UpdateBuddyProfile, UpdateInterests, UpdateLanguages, UpdateRate, UpdateUserProfile, UserLikesDetail, UserProfileDetail, UserServiceDetails } from '..'


const Stack = createStackNavigator();

const MainStack = () => {
    return (
        <Stack.Navigator
            screenOptions={{ headerShown: false }}>
            <Stack.Screen name={SCREENS.MAIN_DASHBOARD} component={BottomTabNavigator} />
            <Stack.Screen name={SCREENS.SEND_REQUEST} component={SendRequest} />
            <Stack.Screen name={SCREENS.IMAGE_VIEWER} component={ImageViewer} />
            <Stack.Screen name={SCREENS.RATING} component={Rating} />
            <Stack.Screen name={SCREENS.PREMIUM} component={Premium} />
            <Stack.Screen name={SCREENS.NOTIFICATION} component={Notifications} />
            <Stack.Screen name={SCREENS.NOTIFICATION_SETTING} component={NotificationSetting} />
            <Stack.Screen name={SCREENS.SERVICE_DETAILS} component={ServiceDetails} />
            <Stack.Screen name={SCREENS.BUDDY_SEND_REQUEST} component={BuddySendRequest} />
            <Stack.Screen name={SCREENS.SEARCH_SERVICES} component={SearchServices} />
            <Stack.Screen name={SCREENS.USER_SERVICE_DETAIL} component={UserServiceDetails} />
            <Stack.Screen name={SCREENS.REPORT_BUDDY} component={ReportBuddy} />
            <Stack.Screen name={SCREENS.BUDDY_SERVICE_DETAIL} component={BuddyServiceDetails} />
            <Stack.Screen name={SCREENS.PAYMENT_CANCELLATION} component={PaymentCancellation} />
            <Stack.Screen name={SCREENS.GENERAL_CHAT} component={GeneralChat} />
            <Stack.Screen name={SCREENS.RATE_BUDDY} component={RateBuddy} />
            <Stack.Screen name={SCREENS.MY_WALLET} component={MyWallet} />
            <Stack.Screen name={SCREENS.MY_LIKES} component={MyLikes} />
            <Stack.Screen name={SCREENS.USER_LIKES_DETAIL} component={UserLikesDetail} />
            <Stack.Screen name={SCREENS.BUDDY_PROFILE_DETAIL} component={BuddyProfileDetail} />
            <Stack.Screen name={SCREENS.UPDATE_BUDDY_PROFILE} component={UpdateBuddyProfile} />
            <Stack.Screen name={SCREENS.UPDATE_INTERESTS} component={UpdateInterests} />
            <Stack.Screen name={SCREENS.UPDATE_LANGUAGES} component={UpdateLanguages} />
            <Stack.Screen name={SCREENS.CHANGE_LOCATION} component={ChangeLocation} />
            <Stack.Screen name={SCREENS.CHANGE_PASSWORD} component={ChangePassword} />
            <Stack.Screen name={SCREENS.USER_PROFILE_DETAIL} component={UserProfileDetail} />
            <Stack.Screen name={SCREENS.UPDATE_USER_PROFILE} component={UpdateUserProfile} />
            <Stack.Screen name={SCREENS.POLICY_TERMS} component={PolicyAndTerms} />
            <Stack.Screen name={SCREENS.DELETE_ACCOUNT} component={DeleteAccount} />
            <Stack.Screen name={SCREENS.UPDATE_RATE} component={UpdateRate} />
            <Stack.Screen name={SCREENS.PAYPAL_WEBVIEW} component={PayPalWebview} />
        </Stack.Navigator>
    );
};

export default MainStack;
