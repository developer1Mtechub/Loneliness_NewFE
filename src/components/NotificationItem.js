// NotificationComponent.js

import React from 'react';
import { View, Image, Text, StyleSheet, TouchableOpacity } from 'react-native';
import fonts from '../styles/fonts';
import { scaleHeight } from '../styles/responsive';
import { theme } from '../assets';
import { notiImg, notiImg2, notiImg3, notiImg4 } from '../assets/images';
import moment from 'moment';
import { ArrowForward } from '../assets/svgs';

const NotificationItem = ({ item, onPress, index }) => {
    const images = [notiImg, notiImg2, notiImg3, notiImg4];
    // const randomImage = images[Math.floor(Math.random() * images.length)];
    const selectedImage = index < 3 ? images[index] : images[3];
    return (
        <TouchableOpacity
            onPress={onPress}
            style={styles.container}>
            <Image source={selectedImage} style={styles.image} />
            <View style={styles.notificationContent}>
                <Text style={styles.title}>{item?.title}</Text>
                <Text style={styles.description}>{item?.body}</Text>
                <Text style={styles.time}>{moment(item?.created_at).format('hh:mm A')}</Text>
            </View>
            <ArrowForward />
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        // padding: 10,
        // borderBottomWidth: 1,
        // borderBottomColor: '#ccc',
    },
    image: {
        width: 45,
        height: 45,
        borderRadius: 25,
        marginRight: 10,
    },
    notificationContent: {
        flex: 1,
    },
    title: {
        fontSize: scaleHeight(16),
        fontFamily: fonts.fontsType.medium,
        marginBottom: 5,
        color: theme.dark.white,
        marginTop: scaleHeight(20)
    },
    description: {
        fontSize: scaleHeight(14),
        fontFamily: fonts.fontsType.regular,
        marginBottom: 5,
        color: theme.dark.heading,
    },
    time: {
        fontFamily: fonts.fontsType.light,
        fontSize: scaleHeight(12),
        color: theme.dark.heading,
        marginBottom: 10
    },
    arrow: {
        width: 20,
        height: 20,
        tintColor: '#999',
    },
});

export default NotificationItem;
