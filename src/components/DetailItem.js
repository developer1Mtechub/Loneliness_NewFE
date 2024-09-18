import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { scaleHeight } from '../styles/responsive';
import fonts from '../styles/fonts';
import { theme } from '../assets';

const DetailItem = ({ label, value, customTextStyle, customDetailContainer }) => (
    <View style={[styles.detailItem, customDetailContainer]}>
        <Text style={styles.detailLabel}>{label}</Text>
        {value !== undefined && value !== null && (
            <Text style={[styles.detailValue, customTextStyle]}>{value}</Text>
        )}
    </View>
);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#2c3e50',
    },
    detailItem: {
        flexDirection: 'row',
        // justifyContent: 'space-between',
        marginVertical: 4,
        // marginHorizontal: 10
    },
    detailLabel: {
        fontSize: scaleHeight(16),
        fontWeight: fonts.fontsType.medium,
        color: theme.dark.white,
        flex: 1
    },
    detailValue: {
        fontSize: scaleHeight(15),
        fontWeight: fonts.fontsType.regular,
        color: theme.dark.inputLabel,
        flexShrink: 1,
        maxWidth: '70%',
    },
});

export default DetailItem;
