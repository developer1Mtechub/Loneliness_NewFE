import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { theme } from '../assets';
import { scaleHeight, scaleWidth } from '../styles/responsive';
import fonts from '../styles/fonts';
import Icon from '../assets/svgs/arrow_forward.svg';

const ProfileHeader = ({ customHeaderStyle, onPress, image_url, full_name, gender }) => {
    return (
        <TouchableOpacity
            onPress={onPress}
            style={[styles.container, customHeaderStyle]}>
            <View style={styles.imageContainer}>
                <Image
                    //resizeMode='contain'
                    style={styles.image}
                    source={{ uri: image_url }}
                />
            </View>
            <View style={styles.textContainer}>
                <Text style={styles.nameText}>{full_name}</Text>
                <Text style={styles.genderText}>{gender}</Text>
            </View>
            <Icon style={styles.icon} />
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: theme.dark.secondary,
        flexDirection: 'row',
        borderRadius: 12,
        padding: 6,
    },
    imageContainer: {
        width: 55,
        height: 55,
        borderWidth: 2,
        borderColor: theme.dark.white,
        borderRadius: (55 / 2),
        overflow: 'hidden',
        justifyContent: 'center',
        alignItems: 'center',
    },
    image: {
        width: 55,
        height: 55,
        borderRadius: (55 / 2),
    },
    textContainer: {
        marginHorizontal: 10,
        marginTop: 5,
        flex: 1,
    },
    nameText: {
        fontFamily: fonts.fontsType.semiBold,
        fontSize: scaleHeight(16),
        color: theme.dark.primary,
    },
    genderText: {
        fontFamily: fonts.fontsType.regular,
        fontSize: scaleHeight(13),
        color: theme.dark.labelColor,
    },
    icon: {
        alignSelf: 'center',
    },
});

export default ProfileHeader;
