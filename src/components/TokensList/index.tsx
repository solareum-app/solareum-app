import React from 'react';
import { Text } from 'react-native';
import { Avatar, ListItem } from 'react-native-elements';
import { useNavigation } from '@react-navigation/native';
import { TokenInfo } from '@solana/spl-token-registry';

import { COLORS } from '../../theme/colors';
import Routes from '../../navigators/Routes';
import { useTokenInfos } from '../../core/TokenRegistryProvider';

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

type PriceWithChangeProps = {
  symbol: string;
};
const PriceWithChange: React.FC<PriceWithChangeProps> = ({ symbol }) => {
  React.useEffect(() => { }, [symbol]);

  return (
    <>
      <Text>{`$ 500.91 `}</Text>
      <Text>{`+4.16% `}</Text>
    </>
  );
};

type TokenInfoItemProps = TokenInfo & {};
const TokenInfoItem: React.FC<TokenInfoItemProps> = (props) => {
  const { symbol, name, logoURI } = props;
  const navigation = useNavigation();

  const onPressHandler = React.useCallback(() => {
    navigation.navigate(Routes.Token, { token: name });
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
        <ListItem.Title style={{ color: COLORS.white0 }}>{name}</ListItem.Title>
        <ListItem.Subtitle style={{ color: COLORS.white4 }}>
          <PriceWithChange symbol={symbol} />
        </ListItem.Subtitle>
      </ListItem.Content>
      <ListItem.Content right>
        <ListItem.Title style={{ color: COLORS.white0 }}>{`0.2 ${symbol.toUpperCase()}`}</ListItem.Title>
        <ListItem.Subtitle style={{ color: COLORS.white2 }}>{'26,02 $'}</ListItem.Subtitle>
      </ListItem.Content>
    </ListItem>
  );
};

type TokensListProps = {
  action?: 'list_all';
  query?: string;
};
const TokensList: React.FC<TokensListProps> = ({ query = '' }) => {
  const tokenInfos = useTokenInfos();
  const filteredTokens = React.useMemo(
    () =>
      tokenInfos?.filter(
        (t) =>
          t.symbol.toLowerCase().includes(query.toLowerCase()) ||
          t.name.toLowerCase().includes(query.toLowerCase()),
      ),
    [tokenInfos, query],
  );
  return (
    <>
      {filteredTokens?.map((token: TokenInfo, index: number) => (
        <TokenInfoItem key={index} {...token} />
      ))}
    </>
  );
};

export default TokensList;
