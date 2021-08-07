import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MarketInfo } from '../../core/AppProvider/MarketProvider';
import { useNavigation } from '@react-navigation/core';
import { CryptoIcon } from '../../components/CryptoIcon';
import Icon from '../../components/Icon';

import { COLORS } from '../../theme/colors';
import Routes from '../../navigators/Routes';

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
  item: MarketInfo;
};

export const MarketItem = ({ item }: Props) => {
  const navigation = useNavigation();

  const navToDex = () => {
    navigation.navigate(Routes.DEX, { marketId: item.id });
  };

  return (
    <TouchableOpacity style={s.main} onPress={navToDex}>
      <View style={s.iconBase}>
        <CryptoIcon uri={item.baseInfo?.logoURI} />
      </View>
      <View style={s.iconQuote}>
        <CryptoIcon uri={item.quoteInfo?.logoURI} />
      </View>
      <Text style={s.name}>{item.name}</Text>
      <View style={s.icon}>
        <Icon type="feather" name="chevron-right" color={COLORS.white4} />
      </View>
    </TouchableOpacity>
  );
};
