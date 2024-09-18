import React, { } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AuthStack from './AuthStack';
import MainStack from './MainStack';
import { useSelector } from 'react-redux';
import { navigationRef } from '../utils/navigationRef';

const Root = () => {
    const { token } = useSelector((state) => state.auth);
    return (
        <NavigationContainer ref={navigationRef}>

            {token ? <MainStack /> : <AuthStack />}

        </NavigationContainer>
    );
};


export default Root;
