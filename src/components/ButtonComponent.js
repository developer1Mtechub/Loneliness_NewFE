import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, View } from 'react-native';
import fonts from '../styles/fonts';
import { theme } from '../assets';
import { scaleHeight, scaleWidth } from '../styles/responsive';

const Button = ({ title, onPress, loading, disabled, customStyle, textCustomStyle, icon, isBgTransparent = false }) => {
    return (
        <>
            <TouchableOpacity
                style={[styles.button, customStyle]}
                onPress={onPress}
                disabled={disabled}
            >
                {loading ? (
                    <ActivityIndicator size="small" color={!isBgTransparent ? theme.dark.black : theme.dark.secondary} />
                ) : (
                    <View style={styles.content}>
                        {icon && <View style={styles.icon}>{icon}</View>}
                        <Text style={[styles.buttonText, textCustomStyle]}>{title}</Text>
                    </View>
                )}
            </TouchableOpacity>
        </>
    );
};

const styles = StyleSheet.create({
    button: {
        backgroundColor: theme.dark.secondary,
        borderRadius: 30,
        width: '90%',
        height: 40,
        alignSelf: 'center',
        justifyContent: 'center',
        marginTop: 20,
        marginBottom: 40,
    },
    content: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    icon: {
        marginRight: 8,
        left: scaleWidth(-35)
    },
    buttonText: {
        color: theme.dark.buttonText,
        fontFamily: fonts.fontsType.medium,
        fontSize: scaleHeight(17),
        textAlign: 'center',
    },
});

export default Button;
