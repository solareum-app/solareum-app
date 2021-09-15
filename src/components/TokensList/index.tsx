import React from 'react';
import { Text } from 'react-native';
import { ListItem } from 'react-native-elements';
import { useNavigation } from '@react-navigation/native';

import { COLORS, FONT_SIZES } from '../../theme';
import Routes from '../../navigators/Routes';
import { price } from '../../utils/autoRound';
import { CryptoIcon } from '../CryptoIcon';

type TokenInfoItemProps = TokenInfo & {
  action?: string;
};
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
  const navigation = useNavigation();
  const onPressHandler = () => {
    navigation.navigate(Routes.Token, { token: props.token, action });
  };

  return (
    <ListItem
      bottomDivider
      onPress={onPressHandler}
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
      <ListItem.Content right style={{ flex: 1 }}>
        <ListItem.Title
          style={{
            color: COLORS.white0,
            fontSize: FONT_SIZES.md,
          }}
        >
          {`${price(amount / Math.pow(10, decimals))} ${symbol.toUpperCase()}`}
        </ListItem.Title>
        <ListItem.Subtitle
          style={{ color: COLORS.white4, fontSize: FONT_SIZES.sm }}
        >
          {`$${price(value)}`}
        </ListItem.Subtitle>
      </ListItem.Content>
    </ListItem>
  );
};

type TokensListProps = {
  balanceListInfo: any[];
  action?: string;
};

const TokensList: React.FC<TokensListProps> = ({ balanceListInfo, action }) => {
  return (
    <>
      {balanceListInfo?.map((token, index: number) => (
        <TokenInfoItem key={index} token={token} action={action} />
      ))}
    </>
  );
};

export default TokensList;
