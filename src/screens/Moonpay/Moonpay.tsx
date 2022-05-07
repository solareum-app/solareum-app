import crypto from 'crypto';
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
  // const { accountList } = usePrice();
  // const solAccount = accountList.find((i) => i.mint === 'SOL');
  // const solAddress = solAccount?.publicKey || '';

  const domain = 'https://buy-sandbox.moonpay.com';
  const apiKey = 'pk_test_4ero3l8ywK2v2itW8Iy8PurUd3JZju';
  const currencyCode = 'BTC';
  const address = 'tb1q45h8zexwztmz3nyd8gmkxhpavdsva4znwwhzvs';
  let originalUrl = `${domain}?apiKey=${apiKey}&currencyCode=${currencyCode}&walletAddress=${address}`;

  const signature = crypto
    .createHmac('sha256', 'sk_test_eSLzoHMfwRXFdPTQG7Upy1YbVcwhTdMP')
    .update(new URL(originalUrl).search)
    .digest('base64');

  const uri = `${originalUrl}&signature=${encodeURIComponent(signature)}`;

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
