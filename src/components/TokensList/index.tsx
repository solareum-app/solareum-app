import React from 'react';
import { Text } from 'react-native';
import { Avatar, ListItem } from 'react-native-elements';
import { useNavigation } from '@react-navigation/native';

import { COLORS, FONT_SIZES } from '../../theme';
import Routes from '../../navigators/Routes';
import { usePrice } from '../../core/TokenRegistryProvider';
import { price } from '../../utils/autoRound';

const isValidUrl = (url: string) => {
  const urlRegex = new RegExp("^" + // protocol identifier
    "(?:(?:https?|ftp)://)?" + // ** mod: make scheme optional
    // user:pass authentication
    "(?:\\S+(?::\\S*)?@)?" + "(?:" + // IP address exclusion
    // private & local networks
    // "(?!(?:10|127)(?:\\.\\d{1,3}){3})" +   // ** mod: allow local networks
    // "(?!(?:169\\.254|192\\.168)(?:\\.\\d{1,3}){2})" +  // ** mod: allow local networks
    // "(?!172\\.(?:1[6-9]|2\\d|3[0-1])(?:\\.\\d{1,3}){2})" +  // ** mod: allow local networks
    // IP address dotted notation octets
    // excludes loopback network 0.0.0.0
    // excludes reserved space >= 224.0.0.0
    // excludes network & broacast addresses
    // (first & last IP address of each class)
    "(?:[1-9]\\d?|1\\d\\d|2[01]\\d|22[0-3])" + "(?:\\.(?:1?\\d{1,2}|2[0-4]\\d|25[0-5])){2}" + "(?:\\.(?:[1-9]\\d?|1\\d\\d|2[0-4]\\d|25[0-4]))" + "|" + // host name
    "(?:(?:[a-zA-Z\\u00a1-\\uffff0-9]-*)*[a-zA-Z\\u00a1-\\uffff0-9]+)" + // domain name
    "(?:\\.(?:[a-zA-Z\\u00a1-\\uffff0-9]-*)*[a-zA-Z\\u00a1-\\uffff0-9]+)*" + // TLD identifier
    "(?:\\.(?:[a-zA-Z\\u00a1-\\uffff]{2,}))" + ")" + // port number
    "(?::\\d{2,5})?" + // resource path
    "(?:/\\S*)?" + "$");

  return urlRegex.test(url);
};

type TokenInfoItemProps = TokenInfo & {};
const TokenInfoItem: React.FC<TokenInfoItemProps> = (props) => {
  const {
    name = 'Undefined',
    symbol = '---',
    logoURI = '',
    amount,
    decimals,
    coingeckoId
  } = props.token;
  const navigation = useNavigation();
  const priceData = usePrice();
  const tokenPrice = priceData[coingeckoId] ? priceData[coingeckoId].usd : 0;
  const tokenEst = tokenPrice * amount / Math.pow(10, decimals);

  const onPressHandler = React.useCallback(() => {
    navigation.navigate(Routes.Token, { token: props.token });
  }, [navigation, name]);

  return (
    <ListItem bottomDivider onPress={onPressHandler}
      containerStyle={{ backgroundColor: COLORS.dark0, borderBottomColor: COLORS.dark4 }}>
      {logoURI && isValidUrl(logoURI) ? (
        <Avatar rounded source={{ uri: logoURI }} />
      ) : (
        <Avatar rounded title={symbol.toUpperCase()} />
      )}
      <ListItem.Content>
        <ListItem.Title style={{ color: COLORS.white0, fontSize: FONT_SIZES.md }}>{name}</ListItem.Title>
        <ListItem.Subtitle style={{ color: COLORS.white4, fontSize: FONT_SIZES.sm }}>
          <Text>{`$${price(tokenPrice)}`}</Text>
        </ListItem.Subtitle>
      </ListItem.Content>
      <ListItem.Content right style={{ flex: 1 }}>
        <ListItem.Title style={{
          color: COLORS.white0,
          fontSize: FONT_SIZES.md
        }}
        >
          {`${price(amount / Math.pow(10, decimals))} ${symbol.toUpperCase()}`}
        </ListItem.Title>
        <ListItem.Subtitle style={{ color: COLORS.white4, fontSize: FONT_SIZES.sm }}>
          {`$${price(tokenEst)}`}
        </ListItem.Subtitle>
      </ListItem.Content>
    </ListItem>
  );
};

type TokensListProps = {
  action?: 'list_all';
  query?: string;
  balanceListInfo: any[]
};
const TokensList: React.FC<TokensListProps> = ({ query = '', balanceListInfo }) => {
  return (
    <>
      {balanceListInfo?.map((token, index: number) => (
        <TokenInfoItem key={index} token={token} />
      ))}
    </>
  );
};

export default TokensList;
