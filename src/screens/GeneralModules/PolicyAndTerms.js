import React, { Component, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, Image, ScrollView } from 'react-native';
import { theme } from '../../assets';
import Header from '../../components/Header';
import { privacyPolicy, termsCondition } from '../../assets/images';
import { scaleHeight, scaleWidth } from '../../styles/responsive';
import fonts from '../../styles/fonts';
import { resetNavigation } from '../../utils/resetNavigation';
import { SCREENS } from '../../constant/constants';
import useBackHandler from '../../utils/useBackHandler';
import { useDispatch, useSelector } from 'react-redux';
import { getPolicyAndTerms } from '../../redux/getPolicyTermsSlice';


const PolicyAndTerms = ({ navigation }) => {
    const dispatch = useDispatch();
    const { response, loading } = useSelector((state) => state.getPolicyAndTerms);
    const { currentRoute } = useSelector((state) => state.app);

    const handleBackPress = () => {
        resetNavigation(navigation, SCREENS.MAIN_DASHBOARD, { screen: SCREENS.PROFILE })
        return true;
    };
    useBackHandler(handleBackPress);


    useEffect(() => {
        dispatch(getPolicyAndTerms(currentRoute?.type))
    }, [dispatch, currentRoute])


    const stripHtmlTags = (html) => {
        return html?.replace(/<\/?[^>]+(>|$)/g, "");
    };


    return (
        <SafeAreaView style={styles.container}>

            <Header
                onPress={() => {
                    handleBackPress();
                }}
                title={currentRoute?.type === "terms" ? "Terms & Condition" : "Privacy Policy"} />

            <ScrollView style={{
                flex: 1,
                marginHorizontal: 20
            }}>

                <Image style={{
                    width: scaleWidth(152),
                    height: scaleHeight(152),
                    alignSelf: 'center',
                }} source={currentRoute?.type === "terms" ? termsCondition : privacyPolicy} />

                <Text style={{
                    fontFamily: fonts.fontsType.regular,
                    fontSize: scaleHeight(15),
                    lineHeight: scaleHeight(28),
                    color: theme.dark.heading,
                    alignSelf: 'center',
                    textAlign: 'justify'
                }}>
                    {stripHtmlTags(response?.content)}
                </Text>

            </ScrollView>

        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.dark.primary
    },
});

export default PolicyAndTerms;
