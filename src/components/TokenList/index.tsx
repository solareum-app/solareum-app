import { CryptoIcon } from '@Components/CryptoIcon';
import Routes from '@Navigators/Routes';
import { useNavigation } from '@react-navigation/native';
import { TokenInfo } from '@solana/spl-token-registry';
import { COLORS, FONT_SIZES } from '@Theme/index';
import { price } from '@Utils/autoRound';
import React from 'react';
import { Text } from 'react-native';
import { ListItem } from 'react-native-elements';

type TokenInfoItemProps = TokenInfo & {
  action?: string;
  isHideBalance: boolean;
  token: any;
};
const TokenInfoItem: React.FC<TokenInfoItemProps> = ({
  action,
  isHideBalance,
  token,
}) => {
  const {
    name = '$$$',
    sortName,
    symbol = '-',
    logoURI = '',
    amount = 0,
    decimals,
    usd,
    value,
  } = token;

  const displayValue = amount / Math.pow(10, decimals);
  const navigation = useNavigation();
  const onPressHandler = () => {
    navigation.navigate(Routes.Token, { token, action });
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
          {isHideBalance
            ? '****'
            : `${price(displayValue)} ${symbol.toUpperCase()}`}
        </ListItem.Title>
        <ListItem.Subtitle
          style={{ color: COLORS.white4, fontSize: FONT_SIZES.sm }}
        >
          {isHideBalance ? '****' : `$${price(value)}`}
        </ListItem.Subtitle>
      </ListItem.Content>
    </ListItem>
  );
};

type TokensListProps = {
  balanceListInfo: any[];
  action?: string;
  isHideBalance: boolean;
};

const TokensList: React.FC<TokensListProps> = ({
  balanceListInfo,
  action,
  isHideBalance,
}) => {
  return (
    <>
      {balanceListInfo?.map((token, index) => (
        <TokenInfoItem
          key={`${index}-${token.publicKey}`}
          isHideBalance={isHideBalance}
          token={token}
          action={action}
        />
      ))}
    </>
  );
};

export default TokensList;
