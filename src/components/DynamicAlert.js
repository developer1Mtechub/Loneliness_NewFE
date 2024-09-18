import React, { useEffect } from 'react';
import { Dimensions, Text, StyleSheet, Image, View } from 'react-native';
import * as Animatable from 'react-native-animatable';
import { useAlert } from '../providers/AlertContext';
import { success_alert_img, error_alert_img } from '../assets/images';
import { theme } from '../assets';
import { scaleHeight, scaleWidth } from '../styles/responsive';
import fonts from '../styles/fonts';

const { width } = Dimensions.get('window');

const DynamicAlert = () => {
    const { alert, hideAlert } = useAlert();

    useEffect(() => {
        if (alert.visible) {
            const timer = setTimeout(() => {
                hideAlert();
            }, 3000); // Hide after 3 seconds

            return () => clearTimeout(timer);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [alert.visible]);

    if (!alert.visible) return null;

    const getImageSource = () => {
        switch (alert.type) {
            case 'success':
                return success_alert_img;
            case 'error':
                return error_alert_img;
            // case 'warning':
            //     return require('./assets/warning.png');
            default:
                return null;
        }
    };

    const getShadowStyle = () => {
        switch (alert.type) {
            case 'success':
                return styles.successShadow;
            case 'error':
                return styles.errorShadow;
            // case 'warning':
            //     return styles.warningShadow;
            default:
                return {};
        }
    };

    return (
        <Animatable.View
            animation="slideInDown"
            duration={500}
            style={[styles.container, styles[alert.type], getShadowStyle()]}
        >
            <View style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'flex-start',
            }}>
                <Image resizeMode='contain' source={getImageSource()} style={styles.icon} />
                <Text style={[styles.text, {
                    color: alert.type === 'success' ? "#4CAF50" : "#F44336"
                }]}>{alert.message}</Text>
            </View>
            <Text style={[styles.descriptionText, { marginLeft: scaleWidth(30) }]}>{alert.description}</Text>
        </Animatable.View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        padding: width * 0.03,
        margin: width * 0.04,
        borderRadius: 5,
        zIndex: 1000,
        backgroundColor: theme.dark.primary,
        borderWidth: 1.5,
    },
    text: {
        fontFamily: fonts.fontsType.bold,
        color: 'white',
        // fontSize: width * 0.04,
        fontSize: 17,
        marginLeft: width * 0.02,
    },
    descriptionText: {
        fontFamily: fonts.fontsType.regular,
        color: theme.dark.inputLabel,
        // fontSize: width * 0.04,
        fontSize: 14,
        marginLeft: width * 0.02,
    },
    icon: {
        width: width * 0.06,
        height: width * 0.06,
        top: scaleHeight(10),
    },
    success: {
        borderColor: '#4CAF50',
    },
    error: {
        borderColor: '#F44336',
    },
    successShadow: {
        shadowColor: '#4CAF50',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.8,
        shadowRadius: 2,
        elevation: 5,
    },
    errorShadow: {
        shadowColor: '#F44336',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.8,
        shadowRadius: 2,
        elevation: 5,
    },
    // Add other shadow styles as needed
});

export default DynamicAlert;
