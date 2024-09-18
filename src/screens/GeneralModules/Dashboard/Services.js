//import liraries
import React, { Component, useRef, useState } from 'react';
import { StyleSheet, SafeAreaView, TouchableOpacity, TextInput } from 'react-native';
import { resetNavigation } from '../../../utils/resetNavigation';
import { homeLogo, searchServices } from '../../../assets/images';
import { SCREENS } from '../../../constant/constants';
import { theme } from '../../../assets';
import CustomHeader from '../../../components/CustomHeader';
import UserServicesContent from './UserDashboard/UserServicesContent';
import BuddyServicesContent from './BuddyDashboard/BuddyServicesContent';
import { useSelector } from 'react-redux';
import { scaleHeight } from '../../../styles/responsive';
import { Icon } from 'react-native-elements';
import * as Animatable from 'react-native-animatable';

const Services = ({ navigation }) => {
    const { role } = useSelector((state) => state.auth);
    const { lastIndex } = useSelector((state) => state.setLastIndex);
    const [selectedIndex, setSelectedIndex] = useState(lastIndex);
    const [isFilter, setFilter] = useState(false);
    const [isFilterApplied, setIsFilterApllied] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [isSearching, setIsSearching] = useState(false);
    // const [selectedIndex, setSelectedIndex] = useState(0);

    const handleSearchPress = () => {
        setIsSearching(true)
    };

    const hideFilterButton = selectedIndex !== null && selectedIndex === 1;

    const clearSearch = () => {
        setIsSearching(false)
        setSearchQuery('');
    };


    return (
        <SafeAreaView style={styles.container}>

            {isSearching ? (
                <Animatable.View
                    animation={'flipInX'}
                    duration={1000}
                    style={styles.inputContainer}>
                    <TouchableOpacity
                        onPress={() => {
                            clearSearch();
                        }} style={styles.backButton}>
                        <Icon name="arrow-back" type="material" color={theme.dark.secondary} />
                    </TouchableOpacity>
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Search requests..."
                        placeholderTextColor={theme.dark.inputLabel}
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                        autoFocus={true}

                    />
                </Animatable.View>
            ) : (
                <CustomHeader
                    homeLogo={homeLogo}
                    title="Services"
                    searchIcon={searchServices}
                    onSearchPress={handleSearchPress}
                    hideFilterButton={hideFilterButton}
                    isFilterApplied={isFilterApplied}
                    onFilterPress={() => {
                        setFilter(true)
                    }}
                />
            )}

            {role === 'USER' ? <UserServicesContent
                initialIndex={selectedIndex}
                setCurrentIndex={setSelectedIndex}
                isFilter={isFilter}
                setFilter={setFilter}
                setIsFilterApllied={setIsFilterApllied}
                searchQuery={searchQuery}
            /> : <BuddyServicesContent
                initialIndex={selectedIndex}
                setCurrentIndex={setSelectedIndex}
                searchQuery={searchQuery}
            />}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.dark.primary
    },
    searchInput: {
        width: '85%',
        height: scaleHeight(45),
        backgroundColor: theme.dark.inputBg,
        borderRadius: 30,
        borderColor: theme.dark.inputLabel,
        borderWidth: 1,
        padding: 10,
        color: theme.dark.inputLabel,

    },
    inputContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        marginTop: 20

    },
    backButton: {
        marginRight: 10,
        alignSelf: 'center',
    },
});

export default Services;
