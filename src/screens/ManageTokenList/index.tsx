import React, { useState } from 'react';
import { RefreshControl, ScrollView, Text, View, Switch } from 'react-native';
import { ListItem } from 'react-native-elements';
import { CryptoIcon } from '../../components/CryptoIcon';
import { grid } from '../../components/Styles';
import { IAccount } from '../../core/AppProvider/IAccount';
import { useToken } from '../../core/AppProvider/TokenProvider';
import { FONT_SIZES } from '../../theme';
import { COLORS } from '../../theme/colors';
import { price } from '../../utils/autoRound';

const TokenInfoItem: React.FC<TokenInfoItemProps> = ({
  toggleAccountByPk,
  token,
}) => {
  const { name = '$$$', sortName, logoURI = '', usd } = token;
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
          <Text>{`$${price(usd)}`}</Text>
        </ListItem.Subtitle>
      </ListItem.Content>
      <Switch
        trackColor={{ false: COLORS.white4, true: COLORS.white4 }}
        thumbColor={active ? COLORS.blue4 : COLORS.dark4}
        ios_backgroundColor={COLORS.dark4}
        onValueChange={toggleSwitch}
        value={active}
      />
    </ListItem>
  );
};

const ManageTokenList: React.FC = () => {
  const [loading] = useState(false);
  const { accountList, toggleAccountByPk } = useToken();

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
