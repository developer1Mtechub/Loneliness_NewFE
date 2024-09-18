import React, { useState, useRef } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import { Icon } from 'react-native-elements';
import { theme } from '../../../../assets';
import DetailItem from '../../../../components/DetailItem';
import Button from '../../../../components/ButtonComponent';
import { resetNavigation } from '../../../../utils/resetNavigation';
import { scaleHeight } from '../../../../styles/responsive';
import fonts from '../../../../styles/fonts';
import Header from '../../../../components/Header';
import HorizontalDivider from '../../../../components/HorizontalDivider';
import { SCREENS } from '../../../../constant/constants';
import useBackHandler from '../../../../utils/useBackHandler';
import CustomTextInput from '../../../../components/TextInputComponent';
import { TextInput } from 'react-native-gesture-handler';
import { useAlert } from '../../../../providers/AlertContext';
import CustomLayout from '../../../../components/CustomLayout';
import { useDispatch, useSelector } from 'react-redux';
import { requestBackBuddy } from '../../../../redux/BuddyDashboard/requestBackBuddySlice';
import { setRoute } from '../../../../redux/appSlice';
import DateTimePicker from '../../../../components/DateTimePicker';
import moment from 'moment';

const BuddySendRequest = ({ navigation }) => {
    const dispatch = useDispatch();
    const { currentRoute } = useSelector((state) => state.app)
    const { loading } = useSelector((state) => state.requestBackBuddy)
    const { showAlert } = useAlert();
    const [form, setForm] = useState({
        date: new Date(),
        time: new Date(),
        location: ''
    });

    const handleChange = (name, value) => {
        setForm({ ...form, [name]: value });
    };

    const handleBackPress = () => {
        const payload = {
            request_id: currentRoute?.request_id,
            route: SCREENS.MAIN_DASHBOARD
        }
        dispatch(setRoute(payload))
        resetNavigation(navigation, currentRoute?.route)
        return true;
    };
    useBackHandler(handleBackPress);

    const handleSendRequest = () => {

        if (form?.location === '') {
            showAlert("Error", "error", "Location is required.")
            return
        }

        if (form?.date === '') {
            showAlert("Error", "error", "Date of service is required.")
            return
        }

        if (form?.time === '') {
            showAlert("Error", "error", "Time of service is required.")
            return
        }

        const dateOfService = moment(form?.date).format('YYYY-MM-DD');
        const timeOfService = moment(form?.time).format('hh:mm:ss A');

        const requestBackPayload = {
            request_id: currentRoute?.request_id,
            booking_date: dateOfService,
            booking_time: timeOfService,
            location: form.location
        }

        dispatch(requestBackBuddy(requestBackPayload)).then((result) => {
            if (result?.payload?.status === "success") {
                showAlert("Success", "success", result?.payload?.message)
                setTimeout(() => {
                    handleBackPress();
                }, 3000);
            } else {
                showAlert("Error", "error", result?.payload?.message)
            }
        })



    }

    return (
        <SafeAreaView style={styles.mianContainer}>
            <Header
                onPress={() => {
                    handleBackPress();
                }}
                title={"Send Request"}
            />

            <View style={styles.container}>

                <CustomLayout>

                    <CustomTextInput
                        label={'Location'}
                        identifier={'location'}
                        value={form.location}
                        onValueChange={(value) => handleChange('location', value)}
                        mainContainer={{ marginTop: 10 }}
                    />
                    <Text style={styles.label}>{'Date of Service'}</Text>
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
                </CustomLayout>
            </View>

            <Button
                loading={loading}
                onPress={() => {
                    handleSendRequest()
                }}
                customStyle={{
                    width: '80%',
                    marginBottom: scaleHeight(60)
                }}
                title={"Send Request"} />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    mianContainer: {
        flex: 1,
        backgroundColor: theme.dark.primary,
    },
    container: {
        flex: 1,
        padding: 20,
    },
    verticleLine: {
        height: '60%',
        width: 1,
        backgroundColor: '#909090',
        alignSelf: 'center'
    },
    label: {
        fontFamily: fonts.fontsType.medium,
        fontSize: scaleHeight(17),
        color: theme.dark.inputLabel,
        marginHorizontal: 8,
        top: scaleHeight(20)
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
        height: scaleHeight(55),
        borderRadius: 30,
        borderWidth: 1,
        borderColor: theme.dark.text,
        justifyContent: 'space-evenly'
    },

});

export default BuddySendRequest;
