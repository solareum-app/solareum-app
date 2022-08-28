import { CryptoIcon } from '@Components/CryptoIcon';
import { grid } from '@Components/Styles';
import { IAccount } from '@Core/AppProvider/IAccount';
import { usePrice } from '@Core/AppProvider/PriceProvider';
import { useToken } from '@Core/AppProvider/TokenProvider';
import { COLORS } from '@Theme/colors';
import { FONT_SIZES } from '@Theme/index';
import { price } from '@Utils/autoRound';
import React, { useState } from 'react';
import { RefreshControl, ScrollView, Switch, Text, View } from 'react-native';
import { ListItem } from 'react-native-elements';

const TokenInfoItem = ({ toggleAccountByPk, token }) => {
  const {
    name = '$$$',
    sortName,
    symbol = '-',
    logoURI = '',
    amount = 0,
    decimals,
  } = token;
  const displayValue = amount / Math.pow(10, decimals);
  const active = !token.isHiding;

  const toggleSwitch = () => {
    toggleAccountByPk(token.publicKey);
  };

  return (
    <ListItem
      bottomDivider
      containerStyle={{
        backgroundColor: COLORS.dark0,
        borderBottomColor: COLORS.dark4,
      }}
    >
      <CryptoIcon rounded uri={logoURI} />
      <ListItem.Content>
        <ListItem.Title
          style={{ color: COLORS.white0, fontSize: FONT_SIZES.lg }}
        >
          {sortName || name}
        </ListItem.Title>
        <ListItem.Subtitle
          style={{ color: COLORS.white4, fontSize: FONT_SIZES.sm }}
        >
          <Text>
            {price(displayValue)} {symbol.toUpperCase()}
          </Text>
        </ListItem.Subtitle>
      </ListItem.Content>
      <Switch
        trackColor={{ false: COLORS.white4, true: COLORS.white4 }}
        thumbColor={active ? COLORS.success : COLORS.dark4}
        ios_backgroundColor={COLORS.dark4}
        onValueChange={toggleSwitch}
        value={active}
      />
    </ListItem>
  );
};

const ManageTokenList: React.FC = () => {
  const [loading] = useState(false);
  const { toggleAccountByPk } = useToken();
  const { accountList } = usePrice();

  const onRefresh = () => null;

  const activeAccountList = accountList
    .filter((i: IAccount) => i.mint)
    .sort((a, b) => {
      return b.refValue - a.refValue;
    });

  return (
    <View style={grid.container}>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={onRefresh} />
        }
      >
        {activeAccountList.map((token, index: number) => (
          <TokenInfoItem
            key={index}
            token={token}
            toggleAccountByPk={toggleAccountByPk}
          />
        ))}
      </ScrollView>
    </View>
  );
};

export default ManageTokenList;
