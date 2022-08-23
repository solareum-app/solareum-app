import React from 'react';
import {
  Image as NativeImage,
  ImageSourcePropType,
  StyleSheet,
  Text,
  View
} from 'react-native';
import FastImage from 'react-native-fast-image';
import { createImageProgress } from 'react-native-image-progress';
import LoadingIndicator from '../LoadingIndicator';

const Image = createImageProgress(FastImage);

type Props = {
  source: ImageSourcePropType | string | { uri: string };
  style?: any;
  resizeMode?: 'contain' | 'cover' | 'stretch' | 'center';
  onLoadEnd?: () => any;
  borderRadius?: number;
};

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  main: {
    position: 'relative',
    zIndex: 4,
  },
  img: {
    position: 'relative',
    zIndex: 2,
    overflow: 'hidden',
  },
});

const renderError = () => (
  <View style={styles.wrapper}>
    <Text>{'Empty Image'}</Text>
  </View>
);

export const ImageCached = ({
  style = {},
  source,
  resizeMode = 'cover',
  onLoadEnd = () => {},
  borderRadius = 0,
  ...props
}: Props) => {
  if (typeof source === 'number') {
    return <NativeImage {...props} source={source} style={style} />;
  }

  const normalisedSource = () => {
    const normalisedSource =
      source && typeof source.uri === 'string' && !source.uri.split('http')[1]
        ? null
        : source;
    return source && source.uri ? normalisedSource : source;
  };

  return (
    <View
      style={{
        ...styles.main,
        ...style,
      }}
    >
      <Image
        {...props}
        style={{
          ...styles.img,
          ...style,
        }}
        borderRadius={borderRadius || style.borderRadius}
        source={normalisedSource()}
        resizeMode={resizeMode}
        indicator={LoadingIndicator}
        renderError={renderError}
        onLoadEnd={onLoadEnd}
      />
    </View>
  );
};

export default ImageCached;
