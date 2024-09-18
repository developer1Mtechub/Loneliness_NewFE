import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import {
    About,
    AddLocation,
    BirthDate,
    EnableLocation,
    ForgetPassword,
    GenderLooking,
    Login,
    Onboarding,
    PhoneNumber,
    ProfilePicture,
    ResetPassword,
    RoleSelector,
    SelectGender,
    Signup,
    UserName,
    VerifyEmail,
    YourInteresets,
    BuddyAbout,
    BuddyAddLocation,
    BuddyBirthDate,
    BuddyEnableLocation,
    BuddyPhoneNumber,
    BuddyProfilePicture,
    BuddySelectGender,
    BuddySignup,
    BuddyUserName,
    BuddyYourInteresets,
    HeightWeight,
    SelectLanguage,
    Amount,
    StripeAccountCreation
} from '..';
import { SCREENS } from '../constant/constants';

const Stack = createStackNavigator();

const AuthStack = () => {
    return (
        <Stack.Navigator
            screenOptions={{ headerShown: false }}>
            <Stack.Screen name={SCREENS.ONBOARDING} component={Onboarding} />
            <Stack.Screen name={SCREENS.LOGIN} component={Login} />
            <Stack.Screen name={SCREENS.FORGET_PASSWORD} component={ForgetPassword} />
            <Stack.Screen name={SCREENS.VERIFY_EMAIL} component={VerifyEmail} />
            <Stack.Screen name={SCREENS.RESET_PASSWORD} component={ResetPassword} />
            <Stack.Screen name={SCREENS.SIGNUP} component={Signup} />
            <Stack.Screen name={SCREENS.USER_NAME} component={UserName} />
            <Stack.Screen name={SCREENS.PHONE_NUMBER} component={PhoneNumber} />
            <Stack.Screen name={SCREENS.PROFILE_PICTURE} component={ProfilePicture} />
            <Stack.Screen name={SCREENS.ABOUT} component={About} />
            <Stack.Screen name={SCREENS.BIRTH_DATE} component={BirthDate} />
            <Stack.Screen name={SCREENS.GENDER_SELECTION} component={SelectGender} />
            <Stack.Screen name={SCREENS.GENDER_LOOKING} component={GenderLooking} />
            <Stack.Screen name={SCREENS.YOUR_INTERESTS} component={YourInteresets} />
            <Stack.Screen name={SCREENS.ENABLE_LOCATION} component={EnableLocation} />
            <Stack.Screen name={SCREENS.ADD_LOCATION} component={AddLocation} />
            <Stack.Screen name={SCREENS.ROLE_SELECTOR} component={RoleSelector} />

            <Stack.Screen name={SCREENS.BUDDY_SIGNUP} component={BuddySignup} />
            <Stack.Screen name={SCREENS.BUDDY_USER_NAME} component={BuddyUserName} />
            <Stack.Screen name={SCREENS.BUDDY_PHONE_NUMBER} component={BuddyPhoneNumber} />
            <Stack.Screen name={SCREENS.BUDDY_PROFILE_PICTURE} component={BuddyProfilePicture} />
            <Stack.Screen name={SCREENS.BUDDY_ABOUT} component={BuddyAbout} />
            <Stack.Screen name={SCREENS.BUDDY_BIRTH_DATE} component={BuddyBirthDate} />
            <Stack.Screen name={SCREENS.BUDDY_GENDER_SELECTION} component={BuddySelectGender} />
            <Stack.Screen name={SCREENS.BUDDY_YOUR_INTERESTS} component={BuddyYourInteresets} />
            <Stack.Screen name={SCREENS.BUDDY_ENABLE_LOCATION} component={BuddyEnableLocation} />
            <Stack.Screen name={SCREENS.BUDDY_ADD_LOCATION} component={BuddyAddLocation} />
            <Stack.Screen name={SCREENS.HEIGHT_WEIGHT} component={HeightWeight} />
            <Stack.Screen name={SCREENS.SELECT_LANGUAGE} component={SelectLanguage} />
            <Stack.Screen name={SCREENS.AMOUNT} component={Amount} />
            <Stack.Screen name={SCREENS.STRIPE_ACCOUNT_CREATION} component={StripeAccountCreation} />
        </Stack.Navigator>
    );
}

export default AuthStack;