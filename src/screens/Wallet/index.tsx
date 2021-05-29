import React from 'react';
import { ScrollView, RefreshControl, View, Text, StyleSheet } from 'react-native';

import { getWallet, getBalanceList } from '../../spl-utils/getWallet';
import { RoundedButton } from '../../components/RoundedButton';
import { COLORS } from '../../theme';
import TokensList from '../../components/TokensList';
import Header from './Header';
import { grid } from '../../components/Styles';

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

class WalletScreen extends React.PureComponent {
  state = {
    loading: false,
    balanceList: [],
  }

  onRefresh = async () => {
    await this.loadBalance();
  }

  async componentDidMount() {
    await this.loadBalance();
  }

  loadBalance = async () => {
    this.setState({ loading: true });

    const wallet = await getWallet();
    const balanceList = await getBalanceList(wallet);

    this.setState({
      loading: false,
      balanceList,
    })
  }

  render() {
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
              <Text style={s.infoBalance}>{'549.52 $'}</Text>
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
            <TokensList balanceList={this.state.balanceList} />
          </View>
        </ScrollView>
      </View>
    );
  }
};

export default WalletScreen;
