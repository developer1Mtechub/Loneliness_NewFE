import React, { useState } from "react";
import { TextInput, View, StyleSheet, Text } from "react-native";
import fonts from "../styles/fonts";
import { theme } from "../assets";
import { scaleHeight } from "../styles/responsive";

const CustomTextInput = ({
    placeholder,
    onValueChange,
    iconComponent,
    customInputStyle,
    customContainerStyle,
    multiline,
    isEditable,
    onPress,
    identifier,
    value,
    inputType,
    leftIcon,
    label,
    mainContainer,
    secureTextEntry,
    placeholderTextStyle,
    customLabelStyle,
    isColorWhite = false
}) => {
    const [text, setText] = useState("");
    const [isFocused, setIsFocused] = useState(false);

    const handleChange = (inputText) => {
        setText(inputText);
        onValueChange(inputText, identifier);  // Pass the identifier to the parent component
    };

    const handleFocus = () => {
        setIsFocused(true);
    };

    const handleBlur = () => {
        setIsFocused(false);
    };

    return (
        <View style={mainContainer}>
            {label && <Text style={[styles.label, customLabelStyle]}>{label}</Text>}
            <View
                style={[
                    styles.container,
                    customContainerStyle,
                    multiline && styles.multilineInput,
                    isFocused && styles.focusedContainer, // Apply focused styles
                ]}
            //onStartShouldSetResponder={onPress}
            >

                {leftIcon}

                <TextInput
                    style={[
                        styles.input,
                        customInputStyle,
                        {
                            textAlignVertical: multiline && "top",
                            // paddingBottom:multiline&& '30%' 
                            color: isFocused && !isColorWhite ? theme.dark.secondary : isColorWhite && isFocused ? theme.dark.white : theme.dark.text // Change text color when focused
                        },
                    ]}
                    editable={isEditable}
                    onPressIn={onPress}
                    placeholder={placeholder}
                    placeholderTextColor={'#BCBCBC'}
                    value={value}
                    onChangeText={handleChange}
                    multiline={multiline}
                    maxLength={multiline && 250}
                    numberOfLines={multiline ? 5 : 1}
                    keyboardType={inputType}
                    secureTextEntry={secureTextEntry}
                    caretHidden={!!onPress}
                    showSoftInputOnFocus={!onPress}
                    selectTextOnFocus={false}
                    onFocus={handleFocus} // Add onFocus handler
                    onBlur={handleBlur} // Add onBlur handler
                    autoCapitalize='none'
                    selectionColor={isFocused ? theme.dark.secondary : theme.dark.text} // Change cursor color when focused
                />
                {iconComponent}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: theme.dark.inputBg,
        marginTop: 15,
        height: 45,
        borderRadius: 30,
        borderWidth: 1,
        borderColor: theme.dark.text
    },
    focusedContainer: {
        backgroundColor: theme.dark.transparentBg, // Background color when focused
        borderColor: theme.dark.secondary, // Border color when focused
    },
    input: {
        flex: 1,
        color: theme.dark.text,
        fontSize: scaleHeight(16),
        fontFamily: fonts.fontsType.medium,
        marginStart: 20,
        //paddingHorizontal:10
    },
    multilineInput: {
        height: 142,
    },
    label: {
        fontFamily: fonts.fontsType.medium,
        fontSize: scaleHeight(17),
        color: theme.dark.inputLabel,
        marginHorizontal: 10,
        top: 10
    }
});

export default CustomTextInput;
