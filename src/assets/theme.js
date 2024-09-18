import palette from "./palette";

const lightTheme = {
    background: palette.white,
    text: palette.black,
    primary: palette.primary,
    secondary: palette.secondary,
};

const darkTheme = {
    background: palette.primary,
    text: palette.dimGray,
    inputBackground: palette.darkGray,
    primary: palette.primary,
    secondary: palette.secondary,
    white: palette.white,
    black: palette.black,
    buttonText: palette.almostBlack,
    transparentBg: palette.transparent,
    inputBg: palette.grayDark,
    inputLabel: palette.gray,
    error: palette.danger,
    success: palette.success,
    heading: palette.gray,
    inActiveColor: palette.grayLight,
    disableButton: palette.lightGray,
    disableButtonText: palette.darkGray,
    labelColor: palette.grey
};

export default {
    light: lightTheme,
    dark: darkTheme,
};