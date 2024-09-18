import React, { Component } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { noDataFound } from '../assets/images';
import { theme } from '../assets';
import { scaleHeight, scaleWidth } from '../styles/responsive';
import fonts from '../styles/fonts';

const EmptyListComponent = ({ title, isImage = true, customTitleStyle }) => {
    return (
        <View style={[styles.container,]}>
            {isImage && <Image style={styles.imageStyle} source={noDataFound} />}
            <Text style={[styles.titleStyle,customTitleStyle]}>{title}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: theme.dark.primary,
    },
    titleStyle: {
        fontSize: scaleHeight(18),
        fontFamily: fonts.fontsType.semiBold,
        color: theme.dark.secondary,
        top: 15
    },
    imageStyle: {
        width: scaleWidth(200),
        height: scaleHeight(160)
    }
});

export default EmptyListComponent;
