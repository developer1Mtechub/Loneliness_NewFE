import React, { useEffect, useState } from 'react';
import { View, TouchableOpacity, StyleSheet, Text, Image, Platform } from 'react-native';
import fonts from '../styles/fonts';
import { theme } from '../assets';
import { scaleHeight } from '../styles/responsive';
import { useSelector } from 'react-redux';
import { SOCKET_URL } from '@env'
import io from 'socket.io-client';

const CustomBottomTabBar = ({ state, descriptors, navigation, icons }) => {
    const [socket, setSocket] = useState(null);
    const [unreadCount, setUnreadCount] = useState(0);
    const { routes } = state;
    const { role, userLoginInfo } = useSelector((state) => state.auth);
    const { id } = userLoginInfo?.user

    useEffect(() => {
        const newSocket = io(SOCKET_URL);
        setSocket(newSocket);
        newSocket.on('connect', () => {
            console.log(' bottom Socket connected');
        });
        return () => {
            newSocket.disconnect();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {

        if (socket) {
            const userId = parseInt(id)
            socket.emit("userOnline", userId);
            socket.emit("registerUser", userId);
            socket.on("unreadChatsCount", ({userId,count}) => {
                console.log('bottom count',count)
                setUnreadCount(count);
              });
               socket.on('getUnreadChatsCount', ({ userId }) => {
                socket.emit("userChatCountget",  userId );
              });

        }

        return () => {
            if (socket) {
                socket.off("unreadChatsCount");
                socket.off("getUnreadChatsCount");
            }

        };

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [socket])

    return (
        <View style={[styles.tabContainer, { backgroundColor: role === 'USER' ? '#4C4615' : theme.dark.primary, }]}>
            {routes.map((route, index) => {
                const { options } = descriptors[route.key];
                const label = options.title !== undefined ? options.title : route.name;
                const Icon = options.icon; // Extract icon from options
                const isFocused = state.index === index;
                const isChatScreen = route.name === 'ChatScreen';
                const onPress = () => {
                    const event = navigation.emit({
                        type: 'tabPress',
                        target: route.key,
                        canPreventDefault: true,
                    });

                    if (!isFocused && !event.defaultPrevented) {
                        navigation.navigate(route.name);
                    }
                };

                return (
                    <TouchableOpacity
                        key={route.key}
                        onPress={onPress}
                        style={[styles.tabButton, isFocused && styles.selectedTab]}
                    >
                        {/* Icon */}
                        <View style={{ position: 'relative' }}>
                            <Image style={{
                                height: 24,
                                width: 26,
                                alignSelf: 'center',
                                tintColor: isFocused
                                    ? theme.dark.secondary
                                    : theme.dark.inActiveColor,
                            }}
                                source={icons[index]} />

                            {isChatScreen && unreadCount > 0 && (
                                <View style={styles.badge}>
                                    <Text style={styles.badgeText}>{unreadCount}</Text>
                                </View>
                            )}
                        </View>
                        <Text style={[styles.tabText, {
                            color: isFocused
                                ? theme.dark.secondary
                                : theme.dark.inActiveColor,
                        }]}>{label}</Text>
                    </TouchableOpacity>
                );
            })}
        </View>
    );
};

const styles = StyleSheet.create({
    tabContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        backgroundColor: '#434343',
        height: Platform.OS === 'ios' ? 80 : 56,
        paddingBottom: Platform.OS === 'ios' ? 15 : 0,
        // shadowOpacity: 0.05,
        // shadowColor: theme.dark.secondary
        // elevation: 4,
    },
    tabButton: {
        borderRadius: 30,
        paddingHorizontal: 10,
        height: 40
    },
    tabText: {
        alignSelf: 'center',
        color: theme.dark.secondary,
        fontFamily: fonts.fontsType.regular,
        fontSize: scaleHeight(15),
    },
    badge: {
        position: 'absolute',
        top: -5,
        right: -3,
        backgroundColor: theme.dark.primary,
        borderRadius: 10,
        minWidth: 20,
        height: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    badgeText: {
        color: theme.dark.secondary,
        fontSize: 10,
        fontFamily: fonts.fontsType.semiBold,
        alignSelf: 'center'
    },
});

export default CustomBottomTabBar;
