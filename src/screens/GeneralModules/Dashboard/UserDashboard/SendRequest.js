import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, TextInput } from 'react-native';
import { SCREENS } from '../../../../constant/constants';
import CustomLayout from '../../../../components/CustomLayout';
import fonts from '../../../../styles/fonts';
import { scaleHeight } from '../../../../styles/responsive';
import HorizontalDivider from '../../../../components/HorizontalDivider';
import Button from '../../../../components/ButtonComponent';
import Icon from 'react-native-vector-icons/MaterialIcons'
import { theme } from '../../../../assets';
import useBackHandler from '../../../../utils/useBackHandler';
import { resetNavigation } from '../../../../utils/resetNavigation';
import CategoryList from '../../../../components/CategoryList';
import CustomTextInput from '../../../../components/TextInputComponent';
import { useAlert } from '../../../../providers/AlertContext';
import { useDispatch, useSelector } from 'react-redux';
import { sendRequest } from '../../../../redux/UserDashboard/sendRequestSlice';
import { Dropdown } from 'react-native-element-dropdown';
import { getTransactionHistory } from '../../../../redux/PaymentSlices/getTransactionHistorySlice';
import { setRoute } from '../../../../redux/appSlice';
import WarningBanner from '../../../../components/WarningBanner';
import DatePicker from 'react-native-date-picker';
import moment from 'moment';
import DateTimePicker from '../../../../components/DateTimePicker';

const data = [
    { label: 'Card', value: 'CARD', description: 'The full amount will be charged to your card.' },
    { label: 'Wallet', value: 'WALLET', description: 'The total payment will be deducted from your wallet balance.' },
];

const SendRequest = ({ navigation }) => {
    const dispatch = useDispatch();
    const { loading } = useSelector((state) => state.sendRequest)
    const { walletAmount } = useSelector((state) => state.getTransactionHistory);
    const { currentRoute } = useSelector((state) => state.app)
    const { userLoginInfo } = useSelector((state) => state.auth)
    const { showAlert } = useAlert();
    const [category, setCategory] = useState('');
    const [selectedValue, setSelectedValue] = useState('');
    const [description, setDescription] = useState('');
    const { id } = userLoginInfo?.user
    const [form, setForm] = useState({
        date: new Date(),
        time: new Date(),
        location: '',
        number_of_hours: ''
    });
    const [errors, setErrors] = useState({
        date: '',
        time: '',
        location: '',
        number_of_hours: ''
    });

    const handleBackPress = () => {
        resetNavigation(navigation, currentRoute?.route, { screen: SCREENS.HOME })
        return true;
    };
    useBackHandler(handleBackPress);

    const handleCategoryPress = (item) => {
        setCategory(item?.id)
    };

    const handleChange = (name, value) => {

        let error = '';
        setForm({ ...form, [name]: value });
        if (name === 'location') {
            if (value === '') {
                error = 'Location field is required.';
            }
        }
        else if (name === 'number_of_hours') {
            if (value === '') {
                error = 'No. of hours is required.';
            }
        }
        setErrors({ ...errors, [name]: error });

    };


    const handleSendRequest = () => {
        let isValid = true;
        const newErrors = {};

        ['date', 'time'].forEach(field => {
            if (!form[field]) {
                newErrors[field] = `${field.charAt(0).toUpperCase() + field.slice(1)} is required`;
                isValid = false;
            }
        });

        ['location', 'number_of_hours'].forEach(field => {
            if (form[field] === '') {
                newErrors[field] = `${field.charAt(0).toUpperCase() + field.slice(1)} field is required`;
                isValid = false;
            }
        });

        setErrors(newErrors);

        if (isValid) {
            const { location, number_of_hours, date, time } = form
            const booking_date = moment(date).format('YYYY-MM-DD');
            const booking_time = moment(time).format('hh:mm:ss A');
            let booking_price = parseInt(number_of_hours * currentRoute?.hourly_rate)
            let finalWalletAmount = parseFloat(walletAmount);

            if (finalWalletAmount < booking_price) {
                showAlert("Error", "error", "Insufficient funds in wallet for this transaction!")
                return
            }
            const payload = {
                buddy_id: currentRoute?.buddy_id,
                category_id: category,
                booking_date: booking_date,
                booking_time: booking_time,
                hours: number_of_hours,
                location: location,
                booking_price: booking_price,
                method: "WALLET"
            }

            dispatch(sendRequest(payload)).then((result) => {
                if (result?.payload?.status === "success") {
                    showAlert("Success", "success", result?.payload?.message);
                    setTimeout(() => {
                        resetNavigation(navigation, SCREENS.MAIN_DASHBOARD, { screen: SCREENS.HOME })
                    }, 3000);

                }

                else if (result?.payload?.errors) {
                    showAlert("Error", "error", result?.payload?.errors);
                }

                else if (result?.payload?.status === "error") {
                    showAlert("Error", "error", result?.payload?.message);
                }
            })



        } else {
            showAlert("Error", "error", "Please fill in all required fields.");
        }
    };

    const handleCardPayment = () => {
        let isValid = true;
        const newErrors = {};
        ['date', 'time'].forEach(field => {
            if (!form[field]) {
                newErrors[field] = `${field.charAt(0).toUpperCase() + field.slice(1)} is required`;
                isValid = false;
            }
        });

        ['location', 'number_of_hours'].forEach(field => {
            if (form[field] === '') {
                newErrors[field] = `${field.charAt(0).toUpperCase() + field.slice(1)} field is required`;
                isValid = false;
            }
        });

        setErrors(newErrors);

        if (isValid) {

            const { date, time, location, number_of_hours } = form;
            const booking_date = moment(date).format('YYYY-MM-DD');
            const booking_time = moment(time).format('hh:mm:ss A');
            let booking_price = parseInt(number_of_hours * currentRoute?.hourly_rate)
            const payload = {
                route: SCREENS.MAIN_DASHBOARD,
                user_id: id,
                isSubscription: false,
                buddy_id: currentRoute?.buddy_id,
                category_id: category,
                booking_date: booking_date,
                booking_time: booking_time,
                hours: number_of_hours,
                location: location,
                booking_price: booking_price,
                isRequestPayment: true,
                amount: booking_price
            }
            dispatch(setRoute(payload))
            resetNavigation(navigation, SCREENS.PAYPAL_WEBVIEW)

        } else {
            showAlert("Error", "error", "Please fill in all required fields.");
        }
    };

    const handleButtonClick = async () => {
        const booking_price = parseInt(form?.number_of_hours * currentRoute?.hourly_rate);
        const isWalletInsufficient = selectedValue === "WALLET" && walletAmount < booking_price;

        if (selectedValue === "CARD") {
            handleCardPayment()
            // openPaymentSheet(booking_price, handleSendRequest, 'user@gmail.com', 'usd', 'Test User')
            // if (isWalletInsufficient) {
            //     setDescription(`Your wallet balance is ${walletAmount}, the remaining amount would be deducted from the card.`);
            // }
        }
        else {
            handleSendRequest();
        }
    };

    const fetchWalletAmount = () => {
        dispatch(getTransactionHistory({ page: 1, limit: 1, is_refunded: false }));
    }

    const renderItem = item => {
        return (
            <View style={styles.item}>
                <Text style={styles.textItem}>{item.label}</Text>
                {item.value === selectedValue && (
                    <Icon
                        color={theme.dark.secondary}
                        name="check-circle"
                        size={20}
                    />
                )}

            </View>
        );
    };


    return (
        <SafeAreaView style={styles.container}>
            <TouchableOpacity
                onPress={() => {
                    handleBackPress()
                }}
                style={styles.backButton}>
                <Icon name={'arrow-back'} size={28} color={theme.dark.secondary} />
            </TouchableOpacity>
            <WarningBanner />
            <CustomLayout>
                <View style={styles.contentContainer}>
                    <Text style={styles.welcomeText}>
                        Send Request
                    </Text>
                    <Text style={styles.subTitle}>
                        You're just one step away from getting the service you want.
                    </Text>
                    <Text style={styles.categoryText}>
                        Select Category
                    </Text>
                    <CategoryList
                        categories={currentRoute?.categories}
                        onPress={handleCategoryPress} />

                    <Text style={styles.label}>{"Date of Services"}</Text>
                    <DateTimePicker
                        mode="date"
                        date={form.date}
                        onDateChange={(date) => handleChange('date', date)}
                        placeholder="Select Date"
                    />
                    <Text style={styles.label}>{"Time of Services"}</Text>
                    <DateTimePicker
                        mode="time"
                        date={form.time}
                        onDateChange={(time) => handleChange('time', time)}
                        placeholder="Select Time"
                    />
                    <CustomTextInput
                        label={'No. of Hours'}
                        identifier={'number_of_hours'}
                        inputType='number-pad'
                        value={form.number_of_hours}
                        onValueChange={(value) => handleChange('number_of_hours', value)}
                        mainContainer={{ marginTop: 10 }}
                    />

                    <CustomTextInput
                        label={'Location'}
                        identifier={'location'}
                        value={form.location}
                        onValueChange={(value) => handleChange('location', value)}
                        mainContainer={{ marginTop: 10 }}
                    />

                    <Dropdown
                        style={[styles.dropdown]}
                        placeholderStyle={styles.placeholderStyle}
                        selectedTextStyle={styles.selectedTextStyle}
                        iconStyle={styles.iconStyle}
                        data={data}
                        maxHeight={250}
                        dropdownPosition='top'
                        containerStyle={{
                            backgroundColor: theme.dark.primary,
                            borderColor: theme.dark.inputLabel
                        }}
                        labelField="label"
                        valueField="value"
                        placeholder={'Select Payment Method'}
                        value={selectedValue}
                        onChange={item => {
                            setSelectedValue(item?.value);
                            setDescription(item?.description)
                            if (item?.value === "WALLET") {
                                fetchWalletAmount()
                            }
                            // if (item?.value === "CARD") {
                            //     openPaymentSheet();
                            // }
                        }}
                        renderItem={renderItem}
                    />

                    <Text style={{
                        fontFamily: fonts.fontsType.regular,
                        fontSize: scaleHeight(14),
                        color: theme.dark.success,
                        marginTop: 10,
                        marginHorizontal: 10
                    }}>{description}</Text>


                </View>


            </CustomLayout>
            <View style={styles.buttonContainer}>
                <HorizontalDivider customStyle={{ marginTop: 10 }} />
                <Button
                    loading={loading}
                    onPress={handleButtonClick}
                    title={'Send Request'}
                    customStyle={{ marginBottom: scaleHeight(20) }}
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
        padding: 25,
        flex: 1
    },
    welcomeText: {
        fontFamily: fonts.fontsType.semiBold,
        fontSize: scaleHeight(26),
        color: theme.dark.white,
        marginTop: 15
    },
    subTitle: {
        fontFamily: fonts.fontsType.regular,
        fontSize: scaleHeight(14),
        color: theme.dark.white,
        marginTop: 5
    },
    buttonContainer: {
        width: '90%',
        alignSelf: 'center',
        // marginTop: scaleHeight(-20)
    },
    backButton: {
        paddingHorizontal: 25,
        marginTop: 10
    },
    categoryText: {
        fontFamily: fonts.fontsType.medium,
        fontSize: scaleHeight(16),
        color: theme.dark.inputLabel,
        marginTop: 20
    },
    verticleLine: {
        height: '60%',
        width: 1,
        backgroundColor: '#909090',
    },
    inputStyle: {
        fontFamily: fonts.fontsType.medium,
        fontSize: scaleHeight(18),
        color: theme.dark.inputLabel,
        textAlign: 'center',
        flex: 1
    },
    inputContainerStyle: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: theme.dark.inputBg,
        marginTop: scaleHeight(30),
        height: scaleHeight(45),
        borderRadius: 30,
        borderWidth: 1,
        borderColor: theme.dark.text,
    },
    label: {
        fontFamily: fonts.fontsType.medium,
        fontSize: scaleHeight(17),
        color: theme.dark.inputLabel,
        marginHorizontal: 8,
        top: 18
    },

    dropdown: {
        backgroundColor: theme.dark.inputBg,
        marginTop: scaleHeight(30),
        height: scaleHeight(50),
        borderRadius: 30,
        borderWidth: 1,
        borderColor: theme.dark.text,
        paddingHorizontal: 8,
    },
    iconStyle: {
        width: 20,
        height: 20,
    },
    placeholderStyle: {
        fontSize: scaleHeight(16),
        color: theme.dark.text,
        marginHorizontal: 10
    },
    selectedTextStyle: {
        fontFamily: fonts.fontsType.medium,
        fontSize: scaleHeight(18),
        color: theme.dark.inputLabel,
        marginHorizontal: 10
    },

    item: {
        padding: 17,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: theme.dark.primary,

    },
    textItem: {
        flex: 1,
        fontFamily: fonts.fontsType.medium,
        fontSize: scaleHeight(16),
        color: theme.dark.white
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        zIndex: 100,
        justifyContent: 'center',
        alignItems: 'center',
    },
    cardHeading: {
        fontFamily: fonts.fontsType.semiBold,
        fontSize: 16,
        color: theme.dark.primary,
        alignSelf: 'center',
        marginBottom: 20
    },
    overlayConatiner: {
        backgroundColor: 'white',
        width: '80%',
        height: '25%',
        borderRadius: 16,
        margin: 30
    },
    overlayIcon: {
        alignSelf: 'flex-end',
        left: 4,
        bottom: 4
    },
    customButton: {
        backgroundColor: theme.dark.primary,
        width: '80%',
        marginBottom: 0,
        marginTop: 40
    },
    dateTimeText: {
        fontFamily: fonts.fontsType.medium,
        fontSize: scaleHeight(18),
        color: theme.dark.inputLabel,
        marginHorizontal: 20

    }
});

export default SendRequest;
