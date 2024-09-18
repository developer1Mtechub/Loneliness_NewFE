import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { Rating } from 'react-native-ratings';
import fonts from '../styles/fonts';
import { theme } from '../assets';
import { scaleWidth } from '../styles/responsive';
import { stars } from '../assets/images';
import { StarRatingDisplay } from 'react-native-star-rating-widget';
import CustomStarIcon from './CustomStarIcon';

const ReviewListItem = ({ profilePic, name, rating, comment }) => {

    const [showFullDescription, setShowFullDescription] = useState(false);
    const toggleDescription = () => {
        setShowFullDescription(!showFullDescription);
    };

    return (
        <View style={styles.mainContainer}>
            <View style={styles.container}>
                <Image source={{ uri: profilePic }} style={styles.profilePic} />
                <View style={styles.detailsContainer}>
                    <Text style={styles.name}>{name}</Text>

                    <View style={{
                        //marginTop: 10,
                        //marginLeft:-20
                    }}>
                        <StarRatingDisplay
                            disabled={true}
                            rating={parseInt(rating)}
                            maxStars={5}
                            color={theme.dark.secondary}
                            starSize={20}
                            StarIconComponent={(props) => <CustomStarIcon {...props} />}
                        />
                    </View>

                </View>

            </View>

            <Text style={styles.comment}>{comment}</Text>

            {/* <Text style={styles.comment}>{
                showFullDescription
                    ? comment
                    : `${(comment?.length > 70 ? comment?.slice(0, 70)
                        : comment)}...`
            }</Text> */}
            {/* {(
                comment?.length > 70 && <TouchableOpacity onPress={toggleDescription}>
                    <Text
                        style={{
                            color: theme.dark.secondary,
                            fontFamily: fonts.fontsType.medium,
                            fontSize: 15,
                            alignSelf: 'flex-end',
                        }}>
                        {!showFullDescription ? 'See More' : 'See Less'}
                    </Text>
                </TouchableOpacity>
            )} */}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
    },
    mainContainer: {
        backgroundColor: theme.dark.inputBg,
        borderWidth: 1,
        borderRadius: 10,
        padding: 10,
        marginVertical: 5,
        borderColor: theme.dark.inputLabel,
        marginBottom: 10

    },
    profilePic: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginRight: 10,
    },
    detailsContainer: {
        //alignItems: 'center'
    },
    name: {
        fontSize: 16,
        fontFamily: fonts.fontsType.semiBold,
        marginBottom: 5,
        // marginTop: 10,
        color: theme.dark.white,
        marginHorizontal: 8
        //marginLeft: -25
    },
    comment: {
        fontSize: 14,
        marginTop: 15,
        color: theme.dark.inputLabel,
        fontFamily: fonts.fontsType.regular,
    },
});

export default ReviewListItem;
