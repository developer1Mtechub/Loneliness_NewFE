import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TextInput, TouchableOpacity, FlatList } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useDispatch, useSelector } from 'react-redux';
import { useAlert } from '../../../../../providers/AlertContext';
import { resetNavigation } from '../../../../../utils/resetNavigation';
import { SCREENS } from '../../../../../constant/constants';
import useBackHandler from '../../../../../utils/useBackHandler';
import { getLanguages } from '../../../../../redux/getLanguagesSlice';
import HorizontalDivider from '../../../../../components/HorizontalDivider';
import { theme } from '../../../../../assets';
import Button from '../../../../../components/ButtonComponent';
import { scaleHeight } from '../../../../../styles/responsive';
import fonts from '../../../../../styles/fonts';
import { updateProfile } from '../../../../../redux/AuthModule/updateProfileSlice';
import Header from '../../../../../components/Header';
import { setRoute } from '../../../../../redux/appSlice';
import FullScreenLoader from '../../../../../components/FullScreenLoader';


const UpdateLanguages = ({ navigation }) => {
    const dispatch = useDispatch();
    const { showAlert } = useAlert();
    const { languages, loading: languageLoader } = useSelector((state) => state.getLanguages);
    const { currentRoute } = useSelector((state) => state.app);
    const { loading } = useSelector((state) => state.createProfile)
    const [selectedLanguages, setSelectedLanguages] = useState([]);
    const [searchText, setSearchText] = useState('');

    const filteredLanguages = languages?.filter(language =>
        language?.name.toLowerCase().includes(searchText.toLowerCase())
    );

    const handleLanguageSelect = (language) => {
        setSelectedLanguages(prevState => {
            if (prevState.includes(language)) {
                return prevState.filter(item => item !== language);
            } else {
                return [...prevState, language];
            }
        });
    };

    const handleBackPress = () => {
        if (currentRoute?.route === SCREENS.MAIN_DASHBOARD) {
            resetNavigation(navigation, SCREENS.MAIN_DASHBOARD, { screen: SCREENS.PROFILE })
        } else {
            dispatch(setRoute({
                route: SCREENS.BUDDY_PROFILE_DETAIL
            }))
            resetNavigation(navigation, currentRoute?.route)
        }

        return true;
    };
    useBackHandler(handleBackPress);

    useEffect(() => {
        dispatch(getLanguages())
    }, [dispatch])

    // useEffect(() => {
    //     if (dataPayload?.languages) {
    //         setSelectedLanguages(dataPayload?.languages)
    //     }

    // }, [dataPayload]);

    const handleUpdateLanguages = () => {
        const formData = new FormData();
        formData.append('languages', JSON.stringify(selectedLanguages));
        dispatch(updateProfile(formData)).then((result) => {
            if (result?.payload?.status === "success") {
                showAlert("Success", "success", "Languages Changed Successfully.")
                setTimeout(() => {
                    handleBackPress();
                }, 3000);
            } else if (result?.payload?.status === "error") {
                showAlert("Error", "error", result?.payload?.message)
            }
        })
    }

    const renderLanguages = ({ item, index }) => {
        return (
            <TouchableOpacity
                key={index}
                onPress={() => { handleLanguageSelect(item?.name) }}
                style={styles.languageContainer}
            >
                <View style={styles.languageRow}>
                    <Text style={styles.languageText}>
                        {item?.name}
                    </Text>
                    <View style={[
                        styles.radioButtonOuter,
                        selectedLanguages.includes(item?.name) && styles.radioButtonSelected
                    ]}>
                        {selectedLanguages.includes(item.name) && <View style={styles.radioButtonInner} />}
                    </View>
                </View>
                <HorizontalDivider customStyle={styles.divider} />
            </TouchableOpacity>
        );
    };

    const showLoader = () => {
        return <FullScreenLoader
            title={"Please wait..."}
            loading={languageLoader} />;
    };

    return (
        <SafeAreaView style={styles.container}>
            <Header onPress={() => {
                handleBackPress();
            }} />
            <View style={styles.contentContainer}>
                <Text style={styles.welcomeText}>
                    Select Language
                </Text>
                <Text style={styles.subTitle}>
                    Pick the language that suits you best!
                </Text>
                <View style={styles.searchContainer}>
                    <View style={styles.searchBox}>
                        <Icon name={'search'} size={22} color={theme.dark.white} style={styles.searchIcon} />
                        <TextInput
                            placeholder='Search here'
                            placeholderTextColor={theme.dark.white}
                            style={styles.searchInput}
                            value={searchText}
                            onChangeText={setSearchText}
                        />
                    </View>
                </View>
                <View style={styles.languageListContainer}>

                    {languageLoader ? showLoader() : <FlatList
                        data={filteredLanguages}
                        renderItem={renderLanguages}
                        extraData={(index) => index}
                        keyboardShouldPersistTaps='always'
                    />}
                </View>

            </View>
            <View style={styles.buttonContainer}>
                <Button
                    loading={loading}
                    onPress={() => {
                        handleUpdateLanguages()
                    }}
                    title={'Change'}
                    customStyle={styles.continueButton}
                />
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.dark.background
    },
    contentContainer: {
        paddingHorizontal: 25,
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
    searchContainer: {
        flexDirection: 'row',
        marginBottom: scaleHeight(20),
        alignSelf: 'center',
        marginTop: scaleHeight(25)
    },
    searchBox: {
        width: '100%',
        height: scaleHeight(42),
        borderRadius: 20,
        borderWidth: 0.5,
        borderColor: 'white',
        backgroundColor: 'transparent',
        marginHorizontal: 10,
        justifyContent: 'center',
        flexDirection: 'row',
        alignItems: 'center'
    },
    searchIcon: {
        marginHorizontal: 8
    },
    searchInput: {
        fontFamily: fonts.fontsType.light,
        fontSize: scaleHeight(14),
        color: theme.dark.white,
        flex: 1,
    },
    languageListContainer: {
        height: scaleHeight(510)
    },
    buttonContainer: {
        width: '90%',
        alignSelf: 'center',
        // marginTop: scaleHeight(10),
    },
    continueButton: {
        width: '100%',
        marginTop: 30
    },
    languageContainer: {},
    languageRow: {
        flexDirection: 'row',
    },
    languageText: {
        color: theme.dark.white,
        fontFamily: fonts.fontsType.regular,
        fontSize: scaleHeight(16),
        marginHorizontal: 10,
        flex: 1,
        alignSelf: 'center'
    },
    divider: {
        marginTop: 15,
    },
    radioButtonOuter: {
        height: 22,
        width: 22,
        borderRadius: 11,
        borderWidth: 2,
        borderColor: theme.dark.white,
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: 10
    },
    radioButtonSelected: {
        borderColor: theme.dark.secondary,
    },
    radioButtonInner: {
        height: 12,
        width: 12,
        borderRadius: 6,
        backgroundColor: theme.dark.secondary,
    },
});

export default UpdateLanguages;
