import React, { Component } from 'react';
import { View } from 'react-native';
import { WebView } from 'react-native-webview';
import { Connection } from '@solana/web3.js';
import bs58 from 'bs58';

import { COLORS } from '../../theme/colors';
import Header from '../Wallet/Header';
import { Wallet } from '../../spl-utils/wallet';
import { getAccountFromSeed, mnemonicToSeed } from '../../spl-utils/wallet-account';

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

// Testing account
const recoveryPhrase = 'unveil dust trophy deputy wear sorry limb announce initial seek property edge area target broken suspect rapid that job next toast expose enable prison';


export default class Messaging extends Component<Props, State> {
  state = {};

  constructor(props) {
    super(props);

    this.webView = React.createRef();
  }

  async componentDidMount() {
    const seed = await mnemonicToSeed(recoveryPhrase);
    const seedBuffer = Buffer.from(seed, 'hex');
    const connection = new Connection('https://solana-api.projectserum.com');

    account = getAccountFromSeed(seedBuffer, 0);
    this.wallet = new Wallet(connection, 'custody', { account });
  }

  onMessage = async (event: any) => {
    const data = JSON.parse(event.nativeEvent.data);

    if (data.method === 'connect') {
      this.sendConnectMessage(data);
    }

    if (data.method === 'signTransaction') {
      this.sendSignature(data);
    }
  };

  populateMessage = (payload) => {
    if (!this.webView.current) { return; }
    this.webView.current.postMessage(JSON.stringify({
      isRN: true,
      ...payload,
    }));
  }

  sendSignature = async (payload) => {
    const encodedMessage = payload.params.message;
    const message = bs58.decode(encodedMessage);
    const signature = await this.wallet.createSignature(message);
    this.populateMessage({
      result: {
        signature,
        publicKey: this.wallet.publicKey.toBase58(),
      },
      id: payload.id,
    });
  }

  sendReject = (payload: any) => {
    this.populateMessage({
      error: 'Transaction cancelled',
      id: payload.id,
    })
  };

  sendConnectMessage = (payload: any) => {
    this.populateMessage({
      method: 'connected',
      params: {
        publicKey: this.wallet.publicKey.toBase58(),
        autoApprove: true,
      },
      id: payload.id,
    });
  };

  render() {
    return (
      <View style={{ flex: 1 }}>
        <Header />
        <WebView
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
