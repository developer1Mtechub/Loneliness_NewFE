import React, { useEffect, useRef, useState } from 'react';
import { SafeAreaView, Text, StyleSheet, View, FlatList, RefreshControl, ScrollView, Image, TouchableOpacity } from 'react-native';
import { theme } from '../../../../../assets';
import Header from '../../../../../components/Header';
import { resetNavigation } from '../../../../../utils/resetNavigation';
import { SCREENS } from '../../../../../constant/constants';
import useBackHandler from '../../../../../utils/useBackHandler';
import TransactionListItem from '../../../../../components/TransactionListItem';
import { getTransactionHistory } from '../../../../../redux/PaymentSlices/getTransactionHistorySlice';
import { useDispatch, useSelector } from 'react-redux';
import FullScreenLoader from '../../../../../components/FullScreenLoader';
import EmptyListComponent from '../../../../../components/EmptyListComponent';
import fonts from '../../../../../styles/fonts';
import { scaleHeight, scaleWidth } from '../../../../../styles/responsive';
import Button from '../../../../../components/ButtonComponent';
import { bottomWalletImg, topWalletImg } from '../../../../../assets/images';
import HorizontalDivider from '../../../../../components/HorizontalDivider';
import RBSheet from 'react-native-raw-bottom-sheet';
import { CrossWhite } from '../../../../../assets/svgs';
import CustomTextInput from '../../../../../components/TextInputComponent';
import { withdrawAmount } from '../../../../../redux/PaymentSlices/withdrawAmountSlice';
import { useAlert } from '../../../../../providers/AlertContext';
import ButtonGroup from '../../../../../components/ButtonGroup';

const MyWallet = ({ navigation }) => {
    const dispatch = useDispatch();
    const { showAlert } = useAlert();
    const { transactions, loading, currentPage, totalPages, walletAmount } = useSelector((state) => state.getTransactionHistory);
    const { loading: amountLoading } = useSelector((state) => state.withdrawAmount)
    const { role } = useSelector((state) => state.auth)
    const [selectedIndex, setSelectedIndex] = useState(0);
    const buttons = ['Transaction History', 'Refund History'];
    const [page, setPage] = useState(1);
    const [refreshing, setRefreshing] = useState(false);
    const [loader, setLoader] = useState(true);
    const [isRefund, setIsRefund] = useState(false);
    const [amount, setAmount] = useState('');
    const [amountError, setAmountError] = useState('');
    const refRBSheet = useRef();


    const handleBackPress = () => {
        resetNavigation(navigation, SCREENS.MAIN_DASHBOARD, { screen: SCREENS.PROFILE });
        return true;
    };
    useBackHandler(handleBackPress);


    useEffect(() => {
        const timer = setTimeout(() => {
            setLoader(false);
        }, 3000);

        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        dispatch(getTransactionHistory({ page, limit: 10, is_refunded: isRefund }));
    }, [dispatch, page, isRefund]);

    const onRefresh = () => {
        setRefreshing(true);
        setPage(1); // Reset to first page
        dispatch(getTransactionHistory({ page, limit: 10, is_refunded: isRefund }))
            .then(() => setRefreshing(false))
            .catch(() => setRefreshing(false));
    };

    const handleLoadMore = () => {
        if (currentPage < totalPages && !loading) {
            setPage((prevPage) => prevPage + 1);
        }
    };

    const renderItem = ({ item, index }) => (
        <TransactionListItem item={item} index={index} />
    );

    const showLoader = () => {
        return <FullScreenLoader
            title={"Please wait..."}
            loading={loader} />;
    };

    const showFooterSpinner = () => {
        return <FullScreenLoader
            spinnerStyle={styles.footerSpinner}
            loading={loading} />;
    };

    const handleSheetOpen = () => {
        refRBSheet.current.open()

    };

    const handleSheetClose = () => {
        setAmount('');
        setAmountError('');
        refRBSheet.current.close()
    };

    const handleWithdrawPayment = () => {

        if (amount === '') {
            setAmountError('Please enter amount.')
            return
        }

        const payload = {
            amount: amount
        }
        dispatch(withdrawAmount(payload)).then((result) => {

            if (result?.payload?.status === "success") {
                handleSheetClose();
                showAlert("Success", "success", result?.payload?.message);
                setTimeout(() => {
                    handleBackPress();
                }, 3000);

            } else if (result?.payload?.status === "error") {
                showAlert("Error", "error", result?.payload?.message)
            }

        })

    }

    const handleSelectedChange = (button, index) => {
        setSelectedIndex(index)
        if (index == 0) {
            setIsRefund(false)
        } else if (index == 1) {
            setIsRefund(true)
        }
        //setCurrentIndex(index)
        console.log(`Selected Index: ${index}`)
    };


    const renderSheet = () => {
        return (
            <RBSheet
                ref={refRBSheet}
                openDuration={1000}
                customStyles={{
                    wrapper: styles.wrapper,
                    container: [styles.sheetContainer, { backgroundColor: theme.dark.background }]
                }}
            >
                <View style={styles.header}>
                    <Text style={styles.sheetHeaderText}>{role === "USER" ? "Add Amount" : "Withdraw"}</Text>
                    <TouchableOpacity onPress={handleSheetClose} style={styles.closeButton}>
                        <CrossWhite />
                    </TouchableOpacity>
                </View>
                <HorizontalDivider />
                <View style={styles.content}>
                    <CustomTextInput
                        label={"Enter Amount"}
                        identifier={"amount"}
                        inputType={'number-pad'}
                        value={amount}
                        onValueChange={setAmount}
                    />
                    <Text style={styles.errorText}>{amountError}</Text>
                    <Button
                        loading={amountLoading}
                        onPress={handleWithdrawPayment}
                        title={role === "USER" ? "Add" : "Withdraw"}
                        customStyle={styles.button}
                    />
                </View>
            </RBSheet>
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <Header
                onPress={handleBackPress}
                title={"My Wallet"}
                customTextStyle={styles.headerText} />

            <View style={styles.walletContainer}>

                <View style={[styles.walletCard, role === 'USER' && { justifyContent: 'center' }]}>
                    <Text style={[styles.walletAmount, { marginTop: role === 'USER' ? 0 : 20 }]}>
                        {`$${walletAmount}`}
                    </Text>
                    <Text style={styles.totalBalance}>
                        Total Balance
                    </Text>
                    {role === "BUDDY" && <Button
                        onPress={() => { handleSheetOpen() }}
                        title={role === "USER" ? "Top-Up" : "Withdraw"}
                        customStyle={styles.withdrawButton}
                        textCustomStyle={styles.withdrawButtonText}
                    />}
                </View>
                <Image style={styles.bottomWalletImg} source={bottomWalletImg} />
                <Image style={styles.topWalletImg} source={topWalletImg} />
            </View>

            {role === "USER" && <ButtonGroup
                onSelectedChange={handleSelectedChange}
                buttons={buttons}
                selectedIndex={selectedIndex}
                customStyle={{ marginHorizontal: 20, top: 10, marginBottom: 20 }}
            />}

            {transactions?.length > 0 && role !== "USER" && <View style={styles.transactionHistoryContainer}>
                <Text style={styles.transactionHistoryText}>
                    Transaction History
                </Text>
            </View>}

            {loader && !refreshing ? showLoader() :
                transactions?.length > 0 ? (
                    <FlatList
                        data={transactions}
                        renderItem={renderItem}
                        keyExtractor={(item, index) => item + index}
                        onEndReached={handleLoadMore}
                        onEndReachedThreshold={0.5}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={styles.flatListContent}
                        ListFooterComponent={loading && !refreshing && showFooterSpinner}
                        refreshControl={
                            <RefreshControl
                                refreshing={refreshing}
                                onRefresh={onRefresh}
                                colors={[theme.dark.primary]}
                                progressBackgroundColor={theme.dark.secondary}
                            />
                        }
                    />
                ) : (
                    <ScrollView
                        contentContainerStyle={styles.scrollViewContent}
                        refreshControl={
                            <RefreshControl
                                refreshing={refreshing}
                                onRefresh={onRefresh}
                                colors={[theme.dark.primary]}
                                progressBackgroundColor={theme.dark.secondary}
                            />
                        }
                    >
                        <EmptyListComponent title={"Transactions not avaibale."} />
                    </ScrollView>
                )
            }
            {renderSheet()}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.dark.primary,
    },
    headerText: {
        marginStart: '24%',
    },
    walletContainer: {
        paddingHorizontal: 25,
        marginTop: 20
    },
    walletCard: {
        backgroundColor: theme.dark.secondary,
        width: '100%',
        height: scaleHeight(150),
        borderRadius: 12,
    },
    walletAmount: {
        fontFamily: fonts.fontsType.semiBold,
        fontSize: scaleHeight(24),
        color: theme.dark.primary,
        alignSelf: 'center',
        marginTop: 20,
    },
    totalBalance: {
        fontFamily: fonts.fontsType.regular,
        fontSize: scaleHeight(13),
        color: theme.dark.labelColor,
        alignSelf: 'center',
        top: 5,
    },
    withdrawButton: {
        backgroundColor: theme.dark.primary,
        width: '35%',
    },
    withdrawButtonText: {
        color: theme.dark.secondary,
    },
    bottomWalletImg: {
        width: scaleWidth(78),
        height: scaleHeight(78),
        position: 'absolute',
        bottom: 0,
        left: 10,
    },
    topWalletImg: {
        width: scaleWidth(78),
        height: scaleHeight(78),
        position: 'absolute',
        top: 0,
        right: 10,
    },
    transactionHistoryContainer: {
        paddingHorizontal: 25,
        marginTop: 20,
    },
    transactionHistoryText: {
        fontFamily: fonts.fontsType.semiBold,
        fontSize: scaleHeight(18),
        color: theme.dark.white,
    },
    flatListContent: {
        paddingHorizontal: 25,
        paddingBottom: 20
    },
    footerSpinner: {
        width: scaleWidth(120),
        height: scaleHeight(120),
    },
    scrollViewContent: {
        flex: 1,
    },
    wrapper: {
        backgroundColor: 'rgba(128, 128, 128, 0.80)',
    },
    sheetContainer: {
        borderTopEndRadius: 30,
        borderTopStartRadius: 30,
        width: '100%',
        alignSelf: 'center'
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    },
    sheetHeaderText: {
        fontFamily: fonts.fontsType.medium,
        color: theme.dark.white,
        fontSize: scaleHeight(20),
        textAlign: 'center',
        alignSelf: 'center',
        flex: 1,
    },
    closeButton: {
        alignSelf: 'flex-end'
    },
    content: {
        paddingHorizontal: 20
    },
    errorText: {
        fontFamily: fonts.fontsType.regular,
        color: theme.dark.error,
        fontSize: scaleHeight(13),
        marginHorizontal: 5
    },
    button: {
        width: '100%',
        marginBottom: 0,
        marginTop: 10
    }
});

export default MyWallet;
