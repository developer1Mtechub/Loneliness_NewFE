import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import ToggleSwitch from 'toggle-switch-react-native';
import { theme } from '../assets';
import { scaleHeight } from '../styles/responsive';
import fonts from '../styles/fonts';

const NotificationSettingItem = ({ label, initialValue, onToggle }) => {
    return (
        <View style={styles.settingContainer}>
            <Text style={styles.settingText}>{label}</Text>
            <ToggleSwitch
                isOn={initialValue}
                onColor={'rgba(252, 226, 32, 0.15)'}
                offColor={'rgba(217, 217, 217, 1)'}
                // label="Active"
                onValueChange={onToggle}
                // value={isEnabled}
                thumbOnStyle={{ backgroundColor: theme.dark.secondary }}
                thumbOffStyle={{backgroundColor:'rgba(137, 137, 137, 1)'}}
                labelStyle={{
                    fontSize: 12,
                    fontWeight: '700',
                    color: 'rgba(140, 138, 147, 1)',
                    marginLeft: 5,
                }}
                size="small"
                onToggle={(isOn) => onToggle(isOn)}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    settingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: theme.dark.inputBg,
        borderRadius: 30,
        borderWidth: 1,
        borderColor: theme.dark.inputLabel,
        padding: 10,
        marginTop:scaleHeight(20)
    },
    settingText: {
        fontSize: scaleHeight(14),
        fontFamily:fonts.fontsType.semiBold,
        marginRight: 10,
        flex: 1,
        color:theme.dark.white
    },
});

export default NotificationSettingItem;
