import React from 'react';
import { Image } from 'react-native';
import { emptyStar, ratingStar } from '../assets/images';

const CustomStarIcon = ({ size, color, type }) => {
    let source;

    switch (type) {
        case 'full':
            source = ratingStar;
            break;
        // case 'half':
        //     source = halfStarImage;
        //     break;
        case 'empty':
            source = emptyStar;
            break;
        default:
            source = emptyStar;
    }

    return <Image resizeMode='contain' style={{ width: size, height: size }} source={source} />;
};

export default CustomStarIcon;