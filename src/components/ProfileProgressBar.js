import React from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { resetNavigation } from '../utils/resetNavigation';
import { theme } from '../assets';
import Icon from 'react-native-vector-icons/MaterialIcons'
import { scaleHeight, scaleWidth } from '../styles/responsive';
import fonts from '../styles/fonts';

const ProfileProgressBar = ({ progress, onPress, title }) => {
    return (
        <View style={styles.container}>
            <View style={styles.arrowContainer}>
                {/* <View style={styles.arrow}></View> */}

                <TouchableOpacity
                    onPress={onPress}
                    style={styles.backButton}>
                    <Icon name={'arrow-back'} size={28} color={theme.dark.secondary} />

                </TouchableOpacity>

            </View>

            {title ? <Text style={styles.titleStyle}>{title}</Text> : <View style={styles.progressBar}>
                <View style={[styles.progress, { width: `${progress}%` }]}></View>
            </View>}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '75%', // Adjust this to your requirement
        marginTop: 30,
        marginHorizontal: scaleWidth(10)
    },
    arrowContainer: {
        marginRight: 5, // Adjust the space between the arrow and progress bar
    },
    arrow: {
        width: 0,
        height: 0,
        borderLeftWidth: 5,
        borderRightWidth: 5,
        borderBottomWidth: 10,
        borderLeftColor: 'transparent',
        borderRightColor: 'transparent',
        borderBottomColor: theme.dark.secondary, // Change this to the color you want
    },
    progressBar: {
        flex: 1,
        height: 10,
        backgroundColor: '#444', // Background color of the progress bar
        borderRadius: 5,
        overflow: 'hidden',
        marginHorizontal: 15
    },
    progress: {
        height: '100%',
        backgroundColor: theme.dark.secondary, // Progress bar color
    },
    backButton: {
        paddingHorizontal: 8,
    },
    titleStyle: {
        fontFamily: fonts.fontsType.semiBold,
        color: theme.dark.secondary,
        fontSize: scaleHeight(18),
        marginHorizontal:scaleWidth(30)
    }
});

export default ProfileProgressBar;
