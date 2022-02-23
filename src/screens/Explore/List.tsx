import React from 'react';
import { ListItem } from 'react-native-elements';
import { useNavigation } from '@react-navigation/native';
import { TokenInfo } from '@solana/spl-token-registry';

import { COLORS, FONT_SIZES } from '../../theme';
import Routes from '../../navigators/Routes';
import { CryptoIcon } from '../../components/CryptoIcon';

type ItemProps = TokenInfo & {
  token: any;
};
const ExploreItem: React.FC<ItemProps> = ({ token }) => {
  const { name = '$$$', sortName, logoURI = '' } = token;

  const navigation = useNavigation();
  const onPressHandler = () => {
    navigation.navigate(Routes.ExploreItem, { token });
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
      </ListItem.Content>
      <ListItem.Chevron color="grey" />
    </ListItem>
  );
};

type ListProps = {
  balanceListInfo: any[];
};

export const ExploreList: React.FC<ListProps> = ({ balanceListInfo }) => {
  return (
    <>
      {balanceListInfo?.map((token, index) => (
        <ExploreItem key={`${index}-${token.publicKey}`} token={token} />
      ))}
    </>
  );
};

export default ExploreList;
