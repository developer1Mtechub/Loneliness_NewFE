import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import * as Animatable from 'react-native-animatable';
import CrossIcon from 'react-native-vector-icons/AntDesign';
import CardField from 'some-library';
import Button from 'some-button-component';
import fonts from '../styles/fonts';
import { theme } from '../assets';

const Overlay = ({
    isVisible,
    onClose,
    animationType = "bounceIn",
    duration = 2000,
    keyboardStatus,
    setCardDetails,
    paymentLoader,
    handleCreatePaymentMethod,
    theme,
    title = "Enter Card Detail",
    placeholder = "4242 4242 4242 4242",
    buttonTitle = "Pay"
}) => {
    if (!isVisible) return null;

    return (
        <View style={styles.overlay}>
            <Animatable.View
                animation={animationType}
                duration={duration}
                style={{
                    backgroundColor: 'white',
                    width: '80%',
                    height: keyboardStatus ? '40%' : '25%',
                    borderRadius: 16,
                    margin: 30
                }}
            >
                <CrossIcon
                    onPress={onClose}
                    style={{
                        alignSelf: 'flex-end',
                        left: 4,
                        bottom: 4
                    }}
                    size={26}
                    name='closecircle'
                    color={theme.dark.secondary}
                />

                <Text style={styles.cardHeading}>
                    {title}
                </Text>

                <CardField
                    postalCodeEnabled={false}
                    placeholder={{
                        number: placeholder,
                    }}
                    cardStyle={{
                        backgroundColor: '#FFFFFF',
                        textColor: '#000000',
                    }}
                    style={{
                        width: '80%',
                        height: '20%',
                    }}
                    onCardChange={(cardDetails) => {
                        setCardDetails({ type: 'card', card: cardDetails });
                    }}
                />

                <Button
                    loading={paymentLoader}
                    isBgTransparent={true}
                    onPress={handleCreatePaymentMethod}
                    title={buttonTitle}
                    customStyle={{
                        backgroundColor: theme.dark.primary,
                        width: '80%',
                        marginBottom: 0,
                        marginTop: 40
                    }}
                    textCustomStyle={{
                        color: theme.dark.secondary
                    }}
                />
            </Animatable.View>
        </View>
    );
};

const styles = StyleSheet.create({
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
});

export default Overlay;
