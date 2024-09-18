//import liraries
import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { theme } from '../assets';
import LottieView from 'lottie-react-native';
import { scaleHeight, scaleWidth } from '../styles/responsive';
import fonts from '../styles/fonts';

// create a component
const Spinner = ({ lottieCustomStyle, label, isTimer = true }) => {
    const lottieRef = useRef(null);

    useEffect(() => {
        let timer;
        if (isTimer) {
            timer = setTimeout(() => {
                if (lottieRef.current) {
                    lottieRef.current.pause();
                }
            }, 3000);
        }


        return () => clearTimeout(timer);
    }, [isTimer]);

    return (
        <View style={styles.container}>
            <LottieView
                ref={lottieRef}
                style={[styles.lottieView, lottieCustomStyle]}
                source={require('../assets/spinner_lottie.json')}
                autoPlay
                loop
                speed={1}
            />
            {label && <Text style={{
                fontFamily: fonts.fontsType.regular,
                fontSize: 13,
                color: theme.dark.white,
                alignSelf: 'center',
                textAlign: 'center',
                bottom: scaleHeight(250)
            }}>
                {label}
            </Text>}
        </View>
    );
};

// define your styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.dark.transparentBg,

    },
    lottieView: {
        flex: 1,
        width: scaleWidth(350),
        height: scaleHeight(350),
        alignSelf: 'center',
    },
});

//make this component available to the app
export default Spinner;
