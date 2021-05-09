import React from 'react';
import { Text } from 'react-native';
import { Avatar, ListItem } from 'react-native-elements';
import { useNavigation } from '@react-navigation/native';
import { TokenInfo } from '@solana/spl-token-registry';

import { COLORS } from '../../theme/colors';
import Routes from '../../navigators/Routes';
import { useTokenInfos } from '../../core/TokenRegistryProvider';

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
      {logoURI ? (
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
