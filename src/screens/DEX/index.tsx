import React from 'react';
import { View } from 'react-native';
import { WebView as RNWebView } from 'react-native-webview';

import { COLORS } from '../../theme/colors';
import Header from '../Wallet/Header';

const DEX = () => {
  return (
    <View style={{ flex: 1 }}>
      <Header />
      <RNWebView
        source={{ uri: 'https://dex.solareum.app' }}
        style={{ backgroundColor: COLORS.dark0 }}
        containerStyle={{ backgroundColor: COLORS.dark0 }}
      />
    </View>
  );
};

export default DEX;
