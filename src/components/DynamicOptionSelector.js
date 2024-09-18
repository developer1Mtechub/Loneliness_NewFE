// DynamicSelector.js
import React, { useState, useEffect } from 'react';
import { TouchableOpacity, Text, View, StyleSheet } from 'react-native';
import { scaleHeight, scaleWidth } from '../styles/responsive';
import { theme } from '../assets';
import fonts from '../styles/fonts';

const DynamicOptionSelector = ({ items, onItemSelected, selectedItem: preSelectedItems }) => {
    const [selectedItem, setSelectedItem] = useState(null);

    useEffect(() => {
        if (preSelectedItems?.length) {
            console.log('preSelectedItems', preSelectedItems)
            setSelectedItem(preSelectedItems);
        }
    }, [preSelectedItems,selectedItem]);

    const handleItemPress = (item) => {
        setSelectedItem(item);
        if (onItemSelected) {
            onItemSelected(item);
        }
    };

    return (
        <View style={styles.container}>
            {items?.map((item, index) => {
                const isSelected = selectedItem === item;
                return (
                    <TouchableOpacity
                        key={index}
                        onPress={() => handleItemPress(item)}
                        style={{
                            ...styles.button,
                            backgroundColor: isSelected ? theme.dark.transparentBg : theme.dark.inputBg,
                            borderColor: isSelected ? theme.dark.secondary : theme.dark.text,
                            marginTop: scaleHeight(30)
                        }}
                    >
                        <Text
                            style={{
                                ...styles.text,
                                color: isSelected ? theme.dark.secondary : theme.dark.inputLabel,
                                fontSize: scaleHeight(18),
                                marginHorizontal: scaleWidth(20)
                            }}
                        >
                            {item}
                        </Text>
                    </TouchableOpacity>
                );
            })}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // justifyContent: 'center',
        // alignItems: 'center',
    },
    button: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: theme.dark.inputBg,
        height: scaleHeight(45),
        borderRadius: 30,
        borderWidth: 1,
        borderColor: theme.dark.text,
        marginTop: scaleHeight(30)
    },
    text: {
        fontFamily: fonts.fontsType.medium,
        fontSize: scaleHeight(18),
        color: theme.dark.inputLabel,
        marginHorizontal: scaleWidth(20)
    },
});

export default DynamicOptionSelector;
