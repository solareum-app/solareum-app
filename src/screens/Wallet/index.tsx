import React from 'react';
import { ScrollView, View, Text, StyleSheet } from 'react-native';

import { RoundedButton } from '../../components/RoundedButton';
import { COLORS } from '../../theme/colors';
import TokensList from '../../components/TokensList';
import Header from './Header';
import { grid } from '../../components/Styles';

const s = StyleSheet.create({
  header: {
    marginTop: 20,
    marginBottom: 20,
  },
  info: {
    flex: 1,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 20,
  },
  infoBalance: {
    marginTop: 12,
    fontSize: 40,
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

const Wallet: React.FC = () => {
  return (
    <View style={grid.container}>
      <Header />
      <ScrollView>
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
        <View style={[grid.body, { padding: 10 }]}>
          <TokensList />
        </View>
      </ScrollView>
    </View>
  );
};

export default Wallet;
