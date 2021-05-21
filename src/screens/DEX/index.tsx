import React, { Component } from 'react';
import { View } from 'react-native';
import { WebView } from 'react-native-webview';
// import { Connection, Account, PublicKey } from '@solana/web3.js';

import { COLORS } from '../../theme/colors';
import Header from '../Wallet/Header';
// import { Wallet } from '../../spl-utils/wallet';

const INJECTED_SCRIPT = `
window.solana = {
  platform: 'solareum',
  postMessage: (message) => {
    window.ReactNativeWebView.postMessage(JSON.stringify(message));
  },
};
`;

type Props = {};
type State = {};

// const secretKey = '';

export default class Messaging extends Component<Props, State> {
  state = {};

  constructor(props) {
    super(props);

    this.webView = React.createRef();

    // const account = new Account(secretKey);
    // const connection = new Connection('https://devnet.solana.com');
    // this.wallet = new Wallet(connection, 'custody', { account });
    // console.log('wallet', this.wallet.publicKey)
  }

  onMessage = (event: any) => {
    const data = JSON.parse(event.nativeEvent.data);
    console.log('onMessage', data);

    if (data.method === 'connect') {
      this.sendConnectMessage(data);
    }

    if (data.method === 'signTransaction') {
      this.sendReject(data);
    }
  };

  populateMessage = (payload) => {
    if (!this.webView.current) { return; }
    this.webView.current.postMessage(JSON.stringify({
      isRN: true,
      ...payload,
    }));
  }

  sendReject = (message: any) => {
    this.populateMessage({
      error: 'Transaction cancelled',
      id: message.id,
    })
  };

  sendConnectMessage = (message: any) => {
    this.populateMessage({
      method: 'connected',
      params: {
        publicKey: 'FZ5MNLTWftEd1ciiRBMDgKsvL5CuEngm6q3rUNb6qHey',
        autoApprove: true,
      },
      id: message.id,
    });
  };

  render() {
    return (
      <View style={{ flex: 1 }}>
        <Header />
        <WebView
          // source={{ uri: 'http://localhost:5000' }}
          source={{ uri: 'https://dex.solareum.app' }}
          ref={this.webView}
          style={{ backgroundColor: COLORS.dark0 }}
          containerStyle={{ backgroundColor: COLORS.dark0 }}
          injectedJavaScriptBeforeContentLoaded={INJECTED_SCRIPT}
          automaticallyAdjustContentInsets={false}
          onMessage={this.onMessage}
          textZoom={100}
          pullToRefreshEnabled={true}
        />
      </View>
    );
  }
}
