import React from 'react';
import { View } from 'react-native';
import { WebView as RNWebView } from 'react-native-webview';

import Header from '../Wallet/Header';

const DEX = () => {
  return (
    <View style={{ flex: 1 }}>
      <Header />
      <RNWebView
        source={{ uri: 'https://swap.solareum.app' }}
        style={{ backgroundColor: 'rgb(27, 23, 23)' }}
        containerStyle={{ backgroundColor: 'rgb(27, 23, 23)' }}
      />
    </View>
  );
};

export default DEX;
