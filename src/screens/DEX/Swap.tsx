import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';
import bs58 from 'bs58';

import Header from '../Wallet/Header';
import { AppContext } from '../../core/AppProvider/AppProvider';
import { LoadingImage } from '../../components/LoadingIndicator';
import { JUPITER } from '../../config';

const INJECTED_SCRIPT = `
window.solana = {
  platform: 'solareum',
  autoConnect: true,
  postMessage: (message) => {
    window.ReactNativeWebView.postMessage(JSON.stringify(message));
  },
};
`;

const s = StyleSheet.create({
  main: {
    flex: 1,
    backgroundColor: '#282830',
  },
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  loading: {
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
});

type Props = {
  from?: string;
  to?: string;
};
type State = {};

export default class SolareumSwap extends Component<Props, State> {
  state = {
    walletAddress: '',
    height: 0,
  };

  constructor(props) {
    super(props);

    this.state = { height: props.height };
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

  // no re-render needed
  shouldComponentUpdate() {
    return false;
  }

  onMessage = async (event: any) => {
    const data = JSON.parse(event.nativeEvent.data);

    if (data.method === 'connect') {
      this.sendConnectMessage(data);
    }

    if (data.method === 'signTransaction') {
      this.sendSignature(data);
    }

    if (data.method === 'signAllTransactions') {
      this.sendAllSignatures(data);
    }
  };

  populateMessage = (payload) => {
    if (!this.webView.current) {
      return;
    }
    this.webView.current.postMessage(
      JSON.stringify({
        isRN: true,
        ...payload,
      }),
    );
  };

  sendSignature = async (payload) => {
    try {
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
    } catch {
      this.populateMessage({
        error: 'There are some errors, please try again later.',
        id: payload.id,
      });
    }
  };

  sendAllSignatures = async (payload) => {
    let signatures;
    try {
      const messages = payload.params.messages.map((m) => bs58.decode(m));
      signatures = await Promise.all(
        messages.map((m) => this.wallet.createSignature(m)),
      );

      this.populateMessage({
        result: {
          signatures,
          publicKey: this.wallet.publicKey.toBase58(),
        },
        id: payload.id,
      });
    } catch {
      this.populateMessage({
        error: 'There are some errors, please try again later.',
        id: payload.id,
      });
    }
  };

  sendReject = (payload: any) => {
    this.populateMessage({
      error: 'Transaction cancelled',
      id: payload.id,
    });
  };

  sendConnectMessage = (payload: any) => {
    this.populateMessage({
      method: 'connected',
      params: {
        publicKey: this.wallet.publicKey.toBase58(),
        autoApprove: true,
        autoSettle: true,
      },
      id: payload.id,
    });
  };

  render() {
    const { route = {} } = this.props;
    const { from = 'USDC', to = 'XSB' } = route.params || {};
    const uri = `${JUPITER}/swap/${from}-${to}`;

    return (
      <View style={{ ...s.main, height: this.state.height }}>
        <Header isBack />
        <WebView
          source={{ uri }}
          ref={this.webView}
          style={s.container}
          injectedJavaScriptBeforeContentLoaded={INJECTED_SCRIPT}
          automaticallyAdjustContentInsets={false}
          onMessage={this.onMessage}
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
  }
}

SolareumSwap.contextType = AppContext;
