import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign'; // Adjust the icon library as needed
import { scaleHeight } from '../styles/responsive';
import fonts from '../styles/fonts';
import { theme } from '../assets';

const PremiumItem = ({ iconName, iconColor, text, textStyle }) => {
    return (
        <View style={styles.container}>
            <Icon name={iconName} size={21} color={iconColor} style={styles.icon} />
            <Text style={[styles.text, textStyle]}>{text}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop:scaleHeight(20),
        width:'90%'
    },
    icon: {
        marginRight: 10,
    },
    text: {
        fontSize: scaleHeight(15),
        fontFamily: fonts.fontsType.regular,
        color: theme.dark.white
    },
});

export default PremiumItem;
