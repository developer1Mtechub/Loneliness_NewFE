// CustomRangeSlider.js
import React, { useState, useRef } from 'react';
import { View, PanResponder, StyleSheet, Dimensions, Text } from 'react-native';
import { theme } from '../assets';
import { scaleHeight } from '../styles/responsive';
import fonts from '../styles/fonts';

const { width } = Dimensions.get('window');

const CustomRangeSlider = ({ min, max, step, initialLow, initialHigh, onValueChange }) => {
    const [low, setLow] = useState(initialLow);
    const [high, setHigh] = useState(initialHigh);

    const lowThumbRef = useRef(null);
    const highThumbRef = useRef(null);

    const panResponderLow = useRef(
        PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onPanResponderMove: (evt, gestureState) => {
                const newLow = Math.max(min, Math.min(low + (gestureState.dx / width) * (max - min), high - step));
                setLow(newLow);
                onValueChange(newLow, high);
            },
        })
    ).current;

    const panResponderHigh = useRef(
        PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onPanResponderMove: (evt, gestureState) => {
                const newHigh = Math.min(max, Math.max(high + (gestureState.dx / width) * (max - min), low + step));
                setHigh(newHigh);
                onValueChange(low, newHigh);
            },
        })
    ).current;

    return (
        <View style={styles.container}>
            <View style={styles.rail} />
            <View style={[styles.railSelected, { left: `${(low - min) / (max - min) * 100}%`, right: `${100 - (high - min) / (max - min) * 100}%` }]} />
            <View
                style={[styles.thumb, { left: `${(low - min) / (max - min) * 100}%` }]}
                {...panResponderLow.panHandlers}
                ref={lowThumbRef}
            />
            <View
                style={[styles.thumb, { left: `${(high - min) / (max - min) * 100}%` }]}
                {...panResponderHigh.panHandlers}
                ref={highThumbRef}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
        alignItems: 'center',
        marginTop: 10,
    },
    rail: {
        width: '90%',
        height: 4,
        backgroundColor: theme.dark.white,
        borderRadius: 2,
        position: 'absolute',
        top: 20,
    },
    railSelected: {
        height: 4,
        backgroundColor: theme.dark.secondary,
        position: 'absolute',
        top: 20,
    },
    thumb: {
        width: 20,
        height: 20,
        backgroundColor: theme.dark.secondary,
        borderRadius: 10,
        position: 'absolute',
        top: 10,
        marginLeft: -10,
    },
    labels: {
        
        flexDirection: 'row',
        //justifyContent: 'space-between',
        // width: '90%',
        marginTop: 30,
    },
});

export default CustomRangeSlider;
