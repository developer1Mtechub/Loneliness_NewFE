import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, FlatList, Image, Dimensions, TouchableOpacity, SafeAreaView } from 'react-native';
import { Icon } from 'react-native-elements';
import { theme } from '../../assets';
import { scaleHeight } from '../../styles/responsive';
import fonts from '../../styles/fonts';
import HorizontalDivider from '../../components/HorizontalDivider';
import { resetNavigation } from '../../utils/resetNavigation';
import { SCREENS } from '../../constant/constants';
import useBackHandler from '../../utils/useBackHandler';

const users = [
    { id: '1', name: 'John Doe', avatar: 'https://i.pravatar.cc/700', online: true },
    { id: '2', name: 'Jane', avatar: 'https://i.pravatar.cc/150?img=3', online: false },
    { id: '3', name: 'Alex', avatar: 'https://i.pravatar.cc/55', online: true },
    { id: '4', name: 'Chris Lee', avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704d', online: false },
    { id: '5', name: 'Sam', avatar: 'https://i.pravatar.cc/64', online: true },
    { id: '6', name: 'Taylor', avatar: 'https://i.pravatar.cc/57', online: true },
    // Add more user data as needed
];

const SearchServices = ({ navigation }) => {
    const [search, setSearch] = useState('');

    const handleBackPress = () => {
        resetNavigation(navigation, SCREENS.MAIN_DASHBOARD, { screen: SCREENS.SERVICES })
        return true;
    };
    useBackHandler(handleBackPress);

    const filteredUsers = users.filter(user =>
        user.name.toLowerCase().includes(search.toLowerCase())
    );

    const { width } = Dimensions.get('window');
    const itemSize = (width - 32) / 5; // Adjust width to fit 5 items per row with padding

    return (
        <SafeAreaView style={styles.mainContainer}>
            <View style={styles.container}>
                <View style={styles.inputContainer}>
                    <TouchableOpacity onPress={() => {
                        resetNavigation(navigation, SCREENS.MAIN_DASHBOARD, { screen: SCREENS.SERVICES })
                    }} style={styles.backButton}>
                        <Icon name="arrow-back" type="material" color={theme.dark.secondary} />
                    </TouchableOpacity>
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Search"
                        placeholderTextColor={theme.dark.inputLabel}
                        value={search}
                        onChangeText={setSearch}
                    />
                </View>
                <HorizontalDivider />
                <Text style={{
                    fontFamily: fonts.fontsType.semiBold,
                    fontSize: scaleHeight(18),
                    color: theme.dark.secondary,
                    marginHorizontal: 16,
                    marginBottom: 10
                }}>
                    Recent Searches
                </Text>
                <FlatList
                    data={filteredUsers}
                    keyExtractor={item => item.id}
                    numColumns={5}
                    renderItem={({ item }) => (
                        <View style={[styles.avatarContainer, { width: itemSize }]}>
                            <View style={styles.avatarWrapper}>
                                <Image source={{ uri: item.avatar }} style={styles.avatar} />
                                {item.online && <View style={styles.onlineIndicator} />}
                            </View>
                            <Text style={styles.username}>{item.name}</Text>
                        </View>
                    )}
                />
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: theme.dark.primary
    },
    container: {
        flex: 1,
        padding: 16,
    },
    searchInput: {
        width: '90%',
        height: scaleHeight(45),
        backgroundColor: theme.dark.inputBg,
        borderRadius: 30,
        borderColor: theme.dark.inputLabel,
        borderWidth: 1,
        padding: 10,
        color: theme.dark.inputLabel,


    },
    avatarContainer: {
        alignItems: 'center',
        marginVertical: 8,
    },
    avatarWrapper: {
        position: 'relative',
        width: 45,
        height: 45,
        borderRadius: 42,
        borderWidth: 1,
        borderColor: theme.dark.secondary,
        alignItems: 'center',
        justifyContent: 'center'
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        alignSelf: 'center'

    },
    onlineIndicator: {
        position: 'absolute',
        bottom: 4,
        right: 0,
        width: 8,
        height: 8,
        backgroundColor: '#00CD46',
        borderRadius: 4,
    },
    username: {
        marginTop: 8,
        textAlign: 'center',
        color: theme.dark.white,
        fontFamily: fonts.fontsType.medium,
        fontSize: scaleHeight(14)
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
        alignSelf: 'center',

    },
    backButton: {
        marginRight: 8,
        alignSelf: 'center',
    },
});

export default SearchServices;
