// DynamicSelector.js
import React, { useState } from 'react';
import { TouchableOpacity, Text, View, StyleSheet, Image, SafeAreaView } from 'react-native';
import { scaleHeight, scaleWidth } from '../../styles/responsive';
import { theme } from '../../assets';
import fonts from '../../styles/fonts';
import {
    buddyFinderImg, buddyImg,
    onboardingCurveCenter, onboardingCurveTop, onboardingLabelImg, onboardingLogo,
} from '../../assets/images';
import Button from '../../components/ButtonComponent';
import { resetNavigation } from '../../utils/resetNavigation';
import { SCREENS } from '../../constant/constants';
import Icon from 'react-native-vector-icons/MaterialIcons'
import { useDispatch } from 'react-redux';
import { setDataPayload } from '../../redux/appSlice';
import { useAlert } from '../../providers/AlertContext';

const RoleSelector = ({ navigation }) => {
    const dispatch = useDispatch();
    const { showAlert } = useAlert();
    const items = [{
        role: "Buddy",
        img: buddyImg
    }, {
        role: "Buddy Finder",
        img: buddyFinderImg
    }]
    const [selectedItem, setSelectedItem] = useState(null);

    const handleRoleSelector = async () => {
        if (!selectedItem) {
            showAlert("Error", "error", "Please select role.");
            return;
        }
        const screen = selectedItem === 'Buddy Finder' ? SCREENS.SIGNUP : SCREENS.BUDDY_SIGNUP;
        resetNavigation(navigation, screen);
        dispatch(setDataPayload({ role: selectedItem }));
    };


    return (
        <SafeAreaView style={styles.mainContainer}>

            <TouchableOpacity
                onPress={() => {
                    resetNavigation(navigation, SCREENS.ONBOARDING)
                }}
                style={styles.backButton}>

                <Icon name={'arrow-back'} size={28} color={theme.dark.secondary} />

            </TouchableOpacity>

            <Image resizeMode='contain'
                style={styles.imageCurveTop}
                source={onboardingCurveTop} />


            <Image resizeMode='contain'
                style={[styles.imageCurveCenter]}
                source={onboardingCurveCenter} />

            <View style={{
                marginTop: scaleHeight(50),
                flex: 1
            }}>


                <Image resizeMode='contain'
                    style={styles.imageLogo}
                    source={onboardingLogo} />



                <Text style={styles.subTitle}>
                    🚀 Select Your Path and Begin Your Journey Today!
                </Text>


                <View style={styles.container}>
                    {items?.map((item, index) => {
                        const isSelected = selectedItem === item?.role;
                        return (
                            <TouchableOpacity
                                key={index}
                                onPress={() => {
                                    setSelectedItem(item?.role)
                                }}
                                style={{
                                    ...styles.button,
                                    backgroundColor: isSelected ? theme.dark.transparentBg : theme.dark.inputBg,
                                    borderColor: isSelected ? theme.dark.secondary : theme.dark.text,
                                    marginTop: scaleHeight(30)
                                }}
                            >
                                <Image resizeMode='contain' source={item?.img}
                                    style={{
                                        width: scaleWidth(60),
                                        height: scaleHeight(60)
                                    }}
                                />
                                <Text
                                    style={{
                                        ...styles.text,
                                        color: isSelected ? theme.dark.secondary : theme.dark.inputLabel,
                                        fontSize: scaleHeight(18),
                                        marginHorizontal: scaleWidth(20)
                                    }}
                                >
                                    {item?.role}
                                </Text>
                            </TouchableOpacity>
                        );
                    })}
                </View>

            </View>


            <Button
                onPress={() => {
                    handleRoleSelector()
                }}
                title={'Continue'}
                customStyle={{
                    backgroundColor: !selectedItem
                        ? '#E7E7E7' :
                        theme.dark.secondary,
                    marginBottom: scaleHeight(50)
                }}
                textCustomStyle={{
                    color: !selectedItem ?
                        '#6C6C6C' :
                        theme.dark.black
                }}
            />


        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: theme.dark.background
    },
    container: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-evenly',
    },
    button: {
        alignItems: "center",
        backgroundColor: theme.dark.inputBg,
        height: scaleHeight(150),
        width: scaleWidth(130),
        borderRadius: 10,
        borderWidth: 1,
        borderColor: theme.dark.text,
        marginTop: scaleHeight(30),
        justifyContent: 'center',
        marginHorizontal: scaleWidth(-30)
    },
    text: {
        fontFamily: fonts.fontsType.medium,
        fontSize: scaleHeight(18),
        color: theme.dark.inputLabel,
        //marginHorizontal: scaleWidth(20),
        marginTop: scaleHeight(10),
    },
    contentConatiner: {
        flex: 1,
    },
    imageCurveTop: {
        width: scaleWidth(123),
        height: scaleHeight(110),
        position: 'absolute',
        top: scaleHeight(-10),
        alignSelf: 'flex-end',
        right: scaleWidth(-20)
    },
    imageLogo: {
        width: scaleWidth(79),
        height: scaleHeight(93),
        alignSelf: 'center',
        top: scaleHeight(30)
    },
    imageCurveCenter: {
        width: scaleWidth(123),
        height: scaleHeight(140),
        position: 'absolute',
        top: scaleHeight(150),
        alignSelf: 'flex-start',
        left: scaleWidth(-30),
    },
    subTitle: {
        fontFamily: fonts.fontsType.regular,
        fontSize: scaleHeight(14),
        color: theme.dark.white,
        marginTop: scaleHeight(50),
        width: scaleWidth(210),
        textAlign: 'center',
        alignSelf: 'center'
    },
    backButton: {
        paddingHorizontal: 25,
        marginTop: 20
    },
});

export default RoleSelector;
