import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, Image } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';
import { useDispatch, useSelector } from 'react-redux';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { SCREENS } from '../../constant/constants';
import { resetNavigation } from '../../utils/resetNavigation';
import useBackHandler from '../../utils/useBackHandler';
import { setRoute } from '../../redux/appSlice';
import { theme } from '../../assets';
import Button from '../../components/ButtonComponent';
import HorizontalDivider from '../../components/HorizontalDivider';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { scaleHeight, scaleWidth } from '../../styles/responsive';
import { changeLocationImg, changeLocationImgUser } from '../../assets/images';
import fonts from '../../styles/fonts';
import { requestLocationPermission } from '../../utils/cameraPermission';
import { MAP_API_KEY } from '@env';
import { updateProfile } from '../../redux/AuthModule/updateProfileSlice';
import { useAlert } from '../../providers/AlertContext';
import { MapMarker } from '../../assets/svgs';

const MapScreen = ({ navigation }) => {
    const dispatch = useDispatch();
    const { showAlert } = useAlert();
    const { currentRoute } = useSelector((state) => state.app);
    const { role } = useSelector((state) => state.auth);
    const { loading } = useSelector((state) => state.createProfile);
    const [region, setRegion] = useState({
        latitude: 37.78825,
        longitude: -122.4324,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
    });
    const [selectedLocation, setSelectedLocation] = useState({
        name: null,
        latitude: 0,
        longitude: 0,
    });
    const mapRef = useRef(null);

    const handleBackPress = () => {
        if (currentRoute?.route === SCREENS.UPDATE_USER_PROFILE) {
            dispatch(setRoute({ route: SCREENS.USER_PROFILE_DETAIL }));
        } else if (currentRoute?.route === SCREENS.UPDATE_BUDDY_PROFILE) {
            dispatch(setRoute({ route: SCREENS.BUDDY_PROFILE_DETAIL }));
        }
        resetNavigation(navigation, currentRoute?.route);
        return true;
    };
    useBackHandler(handleBackPress);

    useEffect(() => {
        const getCurrentLocation = async () => {
            const hasLocationPermission = await requestLocationPermission();
            if (hasLocationPermission) {
                const getPosition = () => new Promise((resolve, reject) => {
                    Geolocation.getCurrentPosition(resolve, reject);
                });

                const { coords: { latitude, longitude } } = await getPosition();
                const newRegion = {
                    latitude,
                    longitude,
                    latitudeDelta: 0.0922,
                    longitudeDelta: 0.0421,
                };
                const placeName = await reverseGeocode(latitude, longitude);
                setSelectedLocation({ name: placeName, latitude, longitude });
                setRegion(newRegion);
                mapRef.current?.animateToRegion(newRegion, 1000);
            }
        };
        getCurrentLocation();
    }, []);

    const reverseGeocode = async (latitude, longitude) => {
        try {
            const response = await fetch(
                `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${MAP_API_KEY}`
            );
            const data = await response.json();
            if (data.results.length > 0) {
                return data.results[0].formatted_address;
            } else {
                return null;
            }
        } catch (error) {
            console.error(error);
            return null;
        }
    };

    const handleSelectLocation = async (event) => {
        const { latitude, longitude } = event.nativeEvent.coordinate;
        const placeName = await reverseGeocode(latitude, longitude);
        setSelectedLocation({ name: placeName, latitude, longitude });
        const newRegion = { latitude, longitude, latitudeDelta: 0.0922, longitudeDelta: 0.0421 };
        mapRef.current?.animateToRegion(newRegion, 1000);
    };

    const handlePlaceSelected = (data, details) => {
        if (details) {
            const { lat, lng } = details.geometry.location;
            const placeName = details.formatted_address;
            setSelectedLocation({ name: placeName, latitude: lat, longitude: lng });
            const newRegion = { latitude: lat, longitude: lng, latitudeDelta: 0.0922, longitudeDelta: 0.0421 };
            mapRef.current?.animateToRegion(newRegion, 1000);
        }
    };

    const addLocation = () => {

        const formData = new FormData();
        formData.append('latitude', selectedLocation?.latitude);
        formData.append('longitude', selectedLocation?.longitude);
        dispatch(updateProfile(formData)).then((result) => {
            if (result?.payload?.status === "success") {
                showAlert("Success", "success", "Location added successfully.")
                setTimeout(() => {
                    handleBackPress();
                }, 3000);
            } else if (result?.payload?.status === "error") {
                showAlert("Error", "error", result?.payload?.message)
            }
        })
    }

    return (
        <View style={styles.container}>
            <View style={styles.searchContainer}>
                <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
                    <Icon name="arrow-back" size={24} color={theme.dark.primary} />
                </TouchableOpacity>
                <GooglePlacesAutocomplete
                    placeholder="Search here"
                    onPress={handlePlaceSelected}
                    query={{ key: MAP_API_KEY, language: 'en' }}
                    fetchDetails
                    onFail={(error) => console.log(error)}
                    onNotFound={() => console.log('no results')}
                    styles={{ textInput: styles.searchBar, container: styles.autoCompleteContainer }}
                    textInputProps={{ placeholderTextColor: theme.dark.inputLabel }}
                />
            </View>
            <MapView
                ref={mapRef}
                provider={PROVIDER_GOOGLE}
                style={styles.map}
                region={region}
                onPress={handleSelectLocation}
            >
                {selectedLocation.latitude !== 0 && selectedLocation.longitude !== 0 && (
                    <Marker coordinate={selectedLocation} >
                        <MapMarker />
                    </Marker>
                )}
            </MapView>
            {selectedLocation.latitude !== 0 && selectedLocation.longitude !== 0 && (
                <View style={[styles.locationInfo, { backgroundColor: role === "USER" ? theme.dark.primary : theme.dark.white }]}>
                    <View style={styles.locationDetails}>
                        <Image resizeMode='contain' style={styles.locationImage} source={role === "USER" ? changeLocationImgUser : changeLocationImg} />
                        <Text style={[styles.locationText, { color: role === "USER" ? theme.dark.white : theme.dark.primary }]}>
                            {selectedLocation.name ?? `${selectedLocation.latitude.toFixed(4)}, ${selectedLocation.longitude.toFixed(4)}`}
                        </Text>
                    </View>
                    <HorizontalDivider customStyle={styles.divider} />
                    <Button
                        onPress={addLocation}
                        loading={loading}
                        title="Add this Location"
                        customStyle={styles.addButton} />
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        ...StyleSheet.absoluteFillObject,
        flex: 1,
    },
    searchBar: {
        fontSize: scaleHeight(14),
        fontFamily: fonts.fontsType.light,
        backgroundColor: theme.dark.inputBg,
        color: theme.dark.heading,
        padding: 10,
        borderRadius: 30,
    },
    map: {
        ...StyleSheet.absoluteFillObject,
        flex: 1,
    },
    locationInfo: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: theme.dark.white,
        padding: 20,
        borderRadius: 10,
        borderTopEndRadius: 30,
        borderTopStartRadius: 30,
    },
    locationText: {
        fontSize: scaleHeight(16),
        fontFamily: fonts.fontsType.regular,
        color: theme.dark.primary,
        marginBottom: 10,
        alignSelf: 'center',
        marginHorizontal: 10,
        width: '85%',
    },
    searchContainer: {
        flexDirection: 'row',
        position: 'absolute',
        top: 30,
        left: '8%',
        right: 10,
        zIndex: 1,
        width: '80%',
        alignSelf: 'center',
    },
    backButton: {
        padding: 10,
    },
    autoCompleteContainer: {
        flex: 1,
        zIndex: 1,
    },
    locationDetails: {
        flexDirection: 'row',
    },
    locationImage: {
        width: scaleWidth(45),
        height: scaleHeight(45),
    },
    divider: {
        backgroundColor: theme.dark.inputLabel,
    },
    addButton: {
        marginBottom: 0,
    },
});

export default MapScreen;
