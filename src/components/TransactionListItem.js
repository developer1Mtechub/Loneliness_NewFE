import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { theme } from '../assets';
import { scaleHeight, scaleWidth } from '../styles/responsive';
import {  subscriptionImg } from '../assets/images';
import fonts from '../styles/fonts';
import moment from 'moment';
import { useSelector } from 'react-redux';


const TransactionListItem = ({ item, index }) => {
    const { role } = useSelector((state) => state.auth)
    const imageUrl = item?.type === "SUBSCRIPTION" ? subscriptionImg : { uri: item?.images[0]?.image_url }
    const userName = item?.type === "SUBSCRIPTION" ? "Subscription" : item?.full_name
    console.log(userName)
    return (
        <View style={styles.container}>
            <View style={styles.imageContainer}>
                <Image
                    resizeMode='cover'
                    style={styles.image}
                    source={imageUrl}
                />
            </View>
            <View style={styles.textContainer}>
                <Text style={styles.genderText}>{moment(item?.created_at).format('dddd, hh:mm A')}</Text>
                <Text style={[styles.nameText]}>{userName}</Text>
            </View>
            <Text style={[styles.nameText, {
                alignSelf: 'center',
                marginEnd: 10,
                fontSize: scaleHeight(15),
            }]}>{`$${role === "BUDDY" ? parseFloat(item?.amount) - parseFloat(item?.admin_fee) : item?.amount}`}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: theme.dark.inputBg,
        flexDirection: 'row',
        borderRadius: 10,
        padding: 6,
        marginTop: 10,
        borderColor: theme.dark.inputLabel,
        borderWidth: 1
    },
    imageContainer: {
        width: 50,
        height: 50,
        borderRadius: (50 / 2),
        overflow: 'hidden',
        justifyContent: 'center',
        alignItems: 'center',
    },
    image: {
        width: 50,
        height: 50,
        borderRadius: (50 / 2),
    },
    textContainer: {
        marginHorizontal: 10,
        marginTop: 5,
        flex: 1,
    },
    nameText: {
        fontFamily: fonts.fontsType.semiBold,
        fontSize: scaleHeight(17),
        color: theme.dark.white,
    },
    genderText: {
        fontFamily: fonts.fontsType.medium,
        fontSize: scaleHeight(13),
        color: theme.dark.inputLabel,
    },
    icon: {
        alignSelf: 'center',
    },
});

export default TransactionListItem;
