import React from 'react';
import { ActivityIndicator, View, StyleSheet, Image } from 'react-native';
import imgMessageSent from '../../assets/clip-message-sent.png';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export const LoadingIndicator: React.FC = () => {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="small" />
    </View>
  );
};

const s = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'green',
  },
  img: {
    width: 200,
    height: 200,
  },
});

export const LoadingImage: React.FC = () => {
  return (
    <View style={styles.container}>
      <Image source={imgMessageSent} style={s.img} />
    </View>
  );
};

export default LoadingIndicator;
