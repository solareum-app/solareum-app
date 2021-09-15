import React, { useEffect, useState } from 'react';
import { RefreshControl, ScrollView, Text, View, Switch } from 'react-native';
import { ListItem } from 'react-native-elements';
import { CryptoIcon } from '../../components/CryptoIcon';
import { grid } from '../../components/Styles';
import { useToken } from '../../core/AppProvider/TokenProvider';
import { FONT_SIZES } from '../../theme';
import { COLORS } from '../../theme/colors';
import { price } from '../../utils/autoRound';

const TokenInfoItem: React.FC<TokenInfoItemProps> = ({ action, ...props }) => {
  const {
    name = '$$$',
    sortName,
    symbol = '-',
    logoURI = '',
    amount = 0,
    decimals,
    usd,
    value,
  } = props.token;

  const [isEnabled, setIsEnabled] = useState(false);
  const toggleSwitch = () => setIsEnabled((previousState) => !previousState);

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
        trackColor={{ false: '#767577', true: '#81b0ff' }}
        thumbColor={isEnabled ? '#f5dd4b' : '#f4f3f4'}
        ios_backgroundColor="#3e3e3e"
        onValueChange={toggleSwitch}
        value={isEnabled}
      />
    </ListItem>
  );
};

const ManageTokenList: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const { loadAccountList, accountList } = useToken();

  const onRefresh = async () => {
    try {
      setLoading(true);
      await loadAccountList();
      setLoading(false);
    } catch {
      setLoading(false);
    }
  };

  useEffect(() => {
    onRefresh();
  }, []);

  return (
    <View style={grid.container}>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={onRefresh} />
        }
      >
        {accountList
          .filter((_item, index) => index < 10)
          ?.map((token, index: number) => (
            <TokenInfoItem key={index} token={token} />
          ))}
      </ScrollView>
    </View>
  );
};

export default ManageTokenList;
