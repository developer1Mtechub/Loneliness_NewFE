import React from 'react';
import { View, StyleSheet } from 'react-native';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import { theme } from '../assets';
import { scaleHeight } from '../styles/responsive';

const Skeleton = () => {
    return (
        <View
            style={styles.wrapper}>
            <SkeletonPlaceholder
                speed={900}
                backgroundColor={theme.dark.inputBg}
            >
                <SkeletonPlaceholder.Item flexDirection="row" alignItems="center" >
                    <SkeletonPlaceholder.Item width={60} height={70} borderRadius={12} />
                    <SkeletonPlaceholder.Item flex={1} marginLeft={10}>
                        <SkeletonPlaceholder.Item width={120} height={20} borderRadius={4} />
                        <SkeletonPlaceholder.Item marginTop={6} width={80} height={20} borderRadius={4} />
                        <SkeletonPlaceholder.Item marginTop={6} width={150} height={20} borderRadius={4} />
                        {/* <SkeletonPlaceholder.Item marginTop={6} width={100} height={20} borderRadius={4} /> */}
                    </SkeletonPlaceholder.Item>
                </SkeletonPlaceholder.Item>
                <SkeletonPlaceholder.Item marginTop={10} width="100%" height={1} borderRadius={4} />
                <SkeletonPlaceholder.Item flexDirection="row" alignItems="center" marginTop={10}>
                    <SkeletonPlaceholder.Item width={20} height={20} borderRadius={4} />
                    <SkeletonPlaceholder.Item marginLeft={10} width={200} height={20} borderRadius={4} />
                </SkeletonPlaceholder.Item>
            </SkeletonPlaceholder >
        </View>
    );
};

// Define your styles
const styles = StyleSheet.create({
    wrapper: {
        backgroundColor: theme.dark.inputBackground,
        borderWidth: 1,
        borderColor: theme.dark.inputLabel,
        margin: 8,
        borderRadius: 20,
        padding: 8,
        marginTop: 10,
        height: scaleHeight(130)
    }
});

export default Skeleton;
