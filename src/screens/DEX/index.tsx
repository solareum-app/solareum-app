import React from 'react';
import { View, SafeAreaView } from 'react-native';
import { WebView as RNWebView } from 'react-native-webview';

const DEX = () => {
  return (
    <View style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 1 }}>
        <RNWebView
          source={{ uri: 'https://swap.solareum.app' }}
        />
      </SafeAreaView>
    </View>
  );
};

export default DEX;
