import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, Image, TextInput } from 'react-native';
import { resetNavigation } from '../../../utils/resetNavigation';
import { SCREENS } from '../../../constant/constants';
import useBackHandler from '../../../utils/useBackHandler';
import { theme } from '../../../assets';
import CustomLayout from '../../../components/CustomLayout';
import fonts from '../../../styles/fonts';
import { normalizeFontSize, scaleHeight, scaleWidth } from '../../../styles/responsive';
import HorizontalDivider from '../../../components/HorizontalDivider';
import Button from '../../../components/ButtonComponent';
import ProfileProgressBar from '../../../components/ProfileProgressBar';
import { birthdayImg } from '../../../assets/images';
import { useDispatch, useSelector } from 'react-redux';
import { setDataPayload } from '../../../redux/appSlice';
import DateTimePicker from '../../../components/DateTimePicker';
import moment from 'moment';

const BuddyBirthDate = ({ navigation }) => {
    const dispatch = useDispatch();
    const { dataPayload } = useSelector((state) => state.app);
    const [form, setForm] = useState({ date: new Date() });
    const [errors, setErrors] = useState({ birthDate: '' });

    const handleChange = (name, value) => {
        setForm({ ...form, [name]: value });
    };

    const handleBackPress = () => {
        resetNavigation(navigation, SCREENS.BUDDY_ABOUT)
        return true;
    };
    useBackHandler(handleBackPress);

    useEffect(() => {
        if (dataPayload?.birthDate) {
            setForm({
                date: dataPayload?.birthDate
            })
        }

    }, [dataPayload]);

    const handlebirthDate = () => {
        const { date } = form;

        validateDateOfBirth(moment(date).format('YYYY-MM-DD'))

        if (errors?.birthDate) {
            return;
        }
        const birthDate = moment(date).format('YYYY-MM-DD');
        const newPayload = { ...dataPayload, birthDate };
        dispatch(setDataPayload(newPayload));
        resetNavigation(navigation, SCREENS.BUDDY_GENDER_SELECTION)
    };


    const validateDateOfBirth = (dob) => {
        const birthDate = moment(dob, 'YYYY-MM-DD');
        const currentDate = moment();
        const age = currentDate.diff(birthDate, 'years');
        if (age < 18) {
            setErrors(prevErrors => ({
                ...prevErrors,
                birthDate: 'You must be at least 18 years old',
            }));
        } else {
            setErrors(prevErrors => ({
                ...prevErrors,
                birthDate: '',
            }));
        }
    };


    return (
        <SafeAreaView style={styles.container}>
            <ProfileProgressBar progress={50} onPress={() => {
                resetNavigation(navigation, SCREENS.BUDDY_ABOUT)
            }} />
            <CustomLayout>
                <View style={styles.contentContainer}>
                    <Text style={styles.welcomeText}>
                        Let’s Celebrate You!
                    </Text>
                    <Text style={styles.subTitle}>
                        Tell us your birthday. Your profile doesn’t display your birthday, only your age.
                    </Text>
                    <Image style={styles.imageStyle} source={birthdayImg} />

                    <DateTimePicker
                        mode="date"
                        date={new Date(form.date)}
                        onDateChange={(date) => {
                            handleChange('date', date)
                            validateDateOfBirth(moment(date).format('YYYY-MM-DD'))
                        }}
                        placeholder="Select Date"
                        customText={{
                            fontSize: normalizeFontSize(18),
                        }}
                    />
                    {errors.birthDate ? <Text style={styles.errorText}>{errors.birthDate}</Text> : null}
                </View>



            </CustomLayout>

            <View style={styles.buttonContainer}>

                <HorizontalDivider
                    customStyle={{
                        marginTop: 40
                    }} />

                <Button
                    onPress={() => {
                        handlebirthDate();
                    }}
                    title={'Continue'}
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
    buttonContainer: {
        width: '90%',
        alignSelf: 'center',
        // marginTop: scaleHeight(200),
        // marginBottom: scaleHeight(20)
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
        height: scaleHeight(55),
        borderRadius: 30,
        borderWidth: 1,
        borderColor: theme.dark.text,
        justifyContent: 'space-evenly'
    },
    imageStyle: {
        width: scaleWidth(90),
        height: scaleHeight(100),
        marginTop: scaleHeight(30),
        alignSelf: 'center'
    },
    errorText: {
        fontFamily: fonts.fontsType.regular,
        fontSize: scaleHeight(14),
        color: theme.dark.error,
        marginTop: 8,
        marginHorizontal: scaleWidth(10),
    },
});


export default BuddyBirthDate;
