import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useAlert } from '../../../../../providers/AlertContext';
import { resetNavigation } from '../../../../../utils/resetNavigation';
import { SCREENS } from '../../../../../constant/constants';
import useBackHandler from '../../../../../utils/useBackHandler';
import { getAllCategories } from '../../../../../redux/getAllCategoriesSlice';
import CustomLayout from '../../../../../components/CustomLayout';
import CategorySelector from '../../../../../components/CategorySelector';
import HorizontalDivider from '../../../../../components/HorizontalDivider';
import Button from '../../../../../components/ButtonComponent';
import { theme } from '../../../../../assets';
import fonts from '../../../../../styles/fonts';
import { scaleHeight } from '../../../../../styles/responsive';
import Header from '../../../../../components/Header';
import { updateProfile } from '../../../../../redux/AuthModule/updateProfileSlice';
import { setRoute } from '../../../../../redux/appSlice';
import FullScreenLoader from '../../../../../components/FullScreenLoader';


const UpdateInterests = ({ navigation }) => {
    const dispatch = useDispatch();
    const { categories, loading: categoryLoader } = useSelector((state) => state.getCategories)
    const { loading } = useSelector((state) => state.createProfile)
    const { showAlert } = useAlert();
    const { dataPayload } = useSelector((state) => state.app);
    const { currentRoute } = useSelector((state) => state.app);
    const [selectedInterests, setSelectedInterests] = useState([]);

    const handleBackPress = () => {
        if (currentRoute?.route === SCREENS.MAIN_DASHBOARD) {
            resetNavigation(navigation, SCREENS.MAIN_DASHBOARD, { screen: SCREENS.PROFILE })
        } else {
            dispatch(setRoute({
                route: SCREENS.USER_PROFILE_DETAIL
            }))
            resetNavigation(navigation, currentRoute?.route)
        }

        return true;
    };
    useBackHandler(handleBackPress);


    useEffect(() => {
        dispatch(getAllCategories())
    }, [dispatch])


    useEffect(() => {
        if (currentRoute?.categories?.length > 0) {
            const preSelectedInterests = categories?.filter(interest =>
                currentRoute.categories?.some(category => category.name === interest.name)
            );
            setSelectedInterests(preSelectedInterests);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentRoute, categories]);


    const handleItemSelected = (item) => {
        setSelectedInterests(item)
    };

    const handleSelectedInterests = () => {
        if (selectedInterests?.length == 0) {
            showAlert("Error", "error", "Please select at least 1 category.")
            return
        }
        let categoryIds = [];
        selectedInterests?.map((item) => {
            categoryIds.push(item?.id)
        })
        const newPayload = { category_ids: categoryIds };

        const formData = new FormData();
        formData.append('category_ids', JSON.stringify(newPayload?.category_ids));
        dispatch(updateProfile(formData)).then((result) => {
            if (result?.payload?.status === "success") {
                showAlert("Success", "success", result?.payload?.message)
                setTimeout(() => {
                    handleBackPress();
                }, 3000);
            } else if (result?.payload?.status === "error") {
                showAlert("Error", "error", result?.payload?.message)
            }
        })
    }

    const renderLoader = () => {
        return <FullScreenLoader loading={categoryLoader} />
    }

    return (
        <SafeAreaView style={styles.container}>
            <Header onPress={() => {
                handleBackPress();
            }} />
            {
                categoryLoader ? renderLoader() : <>
                    <View style={styles.contentContainer}>
                        <Text style={styles.welcomeText}>
                            Select Your Interests
                        </Text>
                        <Text style={styles.subTitle}>
                            Select Your Interests and Unlock Your Perfect Matches!
                        </Text>

                        <CategorySelector
                            items={categories}
                            onItemSelected={handleItemSelected}
                            selectedItems={selectedInterests}
                        />

                    </View>

                    <View style={styles.buttonContainer}>

                        <HorizontalDivider
                            customStyle={{
                                marginTop: 40
                            }} />

                        <Button
                            loading={loading}
                            onPress={() => {
                                handleSelectedInterests();
                            }}
                            title={'Update'}
                        />
                    </View>
                </>
            }

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
    }
});


export default UpdateInterests;
