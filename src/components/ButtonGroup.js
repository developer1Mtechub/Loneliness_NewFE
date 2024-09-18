import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { theme } from '../assets';
import fonts from '../styles/fonts';
import { scaleHeight } from '../styles/responsive';
import { useDispatch } from 'react-redux';
import { setLastIndex } from '../redux/setIndexesSlice';

const ButtonGroup = ({ onSelectedChange, buttons, selectedIndex, customStyle }) => {
    const dispatch = useDispatch();
    // const [selected, setSelected] = useState('Upcoming');
    const [selected, setSelected] = useState(buttons[selectedIndex]);

    useEffect(() => {
        setSelected(buttons[selectedIndex]);
    }, [selectedIndex, buttons]);

    const handlePress = (button, index) => {
        setSelected(button);
        if (onSelectedChange) {
            onSelectedChange(button, index);
            dispatch(setLastIndex(index))
        }
    };

    const buttonColor = (button) => {
        return button === selected ? theme.dark.primary : theme.dark.secondary;
    };

    const buttonBackgroundColor = (button) => {
        return button === selected ? theme.dark.secondary : 'transparent';
    };

    const containerBackgroundColor = selected ? 'rgba(252, 226, 32, 0.2)' : 'transparent';



    return (
        <View style={[styles.container, { backgroundColor: containerBackgroundColor },customStyle]}>
            {buttons.map((button, index) => (
                <TouchableOpacity
                    key={button}
                    onPress={() => handlePress(button, index)}
                    style={[styles.button, { borderColor: buttonColor(button), backgroundColor: buttonBackgroundColor(button) }]}
                >
                    <Text style={[styles.text, { color: buttonColor(button) }]}>
                        {button}
                    </Text>
                </TouchableOpacity>
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        padding: 6,
        borderRadius: 16,
        margin: 10

    },
    button: {
        paddingVertical: 10,
        paddingHorizontal: 10,
        borderRadius: 12,
        backgroundColor: theme.dark.secondary,
        height: scaleHeight(43),

    },
    text: {
        fontSize: 15,
        color: theme.dark.primary,
        fontFamily: fonts.fontsType.semiBold
    },
});

export default ButtonGroup;
