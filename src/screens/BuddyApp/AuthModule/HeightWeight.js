import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Image, FlatList, TextInput, ScrollView } from 'react-native';
import { resetNavigation } from '../../../utils/resetNavigation';
import { SCREENS } from '../../../constant/constants';
import useBackHandler from '../../../utils/useBackHandler';
import { theme } from '../../../assets';
import CustomTextInput from '../../../components/TextInputComponent';
import CustomLayout from '../../../components/CustomLayout';
import fonts from '../../../styles/fonts';
import { scaleHeight, scaleWidth } from '../../../styles/responsive';
import HorizontalDivider from '../../../components/HorizontalDivider';
import Button from '../../../components/ButtonComponent';
import ProfileProgressBar from '../../../components/ProfileProgressBar';
import { useDispatch, useSelector } from 'react-redux';
import { useAlert } from '../../../providers/AlertContext';
import { setDataPayload } from '../../../redux/appSlice';
import WheelPickerComponent from '../../../components/WheelPicker';

const HeightWeight = ({ navigation }) => {
  const dispatch = useDispatch();
  const { showAlert } = useAlert();
  const { dataPayload } = useSelector((state) => state.app);
  const [isPickerVisible, setPickerVisible] = useState(false);
  const [selectedType, setSelectedType] = useState('weight');
  const [selectedValues, setSelectedValues] = useState({
    kg: 0,
    lb: 0,
    ft: 0,
    inches: 0,
    unit: 'kg'
  });

  const [inputValues, setInputValues] = useState({
    height_ft: '',
    height_in: '',
    weight_kg: '',
    weight_lb: '',
    weight_unit: 'KG'
  });

  const [hieghtFtSelected, setHeightFtSelected] = useState(true);
  const [hieghtInSelected, setHeightInSelected] = useState(false);
  const [weightKgSelected, setWeightKgSelected] = useState(true);
  const [weightLbSelected, setWeightLbSelected] = useState(false);

  const handleBackPress = () => {
    resetNavigation(navigation, SCREENS.BUDDY_GENDER_SELECTION)
    return true;
  };
  useBackHandler(handleBackPress);

  const handleSelect = (pickerType, value) => {
    setSelectedValues(prevValues => ({
      ...prevValues,
      [pickerType]: value
    }));

  };

  useEffect(() => {

    setInputValues(prevValues => ({
      ...prevValues,
      height_ft: String(selectedValues.ft || 0),
      height_in: String(selectedValues.in || 0),
    }));

    if (selectedValues.unit === 'lb') {
      setWeightKgSelected(false);
      setWeightLbSelected(true);
      setInputValues(prevValues => ({
        ...prevValues,
        weight_lb: String(selectedValues.lb),
        weight_kg: '0',
        weight_unit: "LB"
      }));
    } else {
      setWeightKgSelected(true);
      setWeightLbSelected(false);
      setInputValues(prevValues => ({
        ...prevValues,
        weight_kg: String(selectedValues.kg),
        weight_lb: '0',
        weight_unit: "KG"
      }));
    }

  }, [selectedValues])

  useEffect(() => {
    const { height_ft, height_in, weight_kg, weight_lb, weight_unit, weight } = dataPayload || {};

    // Set input values
    if (height_ft || height_in || weight_kg || weight_lb || weight_unit) {
      setInputValues({
        height_ft: height_ft || '',
        height_in: height_in || ''
      });
    }

    // Set weight unit selection
    if (weight_unit === 'LB') {
      setWeightKgSelected(false);
      setWeightLbSelected(true);
      setInputValues(prevValues => ({
        ...prevValues,
        weight_lb: weight,
        weight_unit: "LB"
      }));
    } else {
      setWeightKgSelected(true);
      setWeightLbSelected(false);
      setInputValues(prevValues => ({
        ...prevValues,
        weight_kg: weight,
        weight_unit: "KG"
      }));
    }
  }, [dataPayload]);

  const togglePicker = () => {
    setPickerVisible(!isPickerVisible);
  };


  const handleToggleFt = () => {
    setHeightFtSelected(true);
    setHeightInSelected(false);
    setInputValues({ ...inputValues, height_unit: 'ft' });
  };

  const handleToggleInches = () => {
    setHeightFtSelected(false);
    setHeightInSelected(true);
    setInputValues({ ...inputValues, height_unit: 'in' });
  };

  const handleToggleKg = () => {
    setWeightKgSelected(true);
    setWeightLbSelected(false);
    setInputValues(prevValues => ({
      ...prevValues,
      weight_lb: '',
      weight_unit: 'KG'
    }));
  };

  const handleToggleLb = () => {
    setWeightKgSelected(false);
    setWeightLbSelected(true);
    setInputValues(prevValues => ({
      ...prevValues,
      weight_kg: '',
      weight_unit: 'LB'
    }));

  };

  const handleHeightWeight = () => {
    const { height_ft, height_in, weight_kg, weight_lb, weight_unit } = inputValues

    if (height_ft == 0 || height_in == 0 || (weight_kg == 0 && weight_lb == 0)) {
      showAlert("Error", "error", "These fields are required!")
      return;
    }

    const weight = weight_kg ? weight_kg : weight_lb;
    const newPayload = { ...dataPayload, height_ft, height_in, weight, weight_unit };
    dispatch(setDataPayload(newPayload));
    resetNavigation(navigation, SCREENS.SELECT_LANGUAGE)
  }

  return (
    <SafeAreaView style={styles.container}>
      <ProfileProgressBar progress={70} onPress={() => {
        resetNavigation(navigation, SCREENS.BUDDY_GENDER_SELECTION)
      }} />
      <CustomLayout>
        <View style={styles.contentContainer}>
          <Text style={styles.welcomeText}>
            Let's Get to Know You Better!
          </Text>
          <Text style={styles.subTitle}>
            Your height and weight can help us provide a more personalized experience.
          </Text>

          <View style={{ marginTop: scaleHeight(30) }}>

            <Text style={styles.label}>{'Height'}</Text>

            <TouchableOpacity
              onPress={() => {
                setSelectedType('height');
                togglePicker();
              }}
              style={{

                flexDirection: "row",
                alignItems: "center",
                backgroundColor: theme.dark.inputBg,
                height: 45,
                borderRadius: 30,
                borderWidth: 1,
                borderColor: theme.dark.text,
                marginTop: scaleHeight(30)

              }}>

              <View style={{ flexDirection: 'row', marginHorizontal: scaleWidth(10), flex: 1 }}>

                <TextInput
                  style={{
                    fontFamily: fonts.fontsType.medium,
                    fontSize: scaleHeight(14),
                    color: theme.dark.text,
                    marginHorizontal: 10,
                    width: scaleWidth(50)
                  }}
                  maxLength={2}
                  placeholder='00'
                  keyboardType='number-pad'
                  placeholderTextColor={theme.dark.text}
                  value={inputValues.height_ft}
                  onChangeText={(text) => setInputValues({ ...inputValues, height_ft: text })}
                  caretHidden={true}
                  editable={false}
                  onPressIn={() => {
                    setSelectedType('height');
                    togglePicker();
                  }}
                  showSoftInputOnFocus={false}
                  selectTextOnFocus={false}
                />

                <View style={styles.verticleLine}></View>

                <TextInput
                  style={{
                    fontFamily: fonts.fontsType.medium,
                    fontSize: scaleHeight(14),
                    color: theme.dark.text,
                    width: scaleWidth(50)
                  }}
                  maxLength={2}
                  placeholder='00'
                  keyboardType='number-pad'
                  placeholderTextColor={theme.dark.text}
                  value={inputValues.height_in}
                  onChangeText={(text) => setInputValues({ ...inputValues, height_in: text })}
                  caretHidden={true}
                  editable={false}
                  onPressIn={() => {
                    setSelectedType('height');
                    togglePicker();
                  }}
                  showSoftInputOnFocus={false}
                  selectTextOnFocus={false}

                />

              </View>

              <View style={{
                flexDirection: 'row',
                borderRadius: 30,
                borderWidth: 1,
                borderColor: theme.dark.secondary,
                width: scaleWidth(70),
                height: '70%',
                marginEnd: scaleWidth(10),
                justifyContent: 'space-evenly',
                backgroundColor: theme.dark.transparentBg
              }}>

                <View
                  style={{
                    backgroundColor: hieghtFtSelected ? theme.dark.secondary : '#333333',
                    width: scaleWidth(35),
                    height: '100%',
                    alignSelf: 'center',
                    borderBottomLeftRadius: 30,
                    borderTopLeftRadius: 30,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Text style={{
                    fontFamily: fonts.fontsType.semiBold,
                    fontSize: scaleHeight(12),
                    color: hieghtFtSelected ? theme.dark.black : theme.dark.white,
                    alignSelf: 'center'

                  }}>Ft</Text>
                </View>

                <View
                  style={{
                    // backgroundColor: hieghtInSelected ? theme.dark.secondary : '#333333',
                    backgroundColor: theme.dark.secondary,
                    width: scaleWidth(35),
                    height: '100%',
                    alignSelf: 'center',
                    borderBottomEndRadius: 30,
                    borderTopEndRadius: 30,
                    alignItems: 'center',
                    justifyContent: 'center',
                    left: 1
                  }}
                >
                  <Text style={{
                    fontFamily: fonts.fontsType.semiBold,
                    fontSize: scaleHeight(12),
                    // color: hieghtInSelected ? theme.dark.black : theme.dark.white,
                    color: theme.dark.black,
                    alignSelf: 'center'

                  }}>In</Text>
                </View>

              </View>


            </TouchableOpacity>

            <Text style={styles.label}>{'Weight'}</Text>

            <TouchableOpacity
              onPress={() => {
                setSelectedType('weight');
                togglePicker();
              }}
              style={{

                flexDirection: "row",
                alignItems: "center",
                backgroundColor: theme.dark.inputBg,
                height: 45,
                borderRadius: 30,
                borderWidth: 1,
                borderColor: theme.dark.text,
                marginTop: scaleHeight(30)

              }}>

              <View style={{ flexDirection: 'row', marginHorizontal: scaleWidth(10), flex: 1 }}>

                <TextInput
                  style={{
                    fontFamily: fonts.fontsType.medium,
                    fontSize: scaleHeight(14),
                    color: theme.dark.text,
                    marginHorizontal: 10,
                    width: scaleWidth(50)
                  }}
                  //editable={weightKgSelected}
                  maxLength={2}
                  keyboardType='number-pad'
                  placeholder='00'
                  placeholderTextColor={theme.dark.text}
                  value={inputValues.weight_kg}
                  onChangeText={(text) => setInputValues({ ...inputValues, weight_kg: text })}
                  caretHidden={true}
                  editable={false}
                  onPressIn={() => {
                    setSelectedType('weight');
                    togglePicker();
                  }}
                  showSoftInputOnFocus={false}
                  selectTextOnFocus={false}
                />

                <View style={styles.verticleLine}></View>

                <TextInput
                  style={{
                    fontFamily: fonts.fontsType.medium,
                    fontSize: scaleHeight(14),
                    color: theme.dark.text,
                    width: scaleWidth(50)
                  }}
                  //editable={weightLbSelected}
                  maxLength={2}
                  keyboardType='number-pad'
                  placeholder='00'
                  placeholderTextColor={theme.dark.text}
                  value={inputValues.weight_lb}
                  onChangeText={(text) => setInputValues({ ...inputValues, weight_lb: text })}
                  caretHidden={true}
                  editable={false}
                  onPressIn={() => {
                    setSelectedType('weight');
                    togglePicker();
                  }}
                  showSoftInputOnFocus={false}
                  selectTextOnFocus={false}
                />

              </View>

              <View style={{
                flexDirection: 'row',
                borderRadius: 30,
                borderWidth: 1,
                borderColor: theme.dark.secondary,
                width: scaleWidth(70),
                height: '70%',
                marginEnd: scaleWidth(10),
                justifyContent: 'space-evenly',
              }}>

                <TouchableOpacity
                  onPress={() => {
                    handleToggleKg();
                  }}
                  style={{
                    backgroundColor: weightKgSelected ? theme.dark.secondary : '#333333',
                    width: scaleWidth(35),
                    height: '100%',
                    alignSelf: 'center',
                    borderBottomLeftRadius: 30,
                    borderTopLeftRadius: 30,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Text style={{
                    fontFamily: fonts.fontsType.semiBold,
                    fontSize: scaleHeight(12),
                    color: weightKgSelected ? theme.dark.black : theme.dark.white,
                    alignSelf: 'center'

                  }}>Kg</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => {
                    handleToggleLb();
                  }}
                  style={{
                    backgroundColor: weightLbSelected ? theme.dark.secondary : '#333333',
                    width: scaleWidth(35),
                    height: '100%',
                    alignSelf: 'center',
                    borderBottomEndRadius: 30,
                    borderTopEndRadius: 30,
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <Text style={{
                    fontFamily: fonts.fontsType.semiBold,
                    fontSize: scaleHeight(12),
                    color: weightLbSelected ? theme.dark.black : theme.dark.white,
                    alignSelf: 'center'

                  }}>Lb</Text>
                </TouchableOpacity>

              </View>


            </TouchableOpacity>

          </View>

        </View>

      </CustomLayout>

      <View style={styles.buttonContainer}>

        <HorizontalDivider
          customStyle={{
            marginTop: 40
          }} />

        <Button
          onPress={() => {
            handleHeightWeight();

          }}
          title={'Continue'}
        />
      </View>

      <WheelPickerComponent
        visible={isPickerVisible}
        onClose={togglePicker}
        onSelect={handleSelect}
        type={selectedType} // Pass type as either 'weight' or 'height'
      />

    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.dark.background
  },
  contentContainer: {
    padding: 25,
    flex: 1
  },
  welcomeText: {
    fontFamily: fonts.fontsType.semiBold,
    fontSize: scaleHeight(22),
    color: theme.dark.white,
    marginTop: 15
  },
  subTitle: {
    fontFamily: fonts.fontsType.regular,
    fontSize: scaleHeight(14),
    color: theme.dark.heading,
    marginTop: 5
  },
  forgetText: {
    fontFamily: fonts.fontsType.semiBold,
    fontSize: scaleHeight(14),
    color: theme.dark.secondary,
    alignSelf: 'center'
  },
  createAccountText1: {
    fontFamily: fonts.fontsType.regular,
    fontSize: scaleHeight(16),
    color: theme.dark.white
  },
  createAccountText2: {
    fontFamily: fonts.fontsType.bold,
    fontSize: scaleHeight(16),
    color: theme.dark.secondary,
    marginHorizontal: 5,
    textDecorationLine: 'underline'
  },
  createAccountItem: {
    flexDirection: 'row',
    alignSelf: 'center',
    marginTop: 30,
  },
  buttonContainer: {
    width: '90%',
    alignSelf: 'center',
    // marginTop: scaleHeight(200),
    // marginBottom: scaleHeight(20)
  },
  createAccountView: {
    flex: 1
  },
  forgetPassContainer: {
    flexDirection: 'row',
    marginTop: 20,
  },
  backButton: {
    alignSelf: 'center'
  },
  errorText: {
    fontFamily: fonts.fontsType.regular,
    fontSize: scaleHeight(12),
    color: theme.dark.error,
    marginTop: 8,
    marginHorizontal: scaleWidth(15),
  },
  verticleLine: {
    height: '60%',
    width: 1,
    backgroundColor: '#909090',
    alignSelf: 'center'
  },
  label: {
    fontFamily: fonts.fontsType.medium,
    fontSize: scaleHeight(17),
    color: theme.dark.inputLabel,
    marginHorizontal: 8,
    top: scaleHeight(20)
  }
});


export default HeightWeight;
