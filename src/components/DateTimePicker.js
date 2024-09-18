// DateTimePicker.js
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import DatePicker from 'react-native-date-picker';
import moment from 'moment';
import { scaleHeight } from '../styles/responsive';
import fonts from '../styles/fonts';
import { theme } from '../assets';

const DateTimePicker = ({
    mode = 'date', // 'date' or 'time'
    date,
    onDateChange,
    placeholder,
    containerStyle,
    customText,
    ...props
}) => {
    const [showPicker, setShowPicker] = useState(false);

    const handleConfirm = (date) => {
        onDateChange(date);
        setShowPicker(false);
    };

    return (
        <View style={[styles.container, containerStyle]}>
            <TouchableOpacity onPress={() => setShowPicker(true)} style={styles.inputContainerStyle}>
                <Text style={[styles.dateTimeText, customText]}>{date ? moment(date).format(mode === 'date' ? 'DD-MM-YYYY' : 'h:mm A') : placeholder}</Text>
            </TouchableOpacity>
            {showPicker && (
                <DatePicker
                    modal
                    mode={mode}
                    open={showPicker}
                    date={date}
                    onConfirm={handleConfirm}
                    onCancel={() => setShowPicker(false)}
                    theme='dark'
                    {...props}
                    minuteInterval={5}
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: 0,
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
    dateTimeText: {
        fontFamily: fonts.fontsType.medium,
        fontSize: scaleHeight(16),
        color: theme.dark.inputLabel,
        marginHorizontal: 20

    }
});

export default DateTimePicker;
