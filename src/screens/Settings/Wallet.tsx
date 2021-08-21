import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { Icon } from 'react-native-elements';
import { useNavigation } from '@react-navigation/core';

import { ImageCached } from '../../components/ImageCached/ImageCached';
import Routes from '../../navigators/Routes';
import { AddressInfo } from '../../storage/WalletCollection';
import { useApp } from '../../core/AppProvider';
import { grid } from '../../components/Styles';
import { COLORS } from '../../theme';
import walletIcon from '../../assets/Solareum_Wallet.png';
import walletIconActive from '../../assets/Solareum_Logo.png';

const s = StyleSheet.create({
  main: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    backgroundColor: COLORS.dark0,
    borderColor: COLORS.dark0,
    marginBottom: 12,
  },
  iconLeft: {
    width: 48,
    height: 48,
    marginRight: 16,
    flex: 0,
    position: 'relative',
  },
  walletIcon: {
    width: 48,
    height: 48,
    borderRadius: 48,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: COLORS.dark2,
  },
  walletIconActive: {
    borderColor: COLORS.success,
  },
  checkItem: {
    position: 'absolute',
    top: -4,
    right: -8,
    width: 20,
    height: 20,
    borderRadius: 20,
    padding: 2,
    backgroundColor: COLORS.success,
  },
  iconRight: {
    flex: 0,
    padding: 12,
  },
  title: {
    color: COLORS.white2,
    fontSize: 18,
    lineHeight: 24,
    flex: 1,
  },
});

type Props = {
  active?: boolean;
  item: AddressInfo;
  onSelect: any;
};

const WalletItem: React.FC<Props> = ({ active, item, onSelect }) => {
  const navigation = useNavigation();

  return (
    <TouchableOpacity style={s.main} onPress={onSelect}>
      <View style={s.iconLeft}>
        <ImageCached
          source={active ? walletIconActive : walletIcon}
          style={[s.walletIcon, active ? s.walletIconActive : {}]}
        />
      </View>
      <Text style={s.title}>{item.name}</Text>
      <TouchableOpacity
        style={s.iconRight}
        onPress={() => {
          navigation.navigate(Routes.EditWallet, { address: item });
        }}
      >
        <Icon type="feather" name="info" color={COLORS.white4} size={16} />
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

export const Wallet: React.FC = () => {
  const { addressId, setAddressId, addressList } = useApp();
  const navigation = useNavigation();
  const [list, setList] = useState([]);

  const onSelect = (id: string) => {
    setAddressId(id);
    navigation.navigate(Routes.Wallet);
  };

  useEffect(() => {
    setList(addressList);
  }, [addressList]);

  return (
    <View style={grid.container}>
      <SafeAreaView style={grid.wrp}>
        <ScrollView>
          <View style={grid.content}>
            {list.map((i) => {
              return (
                <WalletItem
                  key={i.id}
                  active={i.id === addressId}
                  item={i}
                  onSelect={() => onSelect(i.id)}
                />
              );
            })}
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};
