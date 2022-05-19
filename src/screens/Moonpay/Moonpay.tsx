import crypto from 'crypto';
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';

import { LoadingImage } from '../../components/LoadingIndicator';
import { usePrice } from '../../core/AppProvider/PriceProvider';

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
  const { accountList } = usePrice();
  const solAccount = accountList.find((i) => i.mint === 'SOL');

  const domain = 'https://buy.moonpay.com';
  const apiKey = 'pk_live_tKheUMl9D8t4rsNQOwjrqUnjZkFBpkc9';
  const currencyCode = 'SOL';
  const address = solAccount?.publicKey || '';
  let originalUrl = `${domain}?apiKey=${apiKey}&currencyCode=${currencyCode}&walletAddress=${address}`;

  const signature = crypto
    .createHmac('sha256', 'sk_live_VvoeOgLYL0HRSxARJfNhYWqLbOOPFc')
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
