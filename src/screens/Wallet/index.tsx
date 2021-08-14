import React from 'react';
import {
  ScrollView,
  RefreshControl,
  View,
  Text,
  StyleSheet,
} from 'react-native';
import Clipboard from '@react-native-community/clipboard';

import { RoundedButton } from '../../components/RoundedButton';
import { COLORS } from '../../theme';
import TokensList from '../../components/TokensList';
import Header from './Header';
import { grid } from '../../components/Styles';
import { AppContext } from '../../core/AppProvider';
import { price } from '../../utils/autoRound';
import { Routes } from '../../navigators/Routes';

const s = StyleSheet.create({
  header: {
    marginTop: 20,
    marginBottom: 20,
  },
  body: {
    padding: 10,
    paddingBottom: 20,
    marginBottom: 40,
  },
  info: {
    flex: 1,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 20,
  },
  infoBalance: {
    marginTop: 12,
    fontSize: 36,
    color: COLORS.white0,
  },
  control: {
    flexDirection: 'row',
    marginLeft: 'auto',
    marginRight: 'auto',
    marginBottom: 20,
  },
  controlItem: {
    marginLeft: 12,
    marginRight: 12,
  },
});

const getTotalEstimate = (balanceListInfo: any[]) => {
  let total = 0;
  for (let i = 0; i < balanceListInfo.length; i++) {
    const { usd, amount, decimals } = balanceListInfo[i];
    const tokenValue = (usd * amount) / Math.pow(10, decimals);
    total += tokenValue;
  }
  return total;
};

export enum TransferAction {
  send = 'send',
  receive = 'receive',
}

class WalletScreen extends React.PureComponent {
  state = {
    loading: false,
    address: '',
  };

  onRefresh = async () => {
    this.setState({ loading: true });
    try {
      await this.loadBalance();
      this.setState({ loading: false });
    } catch (err) {
      this.setState({ loading: false });
    }
  };

  componentDidMount() {
    if (this.context.wallet && this.context.tokenInfos) {
      this.onRefresh();
    }
  }

  componentDidUpdate = async (_, prevState: any) => {
    if (this.context.wallet && this.context.tokenInfos) {
      this.setState({ address: this.context.wallet.address });
    }
    // init the app when tokenInfos is ready
    if (prevState.address !== this.state.address) {
      this.onRefresh();
    }
  };

  loadBalance = async () => {
    const { loadAccountList } = this.context;
    await loadAccountList();
  };

  render() {
    const { wallet, accountList } = this.context;
    const activeAccountList = accountList
      .filter((i) => i.mint)
      .sort((a, b) => b.value - a.value);
    const totalEst = getTotalEstimate(activeAccountList);

    return (
      <View style={grid.container}>
        <Header />
        <ScrollView
          refreshControl={
            <RefreshControl
              refreshing={this.state.loading}
              onRefresh={this.onRefresh}
              colors={[COLORS.white2]}
              tintColor={COLORS.white2}
            />
          }
        >
          <View style={s.header}>
            <View style={s.info}>
              <Text style={s.infoBalance}>${price(totalEst)}</Text>
            </View>
            <View style={s.control}>
              <View style={s.controlItem}>
                <RoundedButton
                  onClick={() => {
                    this.props.navigation.navigate(Routes.Search, {
                      action: TransferAction.send,
                    });
                  }}
                  title="Chuyển"
                  iconName="upload"
                />
              </View>
              <View style={s.controlItem}>
                <RoundedButton
                  onClick={() => {
                    this.props.navigation.navigate(Routes.Search, {
                      action: TransferAction.receive,
                    });
                  }}
                  title="Nhận"
                  iconName="download"
                />
              </View>
              <View style={s.controlItem}>
                <RoundedButton
                  onClick={() => {
                    Clipboard.setString(wallet.publicKey.toBase58());
                  }}
                  title="Copy"
                  iconName="copy"
                  type="feather"
                />
              </View>
            </View>
          </View>
          <View style={[grid.body, s.body]}>
            <TokensList balanceListInfo={activeAccountList} />
          </View>
        </ScrollView>
      </View>
    );
  }
}

WalletScreen.contextType = AppContext;

export default WalletScreen;
