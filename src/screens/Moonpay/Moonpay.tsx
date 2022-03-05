import React from 'react';
import { View, StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';

import { LoadingImage } from '../../components/LoadingIndicator';

const s = StyleSheet.create({
  main: {
    flex: 1,
    backgroundColor: '#282830',
  },
  container: {
    flex: 1,
    backgroundColor: 'transparent',
    paddingBottom: 40,
  },
  loading: {
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
});

export const MoonPay = () => {
  let uri = 'https://buy.moonpay.com?currencyCode=SOL';

  return (
    <View style={s.main}>
      <WebView
        source={{ uri }}
        style={s.container}
        automaticallyAdjustContentInsets={false}
        textZoom={100}
        pullToRefreshEnabled={true}
        startInLoadingState={true}
        renderLoading={() => (
          <View style={s.loading}>
            <LoadingImage />
          </View>
        )}
      />
    </View>
  );
};
