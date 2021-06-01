import React from 'react';
import { ScrollView, RefreshControl, View, Text, StyleSheet } from 'react-native';

import { getWallet, getBalanceList } from '../../spl-utils/getWallet';
import { RoundedButton } from '../../components/RoundedButton';
import { COLORS } from '../../theme';
import TokensList from '../../components/TokensList';
import Header from './Header';
import { grid } from '../../components/Styles';
import { TokenListContext } from '../../core/TokenRegistryProvider';
import { price } from '../../utils/autoRound';

const s = StyleSheet.create({
  header: {
    marginTop: 20,
    marginBottom: 20,
  },
  body: {
    padding: 10,
    paddingBottom: 20,
    marginBottom: 40
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
    color: COLORS.white0
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

const getTotalEstimate = (balanceListInfo: any[], priceData: any) => {
  let total = 0;
  for (let i = 0; i < balanceListInfo.length; i++) {
    const { coingeckoId, amount, decimals } = balanceListInfo[i];
    const tokenPrice = priceData[coingeckoId] ? priceData[coingeckoId].usd : 0;
    const tokenValue = tokenPrice * amount / Math.pow(10, decimals);
    total += tokenValue;
  }
  return total;
};

class WalletScreen extends React.PureComponent {
  state = {
    init: false,
    loading: false,
    balanceList: [],
    balanceListInfo: [],
  }

  onRefresh = async () => {
    await this.loadBalance();
  }

  componentDidUpdate = async () => {
    // init the app when tokenInfos is ready
    if (this.context.tokenInfos && !this.state.init) {
      const balanceListInfo = await this.loadBalance();
      const gekcoIds = balanceListInfo.map(i => i.coingeckoId);
      this.context.setTokenList(gekcoIds);
    }
  }

  loadBalance = async () => {
    this.setState({ loading: true, init: true });

    const { tokenInfos } = this.context;
    const wallet = await getWallet();
    const balanceList = await getBalanceList(wallet);
    const balanceListInfo = balanceList.map(i => {
      const address = i.mint ? i.mint.toBase58() : '';
      const tokenInfo = tokenInfos?.find(token => token.address === address) || null;
      const coingeckoInfo = tokenInfo?.extensions?.coingeckoId
        ? { coingeckoId: tokenInfo?.extensions?.coingeckoId }
        : {};
      return {
        ...i,
        ...tokenInfo,
        ...coingeckoInfo,
      }
    });

    this.setState({
      loading: false,
      balanceList,
      balanceListInfo,
    });

    return balanceListInfo;
  }

  render() {
    const { balanceListInfo } = this.state;
    const { priceData } = this.context;
    const totalEst = getTotalEstimate(balanceListInfo, priceData);

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
            />}
        >
          <View style={s.header}>
            <View style={s.info}>
              <Text style={s.infoBalance}>${price(totalEst)}</Text>
            </View>
            <View style={s.control}>
              <View style={s.controlItem}>
                <RoundedButton onClick={() => null} title="Chuyển" iconName="upload" />
              </View>
              <View style={s.controlItem}>
                <RoundedButton onClick={() => null} title="Nhận" iconName="download" />
              </View>
            </View>
          </View>
          <View style={[grid.body, s.body]}>
            <TokensList balanceListInfo={balanceListInfo} />
          </View>
        </ScrollView>
      </View>
    );
  }
};

WalletScreen.contextType = TokenListContext;

export default WalletScreen;
