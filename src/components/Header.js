import React from 'react';
import { TouchableOpacity, Text, View } from 'react-native';
import { Icon } from 'react-native-elements'; // Change the icon library if necessary
import { theme } from '../assets';
import fonts from '../styles/fonts';
import { scaleHeight } from '../styles/responsive';
import { BackArrow } from '../assets/svgs';

const Header = ({ onPress, title, customTextStyle, icon, iconPress }) => {
    return (
        <View style={styles.container}>
            <TouchableOpacity
                onPress={onPress}
                style={styles.backButton}>
                {/* <Icon name={'arrow-back'} size={24} color={theme.dark.secondary} /> */}
                <BackArrow width={32} height={32} />
            </TouchableOpacity>
            <Text style={[styles.title, customTextStyle]}>{title}</Text>
            {icon && <TouchableOpacity style={styles.iconContainer} onPress={iconPress}>
                <Icon name={icon} size={24} color={theme.dark.secondary} />
            </TouchableOpacity>}
        </View>
    );
};

const styles = {
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        marginTop: 15,
        marginBottom: 10

    },
    backButton: {
        marginStart: 20,
    },
    title: {
        color: theme.dark.secondary,
        fontSize: scaleHeight(20),
        fontFamily: fonts.fontsType.bold,
        marginStart: 55,
        flex: 1
    },
    iconContainer: {
        marginEnd: 10
    }
};

export default Header;
