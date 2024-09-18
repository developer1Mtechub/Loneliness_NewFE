import React, { useEffect, useState } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import CustomBottomTabBar from '../components/CustomBottomTabBar';
import { chatIcon, homeIcon, profileIcon, servicesIcon } from '../assets/images';
import { SCREENS } from '../constant/constants';
import {
    Chat,
    Home,
    Profile,
    Services
} from '..';
import { Keyboard } from 'react-native';

const Tab = createBottomTabNavigator();

const BottomTabNavigator = () => {

    const icons = [homeIcon, servicesIcon, chatIcon, profileIcon];
    const [isKeyboardVisible, setKeyboardVisible] = useState(false);

    useEffect(() => {
        const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => {
            setKeyboardVisible(true);
        });

        const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
            setKeyboardVisible(false);
        });

        return () => {
            keyboardDidShowListener.remove();
            keyboardDidHideListener.remove();
        };
    }, []);


    return (
        <Tab.Navigator
            screenOptions={{
                tabBarHideOnKeyboard: true,
            }}
            tabBar={(props) => !isKeyboardVisible ? <CustomBottomTabBar {...props} icons={icons} /> : null}>
            <Tab.Screen name={SCREENS.HOME}
                component={Home}
                options={{
                    headerShown: false,
                    title: "Home",
                }} />
            <Tab.Screen name={SCREENS.SERVICES} component={Services}
                options={{
                    headerShown: false,
                    title: "Services",
                }} />
            <Tab.Screen name={SCREENS.CHAT} component={Chat}
                options={{
                    headerShown: false,
                    title: "Chat",
                }} />
            <Tab.Screen name={SCREENS.PROFILE} component={Profile}
                options={{
                    headerShown: false,
                    title: "Profile",
                }} />
        </Tab.Navigator>
    );
};

export default BottomTabNavigator;
