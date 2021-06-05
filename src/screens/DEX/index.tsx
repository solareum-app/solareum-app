import React, { Component } from 'react';
import { View } from 'react-native';
import { WebView } from 'react-native-webview';
import bs58 from 'bs58';

import { COLORS } from '../../theme/colors';
import Header from '../Wallet/Header';
import { TokenListContext } from '../../core/TokenRegistryProvider';

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

export default class SolareumDEX extends Component<Props, State> {
  state = {
    walletAddress: '',
  };

  constructor(props) {
    super(props);

    this.webView = React.createRef();
  }

  async componentDidMount() {
    this.wallet = this.context.wallet;
  }

  componentDidUpdate() {
    if (this.context.wallet.address !== this.state.walletAddress) {
      this.wallet = this.context.wallet;
      this.setState({ walletAddress: this.context.wallet.address });
      this.webView.current.reload();
    }
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

SolareumDEX.contextType = TokenListContext;
