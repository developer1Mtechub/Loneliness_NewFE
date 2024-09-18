import React from 'react';
import { View, Image, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { scaleHeight, scaleWidth } from '../styles/responsive';
import fonts from '../styles/fonts';
import { theme } from '../assets';
import { filterHome, filterHomeOff } from '../assets/images';
import { useSelector } from 'react-redux';

const CustomHeader = ({
    homeLogo,
    title = 'Services',
    searchIcon,
    onSearchPress,
    onFilterPress,
    containerStyle,
    imageStyle,
    textStyle,
    searchButtonStyle,
    searchIconStyle,
    hideFilterButton,
    isFilterApplied
}) => {
    const { role } = useSelector((state) => state.auth)
    return (
        <View style={[styles.container, containerStyle]}>
            <Image resizeMode='contain' source={homeLogo} style={[styles.homeLogo, imageStyle]} />
            <Text style={[styles.title, textStyle]}>{title}</Text>
            <TouchableOpacity style={[styles.searchButton, searchButtonStyle]} onPress={onSearchPress}>
                <Image source={searchIcon} style={[styles.searchIcon, searchIconStyle]} />
            </TouchableOpacity>

            {hideFilterButton && role === "USER" && <TouchableOpacity style={[styles.searchButton, searchButtonStyle]} onPress={onFilterPress}>
                <Image source={isFilterApplied ? filterHome : filterHomeOff} style={[styles.searchIcon, searchIconStyle]} />
            </TouchableOpacity>}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginTop: scaleHeight(10),
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    homeLogo: {
        width: scaleWidth(35),
        height: scaleHeight(45),
        alignSelf: 'center',
        marginHorizontal: scaleWidth(20)
    },
    title: {
        alignSelf: 'center',
        fontFamily: fonts.fontsType.semiBold,
        fontSize: scaleHeight(24),
        color: theme.dark.secondary,
        marginHorizontal: scaleWidth(50),
        flex: 1
    },
    searchButton: {
        justifyContent: 'center',
    },
    searchIcon: {
        width: scaleWidth(20),
        height: scaleHeight(20),
        alignSelf: 'center',
        marginEnd: scaleWidth(20)
    },
});

export default CustomHeader;
