import React from 'react';
import { Keyboard, Platform, ScrollView, StyleSheet, TouchableWithoutFeedback, View } from 'react-native';
import { theme } from '../assets';

const CustomLayout = ({ children, customStyle }) => {
    return (
        <View style={[styles.container, customStyle]}>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <ScrollView 
                    style={{ backgroundColor: theme.dark.transparentBg }}
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps='handled'>
                    {children}
                </ScrollView>
            </TouchableWithoutFeedback>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.dark.transparentBg,
    }
});

export default CustomLayout;
