import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { theme } from '../assets';
import { scaleHeight } from '../styles/responsive';
import fonts from '../styles/fonts';
import ArrowIcon from '../assets/svgs/arrow_forward_white.svg';
import HorizontalDivider from './HorizontalDivider';
import * as Animatable from 'react-native-animatable';

const ProfileItemContainer = ({ IconComponent, text, onPress, index }) => {
    return (
        <View
           style={{ marginTop: 12 }}>
            <TouchableOpacity onPress={onPress} style={styles.container}>
                <View style={styles.imageContainer}>
                    <IconComponent width={24} height={24} style={styles.icon} />
                </View>
                <Text style={styles.nameText}>{text}</Text>
                <ArrowIcon style={styles.icon} />
            </TouchableOpacity>
            <HorizontalDivider customStyle={{
                marginVertical: 0
            }} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: theme.dark.primary,
        flexDirection: 'row',
        padding: 6,
    },
    imageContainer: {
        width: 24,
        height: 24,
        overflow: 'hidden',
        justifyContent: 'center',
        alignItems: 'center',
        // alignSelf: 'center'
    },
    nameText: {
        fontFamily: fonts.fontsType.regular,
        fontSize: scaleHeight(17),
        color: theme.dark.white,
        // alignSelf: 'center',
        marginHorizontal: 10,
        flex: 1
    },
    icon: {
        alignSelf: 'center',
    },
});

export default ProfileItemContainer;
