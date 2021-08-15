import React from 'react';
import { ActivityIndicator, View, StyleSheet } from 'react-native';
import LottieView from 'lottie-react-native';

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
    height: 200,
  },
  img: {
    width: 200,
    height: 200,
  },
});

export const LoadingImage: React.FC = () => {
  return (
    <View style={s.container}>
      <LottieView
        autoPlay
        loop
        source={require('../../theme/lottie/loading.json')}
        style={s.img}
      />
    </View>
  );
};

export default LoadingIndicator;
