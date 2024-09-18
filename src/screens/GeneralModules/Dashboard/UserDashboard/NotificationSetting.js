import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import Header from '../../../../components/Header';
import { resetNavigation } from '../../../../utils/resetNavigation';
import { SCREENS } from '../../../../constant/constants';
import useBackHandler from '../../../../utils/useBackHandler';
import { theme } from '../../../../assets';
import NotificationSettingItem from '../../../../components/NotificationSettingItem';
import { scaleHeight } from '../../../../styles/responsive';
import Button from '../../../../components/ButtonComponent';
import { withDecay } from 'react-native-reanimated';

const NotificationSetting = ({ navigation }) => {
    const [isEnabled1, setIsEnabled1] = useState(false);
    const [isEnabled2, setIsEnabled2] = useState(false);
    const [isEnabled3, setIsEnabled3] = useState(true);
    const [isEnabled4, setIsEnabled4] = useState(true);
    const [isEnabled5, setIsEnabled5] = useState(false);

    const toggleSwitch1 = () => setIsEnabled1(previousState => !previousState);
    const toggleSwitch2 = () => setIsEnabled2(previousState => !previousState);
    const toggleSwitch3 = () => setIsEnabled3(previousState => !previousState);
    const toggleSwitch4 = () => setIsEnabled4(previousState => !previousState);
    const toggleSwitch5 = () => setIsEnabled5(previousState => !previousState);

    const handleBackPress = () => {
        resetNavigation(navigation, SCREENS.NOTIFICATION)
        return true;
    };
    useBackHandler(handleBackPress);

    return (
        <SafeAreaView style={styles.container}>
            <Header
                onPress={() => {
                    resetNavigation(navigation, SCREENS.NOTIFICATION)
                }}
                title={"Notification Settings"}
                customTextStyle={{
                    marginStart: 20
                }}
            />
            <View style={{ padding: 25, flex: 1 }}>
                <NotificationSettingItem
                    label="Service accepted notification"
                    initialValue={isEnabled1}
                    onToggle={toggleSwitch1}
                />
                <NotificationSettingItem
                    label="Request from buddy notification"
                    initialValue={isEnabled2}
                    onToggle={toggleSwitch2}
                />
                <NotificationSettingItem
                    label="1 hour before service notification"
                    initialValue={isEnabled3}
                    onToggle={toggleSwitch3}
                />
                <NotificationSettingItem
                    label="Service completed notification"
                    initialValue={isEnabled4}
                    onToggle={toggleSwitch4}
                />
                <NotificationSettingItem
                    label="Rate service notification"
                    initialValue={isEnabled5}
                    onToggle={toggleSwitch5}
                />
            </View>
            <Button
                title={"Save Settings"}
                customStyle={{
                    width: '85%',
                    marginBottom: scaleHeight(90)
                }}
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.dark.background
    }
});

export default NotificationSetting;
