import React from 'react';
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

import Routes from '../../navigators/Routes';
import { AddressInfo } from '../../storage/WalletCollection';
import { useApp } from '../../core/AppProvider';
import { grid } from '../../components/Styles';
import { COLORS } from '../../theme';

const s = StyleSheet.create({
  main: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.dark4,
    marginBottom: 16,
  },
  iconLeft: {
    width: 48,
    height: 48,
    borderRadius: 48,
    padding: 8,
    backgroundColor: COLORS.white0,
    marginRight: 16,
    flex: 0,
    position: 'relative',
  },
  checkItem: {
    position: 'absolute',
    top: 0,
    right: -8,
    width: 20,
    height: 20,
    borderRadius: 20,
    padding: 2,
    backgroundColor: COLORS.success,
  },
  iconRight: {
    flex: 0,
    padding: 8,
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
  return (
    <TouchableOpacity style={s.main} onPress={onSelect}>
      <View style={s.iconLeft}>
        <Icon type="feather" name="shield" color={COLORS.blue2} size={32} />
        {active ? (
          <View style={s.checkItem}>
            <Icon type="feather" name="check" color={COLORS.white0} size={16} />
          </View>
        ) : null}
      </View>
      <Text style={s.title}>{item.name}</Text>
      <View style={s.iconRight}>
        <Icon type="feather" name="info" color={COLORS.white4} size={16} />
      </View>
    </TouchableOpacity>
  );
};

export const Wallet: React.FC = () => {
  const { addressId, setAddressId, addressList } = useApp();
  const navigation = useNavigation();

  const onSelect = (id: string) => {
    setAddressId(id);
    navigation.navigate(Routes.Wallet);
  };

  return (
    <View style={grid.container}>
      <SafeAreaView style={grid.wrp}>
        <ScrollView>
          <View style={grid.content}>
            {addressList.map((i) => {
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
