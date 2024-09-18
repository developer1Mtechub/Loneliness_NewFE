import React, { useState, useEffect } from 'react';
import { TouchableOpacity, Text, View, StyleSheet, Image } from 'react-native';
import { scaleHeight, scaleWidth } from '../styles/responsive';
import { theme } from '../assets';
import fonts from '../styles/fonts';

const CategorySelector = ({ items, onItemSelected, selectedItems: preSelectedItems }) => {
    const [selectedItems, setSelectedItems] = useState([]);

    useEffect(() => {
        if (preSelectedItems?.length) {
            setSelectedItems(preSelectedItems);
        }
    }, [preSelectedItems]);

    const handleItemPress = (item) => {
        const newItemSelection = selectedItems.some(i => i.id === item.id)
            ? selectedItems.filter(i => i.id !== item.id)
            : [...selectedItems, item];

        setSelectedItems(newItemSelection);
        if (onItemSelected) {
            onItemSelected(newItemSelection);
        }
    };

    return (
        <View style={styles.container}>
            {items?.map((item, index) => {
                const isSelected = selectedItems.some(i => i.id === item.id);
                return (
                    <TouchableOpacity
                        key={item.id}
                        onPress={() => handleItemPress(item)}
                        style={[
                            styles.button,
                            {
                                backgroundColor: isSelected ? theme.dark.transparentBg : theme.dark.inputBg,
                                borderColor: isSelected ? theme.dark.secondary : theme.dark.text,
                                marginTop: scaleHeight(30)
                            }
                        ]}
                    >
                        <Image
                            tintColor={isSelected ? theme.dark.secondary : theme.dark.inputLabel}
                            style={styles.imageStyle}
                            source={{ uri: item?.image_url }} />
                        <Text
                            style={[
                                styles.text,
                                {
                                    color: isSelected ? theme.dark.secondary : theme.dark.inputLabel,
                                    fontSize: scaleHeight(18),
                                    marginHorizontal: scaleWidth(20)
                                }
                            ]}
                        >
                            {item?.name}
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
    },
    button: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: theme.dark.inputBg,
        height: scaleHeight(45),
        borderRadius: 30,
        borderWidth: 1,
        borderColor: theme.dark.text,
        marginTop: scaleHeight(30),
        paddingHorizontal: scaleWidth(20),
    },
    text: {
        fontFamily: fonts.fontsType.medium,
        fontSize: scaleHeight(18),
        color: theme.dark.inputLabel,
        flex: 1,
    },
    imageStyle: {
        width: scaleWidth(26),
        height: scaleHeight(25),
        alignSelf: ''
    }
});

export default CategorySelector;
