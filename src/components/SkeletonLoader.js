import React from 'react';
import { View, StyleSheet } from 'react-native';
import Skeleton from './Skeleton';

const SkeletonLoader = () => {
    const skeletonItems = Array.from({ length: 8 }, (_, index) => index);

    return (
        <View style={styles.container}>
            {skeletonItems.map((item) => (
                <Skeleton key={item} />
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
});

export default SkeletonLoader;
