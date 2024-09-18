import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';
import { resetNavigation } from '../../../utils/resetNavigation';
import { SCREENS } from '../../../constant/constants';
import useBackHandler from '../../../utils/useBackHandler';
import { theme } from '../../../assets';
import CustomLayout from '../../../components/CustomLayout';
import fonts from '../../../styles/fonts';
import { scaleHeight, scaleWidth } from '../../../styles/responsive';
import HorizontalDivider from '../../../components/HorizontalDivider';
import Button from '../../../components/ButtonComponent';
import ProfileProgressBar from '../../../components/ProfileProgressBar';
import DynamicOptionSelector from '../../../components/DynamicOptionSelector';
import { useDispatch, useSelector } from 'react-redux';
import { useAlert } from '../../../providers/AlertContext';
import { setDataPayload } from '../../../redux/appSlice';

const GenderLookingFor = ({ navigation }) => {
    const dispatch = useDispatch();
    const { showAlert } = useAlert();
    const { dataPayload } = useSelector((state) => state.app);
    const gender = ["Male", "Female", "Other"]
    const [selectedGender, setSelectedGender] = useState(null)



    const handleBackPress = () => {
        resetNavigation(navigation, SCREENS.GENDER_SELECTION)
        return true;
    };
    useBackHandler(handleBackPress);

    useEffect(() => {
        if (dataPayload?.gender?.length) {
            const preSelectedGender = gender.filter(gender => dataPayload.gender.includes(gender));
            setSelectedGender(preSelectedGender);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dataPayload]);

    const handleItemSelected = (item) => {
        setSelectedGender(item);
    };

    const handleGenderSelection = () => {
        if (selectedGender == null) {
            showAlert("Error", "error", "Please select gender.")
            return
        }
        const newPayload = { ...dataPayload, looking_for_gender: selectedGender };
        dispatch(setDataPayload(newPayload));
        resetNavigation(navigation, SCREENS.YOUR_INTERESTS)
    }

    return (
        <SafeAreaView style={styles.container}>
            <ProfileProgressBar progress={70} onPress={() => {
                resetNavigation(navigation, SCREENS.GENDER_SELECTION)
            }} />
            <CustomLayout>
                <View style={styles.contentContainer}>
                    <Text style={styles.welcomeText}>
                        Looking For
                    </Text>
                    <Text style={styles.subTitle}>
                        Let's start by knowing a bit more about what you're looking for
                    </Text>

                    <DynamicOptionSelector
                        items={gender}
                        onItemSelected={handleItemSelected}
                        selectedItem={selectedGender}
                    />
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
    buttonContainer: {
        width: '90%',
        alignSelf: 'center',
        marginTop: scaleHeight(200),
        marginBottom: scaleHeight(20)
    }
});


export default GenderLookingFor;
