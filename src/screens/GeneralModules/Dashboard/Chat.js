import React, { useEffect, useState } from 'react';
import {
    SafeAreaView,
    StyleSheet,
    View,
    Text,
    StatusBar,
    Pressable,
    Alert,
    TouchableOpacity,
    Image,
    ImageBackground,
    TextInput,
} from 'react-native';

import SwipeableFlatList from 'react-native-swipeable-list';
import { blockUser, blockUserChat, deleteChat, deleteUser, homeLogo, reportChat, searchServices } from '../../../assets/images';
import { scaleHeight, scaleWidth } from '../../../styles/responsive';
import { theme } from '../../../assets';
import fonts from '../../../styles/fonts';
import { resetNavigation } from '../../../utils/resetNavigation';
import { SCREENS } from '../../../constant/constants';
import io from 'socket.io-client';
import { SOCKET_URL } from '@env'
import { useDispatch, useSelector } from 'react-redux';
import { setRoute } from '../../../redux/appSlice';
import moment from 'moment';
import CustomModal from '../../../components/CustomModal';
import { userBuddyAction } from '../../../redux/userBuddyActionSlice';
import { useAlert } from '../../../providers/AlertContext';
import HorizontalDivider from '../../../components/HorizontalDivider';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import FullScreenLoader from '../../../components/FullScreenLoader';
import { Icon } from 'react-native-elements';
import * as Animatable from 'react-native-animatable';
import EmptyListComponent from '../../../components/EmptyListComponent';
import WarningBanner from '../../../components/WarningBanner';

const extractItemKey = item => {
    return item?.userId?.toString();
};

const Chat = ({ navigation }) => {
    const dispatch = useDispatch();
    const { showAlert } = useAlert();
    const [socket, setSocket] = useState(null);
    const [filteredContacts, setFilteredContacts] = useState([]);
    const { userLoginInfo, role } = useSelector((state) => state.auth);
    const [modalVisible, setModalVisible] = useState(false);
    const [deleteModal, setDeleteModal] = useState(false);
    const [contactLoader, setContactLoader] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [allContacts, setAllContacts] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
    const [selectedUser, setSelectedUser] = useState({
        user_name: '',
        user_id: '',
        blockStatus: false
    });
    const user_id = userLoginInfo?.user?.id;
    const blockTitle = role === "USER" ? "Buddy?" : "User?";

    useEffect(() => {
        const newSocket = io(SOCKET_URL);
        setSocket(newSocket);
        newSocket.on('connect', () => {
            console.log('Socket connectedddd');
        });

        return () => {
            newSocket.disconnect();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (socket) {
            const userId = parseInt(user_id);
            socket.emit("userOnline", userId);
            socket.emit("registerUser", userId);
            //socket.emit("addContact", { userId, contactId: 92 });
            socket.on("contactsUsers", (contacts) => {
                const filteredContacts = contacts?.filter(contact => contact?.userId !== userId);
                const sortedContacts = filteredContacts?.sort((a, b) =>
                    new Date(b.lastMessageTimestamp) - new Date(a.lastMessageTimestamp)
                );
                setAllContacts(sortedContacts);
                setFilteredContacts(sortedContacts);
                setContactLoader(false)

            });
        }

        return () => {
            if (socket) {
                socket.off("contactsUsers");
            }
        };
    }, [socket, user_id, dispatch]);

    const handleSearchChange = (query) => {
        setSearchQuery(query);
        if (query.trim() === '') {
            setFilteredContacts(allContacts);
        } else {
            const filtered = allContacts.filter(contact =>
                contact.fullName && contact.fullName.toLowerCase().includes(query.toLowerCase())
            );
            setFilteredContacts(filtered);
        }
    };

    const handleChatNavigation = (item) => {
        const userId = parseInt(user_id);
        if (socket) {
            socket.emit("markMessagesAsRead", {
                userId: userId,
                contactId: item?.userId,
            });
        }
        dispatch(setRoute({
            route: SCREENS.MAIN_DASHBOARD,
            receiver_id: item?.userId,
            user_name: item?.fullName,
            status: item?.status,
            image_url: item?.images[0]?.image_url,
            blockStatus: item?.blockStatus
        }));
        resetNavigation(navigation, SCREENS.GENERAL_CHAT);
    };

    const handleBlockOpenModal = () => {
        setModalVisible(true);
    };

    const handleDeleteOpenModal = () => {
        setDeleteModal(true);
    };

    const handleBlockCloseModal = () => {
        setModalVisible(false);
    };

    const handleDeleteCloseModal = () => {
        setDeleteModal(false);
    };

    const handleBlockUser = (userId) => {
        const userPayload = {
            user_id: userId,
            type: "BLOCK"
        };

        const buddyPayload = {
            buddy_id: userId,
            type: "BLOCK"
        };

        const finalPayload = role === "USER" ? buddyPayload : userPayload;
        dispatch(userBuddyAction(finalPayload)).then((result) => {
            if (result?.payload?.status === "success") {
                showAlert("Success", "success", result?.payload?.message);
                //update contact list after block user....
                const updatedAllContacts = allContacts.map(contact =>
                    contact.userId === userId
                        ? { ...contact, blockStatus: !contact.blockStatus }
                        : contact
                );
                const updatedFilteredContacts = filteredContacts.map(contact =>
                    contact.userId === userId
                        ? { ...contact, blockStatus: !contact.blockStatus }
                        : contact
                );

                setAllContacts(updatedAllContacts);
                setFilteredContacts(updatedFilteredContacts);


                handleBlockCloseModal();
            } else if (result?.payload?.status === "error") {
                showAlert("Error", "error", result?.payload?.message);
            }
        });
    };

    const handleReportNavigation = (user) => {
        const updatedRoute = {
            buddy_name: user?.user_name,
            route: SCREENS.CHAT,
            ...(role === "USER" ? { buddy_id: user?.user_id } : { user_id: user?.user_id })
        };

        dispatch(setRoute(updatedRoute));
        resetNavigation(navigation, SCREENS.REPORT_BUDDY);
    };

    const handleDeleteChat = (contactId) => {
        handleDeleteCloseModal();
        const userId = parseInt(user_id);
        const contactToDelete = parseInt(contactId);
        if (socket) {
            socket.emit("removeContact", { userId, contactId: contactToDelete });
            const updatedContacts = allContacts?.filter(contact => contact.userId !== contactId);
            setAllContacts(updatedContacts);
            setFilteredContacts(updatedContacts);
        }


    }

    const clearSearch = () => {
        setIsSearching(false)
        setSearchQuery('');
        setFilteredContacts(allContacts);
    };


    const QuickActions = (index, item) => {
        return (
            <View style={styles.qaContainer}>
                <TouchableOpacity
                    style={styles.swiperButton}
                    onPress={() => {
                        setSelectedUser({
                            ...selectedUser,
                            user_name: item?.fullName,
                            user_id: item?.userId,
                            blockStatus: item?.blockStatus
                        });
                        handleBlockOpenModal();
                    }}>
                    <Image
                        style={styles.icon}
                        source={blockUserChat} />
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.swiperButton}
                    onPress={() => {
                        setSelectedUser(prevState => {
                            const updatedUser = {
                                ...prevState,
                                user_name: item?.fullName,
                                user_id: item?.userId,
                                blockStatus: item?.blockStatus
                            };
                            handleReportNavigation(updatedUser);
                            return updatedUser;
                        });
                    }}>
                    <Image
                        style={styles.icon}
                        source={reportChat} />
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.swiperButton}
                    onPress={() => {
                        setSelectedUser({
                            ...selectedUser,
                            user_name: item?.fullName,
                            user_id: item?.userId,
                            blockStatus: item?.blockStatus
                        });
                        handleDeleteOpenModal();
                    }}>
                    <Image
                        style={styles.icon}
                        source={deleteChat} />
                </TouchableOpacity>
            </View>
        );
    };

    const renderSkeleton = () => {
        return <SkeletonPlaceholder speed={900}
            backgroundColor={theme.dark.inputBg}>
            <View style={styles.item}>
                <View style={[styles.avatar]}>
                    <SkeletonPlaceholder.Item width={50} height={50} borderRadius={25} />
                    {/* <SkeletonPlaceholder.Item width={10} height={10} borderRadius={5} style={styles.greenDot} /> */}
                </View>
                <View style={styles.messageContainer}>
                    <View style={[styles.nameAndTime, { flex: 1 }]}>
                        <SkeletonPlaceholder.Item width={120} height={20} borderRadius={4} />
                        <SkeletonPlaceholder.Item width={50} height={20} borderRadius={4} />
                    </View>
                    <View style={styles.textContainer}>
                        <SkeletonPlaceholder.Item width={200} height={20} borderRadius={4} />
                        <SkeletonPlaceholder.Item width={30} height={20} borderRadius={4} />
                    </View>
                </View>
            </View>
        </SkeletonPlaceholder>

    }

    const renderSkeletons = () => {
        return Array.from({ length: 10 }).map((_, index) => (
            <React.Fragment key={index}>
                {renderSkeleton()}
            </React.Fragment>
        ));
    };

    const Item = ({ item }) => {
        return (
            <TouchableOpacity
                activeOpacity={1}
                onPress={() => {
                    handleChatNavigation(item);
                }}>
                <View style={styles.item}>
                    <View style={styles.avatar}>
                        <Image source={{ uri: item?.images[0]?.image_url }} style={styles.avatarImage} />
                        {/* {item?.status !== "offline" && <View style={styles.greenDot} />} */}
                    </View>
                    <View style={styles.messageContainer}>
                        <View style={styles.nameAndTime}>
                            <Text style={styles.name} numberOfLines={1}>
                                {item?.fullName}
                            </Text>
                            {item?.lastMessageTimestamp != null && <Text style={styles.time}>
                                {moment(item?.lastMessageTimestamp).fromNow()}
                            </Text>}
                        </View>
                        <View style={styles.textContainer}>
                            <Text style={styles.text}>
                                {item?.lastMessage}
                            </Text>
                            {item?.unreadCount > 0 && (
                                <View style={styles.countContainer}>
                                    <Text style={styles.count}>
                                        {item?.unreadCount}
                                    </Text>
                                </View>
                            )}
                        </View>
                    </View>
                </View>
            </TouchableOpacity>
        );
    };

    const renderLoader = () => {
        return <FullScreenLoader loading={contactLoader} />
    }

    return (
        <>
            {/* <StatusBar barStyle="dark-content" /> */}
            <SafeAreaView style={styles.container}>
                <View style={styles.headerContainer}>
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
                                placeholder="Search contacts..."
                                placeholderTextColor={theme.dark.inputLabel}
                                value={searchQuery}
                                onChangeText={handleSearchChange}
                                autoFocus={true}

                            />
                        </Animatable.View>
                    ) : (
                        <>
                            <Image style={styles.homeLogo} source={homeLogo} resizeMode='contain' />
                            <Text style={styles.headerText}>Chat</Text>
                            <TouchableOpacity onPress={() => setIsSearching(true)}>
                                <Image style={styles.searchServices} source={searchServices} />
                            </TouchableOpacity>
                        </>
                    )}
                </View>
                <WarningBanner />
                <HorizontalDivider customStyle={{ marginVertical: 5 }} />
                {
                    contactLoader ? renderLoader() : filteredContacts?.length > 0 ? <SwipeableFlatList
                        keyExtractor={extractItemKey}
                        data={filteredContacts}
                        renderItem={({ item }) => (
                            <Item item={item} />
                        )}
                        maxSwipeDistance={240}
                        renderQuickActions={({ index, item }) => QuickActions(index, item)}
                        contentContainerStyle={styles.contentContainerStyle}
                         shouldBounceOnMount={false}
                    /> : <EmptyListComponent
                        customTitleStyle={{
                            top: 0
                        }}
                        isImage={false}
                        title={"Contact's not available."} />
                }

                <CustomModal
                    isVisible={modalVisible}
                    onClose={handleBlockCloseModal}
                    headerTitle={`${selectedUser?.blockStatus ? `Unblock ${blockTitle}` : `Block ${blockTitle}`}`}
                    imageSource={blockUser}
                    isParallelButton={true}
                    text={`Are you sure you want to ${selectedUser?.blockStatus ? "Unblock" : "Block"} ${selectedUser?.user_name}?`}
                    parallelButtonText1={"Cancel"}
                    parallelButtonText2={selectedUser?.blockStatus ? "Unblock" : "Yes, Block"}
                    parallelButtonPress1={() => {
                        handleBlockCloseModal();
                    }}
                    parallelButtonPress2={() => {
                        handleBlockUser(selectedUser?.user_id);
                    }}
                />

                <CustomModal
                    isVisible={deleteModal}
                    onClose={handleDeleteCloseModal}
                    headerTitle={"Delete Chat?"}
                    imageSource={deleteUser}
                    isParallelButton={true}
                    text={`Are you sure you want to delete this chat?`}
                    parallelButtonText1={"Cancel"}
                    parallelButtonText2={"Yes, Delete"}
                    parallelButtonPress1={() => {
                        handleDeleteCloseModal();
                    }}
                    parallelButtonPress2={() => {
                        handleDeleteChat(selectedUser?.user_id);
                    }}
                />
            </SafeAreaView>
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.dark.primary,
    },
    headerContainer: {
        height: 70,
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: 'row'
    },
    headerText: {
        fontSize: scaleHeight(26),
        fontFamily: fonts.fontsType.semiBold,
        color: theme.dark.secondary,
    },
    homeLogo: {
        width: scaleWidth(30),
        height: scaleHeight(35),
        alignSelf: 'center',
        left: scaleWidth(30)
    },
    searchServices: {
        width: scaleWidth(27),
        height: scaleHeight(27),
        alignSelf: 'center',
        right: scaleWidth(30)
    },
    item: {
        backgroundColor: theme.dark.primary,
        flexDirection: 'row',
        padding: 10,
    },
    messageContainer: {
        flex: 1,
    },
    nameAndTime: {
        flexDirection: 'row',
    },
    name: {
        fontSize: 16,
        color: theme.dark.white,
        fontFamily: fonts.fontsType.medium,
        flex: 1
    },
    time: {
        fontSize: 12,
        color: theme.dark.inputLabel,
        fontFamily: fonts.fontsType.regular,
    },
    textContainer: {
        flexDirection: 'row'
    },
    text: {
        fontSize: 13,
        color: theme.dark.inputLabel,
        fontFamily: fonts.fontsType.light,
        flex: 1
    },
    countContainer: {
        backgroundColor: theme.dark.secondary,
        height: 20,
        width: 20,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    count: {
        fontSize: 11,
        color: theme.dark.primary,
        fontFamily: fonts.fontsType.medium,
    },
    avatar: {
        width: 45,
        height: 45,
        borderRadius: 25,
        marginRight: 7,
        alignSelf: 'center',
    },
    avatarImage: {
        width: 45,
        height: 45,
        borderRadius: 25,
        alignSelf: 'center'
    },
    qaContainer: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginEnd: scaleWidth(20),
    },
    swiperButton: {
        alignSelf: 'center',
        marginBottom: scaleHeight(15)
    },
    icon: {
        width: 36,
        height: 36,
        marginTop: 25,
        marginLeft: 20
    },
    contentContainerStyle: {
        flexGrow: 1,
        backgroundColor: theme.dark.primary,
        marginHorizontal: 20
    },
    greenDot: {
        position: 'absolute',
        bottom: 2,
        right: 0,
        height: 8,
        width: 8,
        borderRadius: 4,
        backgroundColor: '#00CD46',
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

    },
    backButton: {
        marginRight: 10,
        alignSelf: 'center',
    },
});

export default Chat;
