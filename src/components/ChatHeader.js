import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { Badge } from '@rneui/themed';
import fonts from '../styles/fonts';
import { theme } from '../assets';
import Icon from 'react-native-vector-icons/MaterialIcons';


const ChatHeader = ({ onPress, backPress, profilePress, userName, status, image_url }) => {

    return (
        <View style={styles.container}>
            <TouchableOpacity
                onPress={backPress}
                style={styles.backButtonContainer}>
                <Icon name="arrow-back" size={30} color={theme.dark.secondary} />
            </TouchableOpacity>
            <TouchableOpacity
                onPress={profilePress}
                style={styles.profileContainer}>
                <Image source={{ uri: image_url }} style={styles.profilePic} />
                <View style={styles.profileInfo}>
                    <Text style={styles.profileName}>{userName}</Text>
                    {/* <View style={{ flexDirection: 'row' }}>
                        <Text style={styles.onlineStatus}>{status === "offline" ? "Offline" : "Online"}</Text>
                        {status != "offline" && <Badge containerStyle={{
                            alignSelf: 'center',
                            marginStart: 5,
                            position: 'absolute',
                            bottom: 0,
                            left: -25
                        }} status="success" />}
                    </View> */}

                </View>
            </TouchableOpacity>

            {/* <View style={styles.backButtonContainer}>
                <Icon name="more-vert" size={30} color={theme.dark.secondary} onPress={onPress} />
            </View> */}

        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        paddingVertical: 5,
        backgroundColor: theme.dark.primary,
        marginTop: 20
    },
    backButtonContainer: {
        // Style your back button container
    },
    profileContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: 5,
        flex: 1
    },
    profilePic: {
        width: 40,
        height: 40,
        borderRadius: 20,
    },
    profileInfo: {
        marginLeft: 10,
    },
    profileName: {
        fontSize: 16,
        fontFamily: fonts.fontsType.regular,
        color: theme.dark.white
    },
    onlineStatus: {
        fontSize: 12,
        fontFamily: fonts.fontsType.regular,
        color: '#00CD46',
        alignSelf: 'center'
    },
});

export default ChatHeader;
