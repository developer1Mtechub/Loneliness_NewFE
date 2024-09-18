import React, { useState, useRef, useEffect } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { ListItem, Icon } from 'react-native-elements';
import SwipeRow from '@nghinv/react-native-swipe-row';
import moment from 'moment';
import { blockUserChat, deleteChat, reportChat } from '../assets/images';
import fonts from '../styles/fonts';
import { theme } from '../assets';

const ChatUserItem = ({ user }) => {
    const [isSwiped, setIsSwiped] = useState(false);
    const swipeableRef = useRef(null);

    const getTimeDifference = (timestamp) => {
        const now = moment();
        const diffInSeconds = now.diff(timestamp, 'seconds');

        if (diffInSeconds >= 60) {
            const diffInMinutes = Math.floor(diffInSeconds / 60);
            if (diffInMinutes >= 60) {
                const diffInHours = Math.floor(diffInMinutes / 60);
                if (diffInHours >= 24) {
                    const diffInDays = Math.floor(diffInHours / 24);
                    if (diffInDays >= 7) {
                        const diffInWeeks = Math.floor(diffInDays / 7);
                        return `${diffInWeeks} week${diffInWeeks > 1 ? 's' : ''} ago`;
                    } else {
                        return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
                    }
                } else {
                    return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
                }
            } else {
                return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`;
            }
        } else {
            return `${diffInSeconds} second${diffInSeconds > 1 ? 's' : ''} ago`;
        }
    };

    const handleSwipeClose = () => {
        setIsSwiped(false);
    };


    return (
        <SwipeRow
            ref={swipeableRef}
            right={[
                {
                    backgroundColor: 'transparent',
                    //icon: { name: 'edit' },
                    component:<Icon name="flag" type="font-awesome" color="white" />
                },
                {
                    backgroundColor: 'yellow',
                    icon: { name: 'delete' },

                },
                {
                    backgroundColor: 'transparent',
                    icon: { name: 'report' },
                },
            ]}
            onSwipeClose={handleSwipeClose}

        //swipeStartMinDistance={50} 
        >
            <TouchableOpacity onPress={() => {
            }}>
                <ListItem
                    //bottomDivider
                    containerStyle={{
                        backgroundColor: isSwiped ? 'rgba(220, 235, 235, 1)' : 'transparent',
                        marginTop: -10
                    }}>
                    <View style={{ position: 'relative' }}>
                        <Image
                            source={{ uri: user?.profile_pic }}
                            style={{ width: 50, height: 50, borderRadius: 25 }}
                        />
                        {user?.status && (
                            <View
                                style={{
                                    position: 'absolute',
                                    width: 10,
                                    height: 10,
                                    borderRadius: 5,
                                    backgroundColor: 'rgba(15, 225, 109, 1)',
                                    borderWidth: 2,
                                    borderColor: 'white',
                                    bottom: 4,
                                    right: -2,
                                }}
                            />
                        )}
                    </View>
                    <ListItem.Content>
                        <ListItem.Title style={styles.title}>{user.name}</ListItem.Title>
                        <ListItem.Subtitle style={styles.subtitle}>{user?.message}</ListItem.Subtitle>
                    </ListItem.Content>
                    <View style={{ alignItems: 'flex-end' }}>
                        <Text style={[styles.recentTime, {
                            marginTop: user?.unreadCount > 0 ? 10 : -10,
                            marginBottom: user?.unreadCount > 0 ? 15 : 0
                        }]}>
                            {user.time}
                        </Text>

                        {user?.unreadCount > 0 && <View style={styles.messageContainer}>
                            <Text style={styles.messageCount}>{user?.unreadCount}</Text>
                        </View>}
                    </View>
                </ListItem>
            </TouchableOpacity>
        </SwipeRow>
    );

};

const styles = StyleSheet.create({
    title: {
        fontFamily: fonts.fontsType.semiBold,
        fontSize: 17,
        color: theme.dark.white
    },
    subtitle: {
        fontFamily: fonts.fontsType.regular,
        fontSize: 12,
        color: theme.dark.inputLabel
    },
    recentTime: {
        fontFamily: fonts.fontsType.regular,
        fontSize: 12,
        color: theme.dark.inputLabel,
        marginTop: 10
    },
    messageCount: {
        fontFamily: fonts.fontsType.medium,
        fontSize: 12,
        color: 'white'
    },
    messageContainer: {
        width: 22,
        height: 22,
        borderRadius: 11,
        backgroundColor: theme.dark.secondary,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: -7
    }
})

export default ChatUserItem;
