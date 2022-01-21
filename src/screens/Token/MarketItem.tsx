import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/core';
import { CryptoIcon } from '../../components/CryptoIcon';
import Icon from '../../components/Icon';

import { COLORS } from '../../theme/colors';
import Routes from '../../navigators/Routes';
import { useToken } from '../../core/AppProvider/TokenProvider';

const s = StyleSheet.create({
  main: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.dark4,
  },
  iconBase: {
    width: 36,
    height: 36,
  },
  iconQuote: {
    width: 36,
    height: 36,
    marginLeft: -8,
    zIndex: -1,
  },
  name: {
    color: COLORS.white2,
    fontSize: 16,
    lineHeight: 24,
    marginLeft: 12,
    flex: 1,
  },
  icon: {
    color: COLORS.white2,
  },
});

type Props = {
  from: string;
  to: string;
};

export const MarketItem = ({ from, to }: Props) => {
  const { tokenInfos } = useToken();
  const navigation = useNavigation();

  const base = tokenInfos.find((i) => i.symbol === from);
  const quote = tokenInfos.find((i) => i.symbol === to);

  const navToDex = () => {
    navigation.navigate(Routes.Swap, { from, to });
  };

  return (
    <TouchableOpacity style={s.main} onPress={navToDex}>
      <View style={s.iconBase}>
        <CryptoIcon uri={base.logoURI} size={36} />
      </View>
      <View style={s.iconQuote}>
        <CryptoIcon uri={quote.logoURI} size={36} />
      </View>
      <Text style={s.name}>
        {from}-{to}
      </Text>
      <View style={s.icon}>
        <Icon type="feather" name="chevron-right" color={COLORS.white4} />
      </View>
    </TouchableOpacity>
  );
};
