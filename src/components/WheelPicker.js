import React, { useRef, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import RBSheet from 'react-native-raw-bottom-sheet';
import { WheelPicker } from 'react-native-wheel-picker-android';
import Button from './ButtonComponent';
import fonts from '../styles/fonts';
import { theme } from '../assets';
import { normalizeFontSize, scaleHeight } from '../styles/responsive';

const WheelPickerComponent = ({ visible, onClose, onSelect, type, inputValues, setInputValues }) => {
    const sheetRef = useRef(null);
    const weightUnits = ['kg', 'lb']; // Weight units for selection
    const weightValuesKg = Array.from({ length: 201 }, (_, i) => i.toString()); // Example kg options
    const weightValuesLb = Array.from({ length: 401 }, (_, i) => i.toString()); // Example lb options
    const weightOptions = Array.from({ length: 201 }, (_, i) => i.toString()); // Example options for weight
    const heightFeetOptions = Array.from({ length: 7 }, (_, i) => i.toString()); // Example options for feet
    const heightInchesOptions = Array.from({ length: 12 }, (_, i) => i.toString()); // Example options for inches
    const [selectedUnit, setSelectedUnit] = useState('kg'); // Default to kg
    const [selectedValue, setSelectedValue] = useState(0); // Default value

    const handleSelect = (pickerType, item) => {
        onSelect(pickerType, item);
    };

    const handleUnitChange = (item) => {
        const newUnit = weightUnits[item];
        setSelectedUnit(newUnit);
        console.log(newUnit)
        if (newUnit === 'kg') {
            //onSelect('lb', 0);  // Pass current kg value
            onSelect('unit', 'kg');  // Pass current kg value
        } else {
            //onSelect('kg', 0);  // Pass current lb value
            onSelect('unit', 'lb');  // Pass current kg value
        }
        // Call the onSelect callback to pass the selected unit (kg or lb) and value
        //onSelect(newUnit, selectedValue);
    };

    const handleValueChange = (item) => {
        setSelectedValue(item);
        // Call the onSelect callback to pass the selected unit and value
        onSelect(selectedUnit, item);
    };

    // Open or close the bottom sheet based on the `visible` prop
    React.useEffect(() => {
        if (visible) {
            sheetRef.current.open();
        } else {
            sheetRef.current.close();
        }
    }, [visible]);

    return (
        <RBSheet
            ref={sheetRef}
            height={300}
            closeOnDragDown={true}
            customStyles={{
                wrapper: { backgroundColor: 'rgba(128, 128, 128, 0.80)' },
                container: {
                    borderTopLeftRadius: 15,
                    borderTopRightRadius: 15,
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: theme.dark.primary
                },
            }}
        >
            <View style={styles.pickerContainer}>
                {type === 'weight' ? (
                    // Display only 1 picker for kg and lb
                    <View style={styles.pickerRow}>
                        <WheelPicker
                            data={selectedUnit === 'kg' ? weightValuesKg : weightValuesLb}
                            selectedItem={selectedValue}
                            onItemSelected={(item) => handleValueChange(item)}
                            style={styles.picker}
                            itemTextFontFamily={fonts.fontsType.medium}
                            selectedItemTextFontFamily={fonts.fontsType.bold}
                            itemTextSize={normalizeFontSize(18)}
                            selectedItemTextColor={theme.dark.secondary}
                            indicatorColor={theme.dark.secondary}
                            indicatorWidth={2}
                        />
                        <WheelPicker
                            data={weightUnits}
                            selectedItem={weightUnits.indexOf(selectedUnit)}
                            onItemSelected={(item) => handleUnitChange(item)}
                            style={styles.picker}
                            itemTextFontFamily={fonts.fontsType.medium}
                            selectedItemTextFontFamily={fonts.fontsType.bold}
                            itemTextSize={normalizeFontSize(18)}
                            selectedItemTextColor={theme.dark.secondary}
                            isCyclic={false}
                            indicatorColor={theme.dark.secondary}
                            indicatorWidth={2}
                        />
                    </View>
                ) : (
                    // Display 2 pickers for height (feet and inches)
                    <View style={styles.pickerRow}>
                        <WheelPicker
                            data={heightFeetOptions}
                            selectedItem={0}
                            onItemSelected={(item) => handleSelect('ft', item)}
                            style={styles.picker}
                            itemTextFontFamily={fonts.fontsType.medium}
                            selectedItemTextFontFamily={fonts.fontsType.bold}
                            itemTextSize={normalizeFontSize(18)}
                            selectedItemTextColor={theme.dark.secondary}
                            indicatorColor={theme.dark.secondary}
                            indicatorWidth={2}
                        />
                        <Text style={styles.label}>Ft</Text>
                        <WheelPicker
                            data={heightInchesOptions}
                            selectedItem={0}
                            onItemSelected={(item) => handleSelect('in', item)}
                            style={styles.picker}
                            itemTextFontFamily={fonts.fontsType.medium}
                            selectedItemTextFontFamily={fonts.fontsType.bold}
                            selectedItemTextColor={theme.dark.secondary}
                            indicatorColor={theme.dark.secondary}
                            indicatorWidth={2}
                        />
                        <Text style={styles.label}>In</Text>
                    </View>
                )}
            </View>
            <Button onPress={onClose} title={'Save'} />
        </RBSheet>
    );
};

const styles = StyleSheet.create({
    pickerContainer: {
        backgroundColor: theme.dark.primary,
    },
    pickerRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
        paddingHorizontal: 20,
        alignItems: 'center',
        marginTop: scaleHeight(50),
    },
    picker: {
        width: 100,
        height: 150,
        alignSelf: 'center',
    },
    label: {
        fontFamily: fonts.fontsType.bold,
        fontSize: normalizeFontSize(16),
        color: theme.dark.secondary,
        alignSelf: 'center',
    },
});

export default WheelPickerComponent;
