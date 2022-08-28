import { CryptoIcon } from '@Components/CryptoIcon';
import { typo } from '@Components/Styles';
import Routes from '@Navigators/Routes';
import { useNavigation } from '@react-navigation/native';
import { TokenInfo } from '@solana/spl-token-registry';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';

const s = StyleSheet.create({
  main: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    margin: 5,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  title: {
    ...typo.title,
    fontWeight: 'normal',
    marginTop: 4,
  },
});

type ItemProps = TokenInfo & {
  token: any;
};

export const PromoteItem: React.FC<ItemProps> = ({ token }) => {
  const { name = '$$$', sortName, logoURI = '' } = token;

  const navigation = useNavigation();
  const onPressHandler = () => {
    navigation.navigate(Routes.ExploreItem, { token });
  };

  return (
    <TouchableOpacity style={s.main} onPress={onPressHandler}>
      <CryptoIcon rounded uri={logoURI} />
      <Text style={s.title}>{sortName || name}</Text>
    </TouchableOpacity>
  );
};
