//import liraries
import React, { Component, useEffect, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ImageBackground } from 'react-native';
import { theme } from '../../../../assets';
import { resetNavigation } from '../../../../utils/resetNavigation';
import useBackHandler from '../../../../utils/useBackHandler';
import Header from '../../../../components/Header';
import { SCREENS } from '../../../../constant/constants';
import { curveBg, dummyImg } from '../../../../assets/images';
import { Image } from 'react-native';
import { scaleHeight, scaleWidth } from '../../../../styles/responsive';
import StarRating from 'react-native-star-rating-widget';
import CustomStarIcon from '../../../../components/CustomStarIcon';
import fonts from '../../../../styles/fonts';
import CustomTextInput from '../../../../components/TextInputComponent';
import Button from '../../../../components/ButtonComponent';
import CustomLayout from '../../../../components/CustomLayout';
import { useDispatch, useSelector } from 'react-redux';
import { rateToBuddy } from '../../../../redux/UserDashboard/rateToBuddySlice';
import { useAlert } from '../../../../providers/AlertContext';
import { setRoute } from '../../../../redux/appSlice';

const RateBuddy = ({ navigation }) => {
    const dispatch = useDispatch();
    const { loading } = useSelector((state) => state.rateToBuddy)
    const { currentRoute } = useSelector((state) => state.app)
    const { showAlert } = useAlert();
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');


    const handleBackPress = () => {
        resetNavigation(navigation, currentRoute?.route)
        dispatch(setRoute({
            route: SCREENS.MAIN_DASHBOARD,
            buddy_id: currentRoute?.buddy_id,
            request_id: currentRoute?.request_id
        }))
        return true;
    };
    useBackHandler(handleBackPress);

    useEffect(() => {
        if (!currentRoute?.addRate) {
            setComment(currentRoute?.comment);
            setRating(currentRoute?.stars);
        }
    }, [currentRoute])


    const handleRateBuddy = () => {
        const payload = {
            request_id: currentRoute?.request_id,
            buddy_id: currentRoute?.buddy_id,
            stars: rating,
            comment: comment,
            //addRate: true
        }
        const updatePayload = {
            id: currentRoute?.rate_id,
            request_id: currentRoute?.request_id,
            stars: rating,
            comment: comment,
            buddy_id: currentRoute?.buddy_id,
            // addRate: false
        }
        const newPayload = currentRoute?.addRate === true ? payload : updatePayload;
        //console.log('newPayloaddddd', newPayload)
        const message = currentRoute?.addRate === true ? "Rating added successfully." : "Rating updated successfully."
        dispatch(rateToBuddy({ payload: newPayload, addRate: currentRoute?.addRate })).then((result) => {
            if (result?.payload?.status === "success") {
                showAlert("Success", "success", message);
                setTimeout(() => {
                    handleBackPress();
                }, 3000);
            } else if (result?.payload?.errors) {
                showAlert("Error", "error", result?.payload?.errors)
            }

            else if (result?.payload?.status === "error") {
                showAlert("Error", "error", result?.payload?.message)
            }
        })
    }


    return (
        <SafeAreaView style={styles.container}>
            <ImageBackground
                style={{
                    flex: 1
                }}
                source={curveBg}>
                <Header
                    onPress={() => {
                        handleBackPress();
                    }}
                />
                <CustomLayout>
                    <View style={{
                        marginTop: 30,
                        padding: 20,
                        flex: 1
                    }}>
                        <Image style={{
                            width: scaleWidth(140),
                            height: scaleHeight(170),
                            alignSelf: 'center',
                            borderRadius: 20
                        }} source={{
                            uri: currentRoute?.buddy_image
                        }} />
                        <Text style={{
                            width: '75%',
                            fontFamily: fonts.fontsType.semiBold,
                            fontSize: 18,
                            color: theme.dark.white,
                            alignSelf: 'center',
                            textAlign: 'center',
                            marginTop: 20
                        }}>
                            Tell us how you feel about the service?
                        </Text>
                        <StarRating
                            rating={rating}
                            maxStars={5}
                            onChange={setRating}
                            color={theme.dark.secondary}
                            starSize={28}
                            StarIconComponent={(props) => <CustomStarIcon {...props} />}
                            style={{
                                marginTop: 30,
                                alignSelf: 'center'
                            }}
                        />
                        <View style={styles.inputContainer}>
                            <CustomTextInput
                                value={comment}
                                identifier={"comment"}
                                onValueChange={setComment}
                                label={"Comment"}
                                multiline={true}
                                mainContainer={{
                                    marginTop: 20
                                }}
                                customLabelStyle={{
                                    fontSize: 14
                                }}
                            />

                            <Text style={styles.textLength}>
                                {
                                    `${comment?.length}/250`
                                }
                            </Text>
                        </View>

                    </View>
                </CustomLayout>
                <Button
                    loading={loading}
                    onPress={() => {
                        handleRateBuddy();
                    }}
                    customStyle={{
                        width: '85%',
                        marginBottom: 50
                    }}
                    title={"Submit"}
                />
            </ImageBackground>
        </SafeAreaView>
    );
};

// define your styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.dark.primary,
    },
    textLength: {
        position: 'absolute',
        right: 15,
        top: 30,
        fontSize: 12,
        fontFamily: fonts.fontsType.medium,
        color: theme.dark.secondary,
    },
    inputContainer: {
        position: 'relative',
    },
});

//make this component available to the app
export default RateBuddy;
