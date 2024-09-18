import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Image, FlatList, TextInput, ScrollView } from 'react-native';
import { resetNavigation } from '../../../utils/resetNavigation';
import { SCREENS } from '../../../constant/constants';
import useBackHandler from '../../../utils/useBackHandler';
import { theme } from '../../../assets';
import CustomTextInput from '../../../components/TextInputComponent';
import CustomLayout from '../../../components/CustomLayout';
import fonts from '../../../styles/fonts';
import { scaleHeight, scaleWidth } from '../../../styles/responsive';
import HorizontalDivider from '../../../components/HorizontalDivider';
import Button from '../../../components/ButtonComponent';
import ProfileProgressBar from '../../../components/ProfileProgressBar';
import { BottomSheet } from "@rneui/themed";
import Icon from 'react-native-vector-icons/MaterialIcons'
import DynamicOptionSelector from '../../../components/DynamicOptionSelector';
import { useDispatch, useSelector } from 'react-redux';
import { setDataPayload } from '../../../redux/appSlice';
import { useAlert } from '../../../providers/AlertContext';

const BuddySelectGender = ({ navigation }) => {
    const dispatch = useDispatch();
    const { showAlert } = useAlert();
    const { dataPayload } = useSelector((state) => state.app);
    const gender = ["Male", "Female", "Prefer not to say"]
    const [selectedGender, setSelectedGender] = useState(null);

    const handleBackPress = () => {
        resetNavigation(navigation, SCREENS.BUDDY_BIRTH_DATE)
        return true;
    };
    useBackHandler(handleBackPress);

    const handleItemSelected = (item) => {
        setSelectedGender(item);
    };

    const handleGenderSelection = () => {
        if (selectedGender == null) {
            showAlert("Error", "error", "Please select gender.")
            return
        }
        const newPayload = { ...dataPayload, gender: selectedGender };
        dispatch(setDataPayload(newPayload));
        resetNavigation(navigation, SCREENS.HEIGHT_WEIGHT)
    }

    return (
        <SafeAreaView style={styles.container}>
            <ProfileProgressBar progress={60} onPress={() => {
                resetNavigation(navigation, SCREENS.BUDDY_BIRTH_DATE)
            }} />
            <CustomLayout>
                <View style={styles.contentContainer}>
                    <Text style={styles.welcomeText}>
                        Be True To Yourself
                    </Text>
                    <Text style={styles.subTitle}>
                        Choose the gender that best represents you. Authenticity is key to meaningful connections.
                    </Text>

                    <DynamicOptionSelector
                        items={gender}
                        onItemSelected={handleItemSelected}
                    />

                    {/* {
                        gender?.map((item, index) => {

                            return <TouchableOpacity
                                key={index}
                                style={{

                                    flexDirection: "row",
                                    alignItems: "center",
                                    backgroundColor: theme.dark.inputBg,
                                    height: 45,
                                    borderRadius: 30,
                                    borderWidth: 1,
                                    borderColor: theme.dark.text,
                                    marginTop: scaleHeight(30)

                                }}>

                                <Text
                                    style={{
                                        fontFamily: fonts.fontsType.medium,
                                        fontSize: scaleHeight(18),
                                        color: theme.dark.inputLabel,
                                        marginHorizontal:scaleWidth(20)
                                    }}
                                >{item}</Text>

                            </TouchableOpacity>

                        })
                    } */}


                </View>

                <View style={styles.buttonContainer}>

                    <HorizontalDivider
                        customStyle={{
                            marginTop: 40
                        }} />

                    <Button
                        onPress={() => {
                            handleGenderSelection();
                        }}
                        title={'Continue'}
                    />
                </View>

            </CustomLayout>

        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.dark.background
    },
    contentContainer: {
        padding: 25,
        flex: 1
    },
    welcomeText: {
        fontFamily: fonts.fontsType.semiBold,
        fontSize: scaleHeight(22),
        color: theme.dark.white,
        marginTop: 15
    },
    subTitle: {
        fontFamily: fonts.fontsType.regular,
        fontSize: scaleHeight(14),
        color: theme.dark.heading,
        marginTop: 5
    },
    forgetText: {
        fontFamily: fonts.fontsType.semiBold,
        fontSize: scaleHeight(14),
        color: theme.dark.secondary,
        alignSelf: 'center'
    },
    createAccountText1: {
        fontFamily: fonts.fontsType.regular,
        fontSize: scaleHeight(16),
        color: theme.dark.white
    },
    createAccountText2: {
        fontFamily: fonts.fontsType.bold,
        fontSize: scaleHeight(16),
        color: theme.dark.secondary,
        marginHorizontal: 5,
        textDecorationLine: 'underline'
    },
    createAccountItem: {
        flexDirection: 'row',
        alignSelf: 'center',
        marginTop: 30,
    },
    buttonContainer: {
        width: '90%',
        alignSelf: 'center',
        marginTop: scaleHeight(200),
        marginBottom: scaleHeight(20)
    },
    createAccountView: {
        flex: 1
    },
    forgetPassContainer: {
        flexDirection: 'row',
        marginTop: 20,
    },
    backButton: {
        alignSelf: 'center'
    },
    errorText: {
        fontFamily: fonts.fontsType.regular,
        fontSize: scaleHeight(12),
        color: theme.dark.error,
        marginTop: 8,
        marginHorizontal: scaleWidth(15),
    },
});


export default BuddySelectGender;
