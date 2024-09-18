import React from 'react';
import { TouchableOpacity, Image, View, Text, StyleSheet } from 'react-native';
import { useDispatch } from 'react-redux';
import { setWarningContent } from '../redux/warningModalSlice';
import { normalizeFontSize, scaleHeight, scaleWidth } from '../styles/responsive';
import fonts from '../styles/fonts';
import { theme } from '../assets';
import { warningImg } from '../assets/images';

const WarningBanner = ({
    message = "All interactions between Buddies and Users must occur within the app. Direct communication or transactions outside the platform are strictly prohibited.",
    imageSource,
    seeMoreText = 'See more',
    containerStyle = {},
    imageStyle = {},
    messageStyle = {},
    seeMoreStyle = {}
}) => {
    const dispatch = useDispatch();

    return (
        <TouchableOpacity
            onPress={() => {
                dispatch(setWarningContent(true));
            }}
            style={[styles.container, containerStyle]}>
            <Image
                resizeMode='contain'
                style={[styles.image, imageStyle]}
                source={warningImg}
            />
            <View style={styles.textContainer}>
                <Text
                    numberOfLines={2}
                    ellipsizeMode='tail'
                    style={[styles.message, messageStyle]}>
                    {message}
                </Text>
                <TouchableOpacity
                    onPress={() => {
                        dispatch(setWarningContent(true));
                    }}
                >
                    <Text style={[styles.seeMore, seeMoreStyle]}>
                        {seeMoreText}
                    </Text>
                </TouchableOpacity>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'rgba(252, 226, 32, 0.2)',
        marginHorizontal: 20,
        padding: 8,
        borderRadius: 8,
        marginTop: 20,
        marginBottom: 10,
        flexDirection: 'row',
    },
    image: {
        width: scaleWidth(30),
        height: scaleHeight(30),
    },
    textContainer: {
        flex: 1,
    },
    message: {
        fontFamily: fonts.fontsType.regular,
        fontSize: normalizeFontSize(12),
        color: theme.dark.white,
        marginHorizontal: scaleWidth(5),
    },
    seeMore: {
        fontFamily: fonts.fontsType.medium,
        fontSize: normalizeFontSize(14),
        alignSelf: 'flex-end',
        color: theme.dark.success,
    }
});

export default WarningBanner;
