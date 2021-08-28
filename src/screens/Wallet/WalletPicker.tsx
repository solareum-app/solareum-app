import React, { useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { ListItem, Button, Icon as RNIcon } from 'react-native-elements';
import { Portal } from 'react-native-portalize';
import { useNavigation } from '@react-navigation/native';

import { FixedContent } from '../../components/Modals/FixedContent';
import { getShortPublicKey } from '../../utils';
import { COLORS, FONT_SIZES } from '../../theme';
import Routes from '../../navigators/Routes';
import Icon from '../../components/Icon';
import { useApp } from '../../core/AppProvider/AppProvider';

const s = StyleSheet.create({
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  group: {
    display: 'flex',
    flexDirection: 'row',
    marginTop: 24,
    marginLeft: -4,
    marginRight: -4,
  },
  groupItem: {
    flex: 1,
    marginLeft: 4,
    marginRight: 4,
  },
  walletWrp: {
    paddingLeft: 12,
    paddingRight: 12,
    marginRight: -20, // size of icon + margin
  },
  titleWrp: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  titleLeft: {},
  titleIcon: {
    paddingLeft: 8,
  },
  walletTitle: {
    fontSize: 14,
    lineHeight: 20,
    color: COLORS.white0,
    paddingVertical: 2,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  walletSubtitle: {
    fontSize: 12,
    lineHeight: 12,
    color: COLORS.white4,
    paddingVertical: 2,
    textAlign: 'center',
  },
  listItemContainer: {
    backgroundColor: COLORS.dark0,
    borderBottomColor: COLORS.dark2,
    borderBottomWidth: 2,
  },

  listItemTitle: {
    color: COLORS.white2,
    fontSize: 18,
  },
  listItemTitleCheck: {},
});

const WalletPicker: React.FC = () => {
  const ref = useRef();
  const navigation = useNavigation();
  const { wallet, addressList, setAddressId, addressId } = useApp();

  return (
    <View>
      <TouchableOpacity
        onPress={() => {
          ref?.current?.open();
        }}
        style={s.walletWrp}
      >
        <View style={s.titleWrp}>
          <View style={s.titleLeft}>
            <Text style={s.walletTitle}>
              {wallet ? wallet.name : 'Walltet Name'}
            </Text>
            <Text style={s.walletSubtitle}>
              {wallet ? getShortPublicKey(wallet.publicKey.toBase58()) : '--'}
            </Text>
          </View>
          <View style={s.titleIcon}>
            <Icon name="down" color={COLORS.white0} size={12} />
          </View>
        </View>
      </TouchableOpacity>

      <Portal>
        <FixedContent ref={ref}>
          <View style={s.content}>
            {addressList.map((w) => (
              <ListItem
                key={w.id}
                onPress={() => {
                  setAddressId(w.id);
                  ref.current?.close();
                }}
                containerStyle={s.listItemContainer}
              >
                <Icon
                  name="wallet"
                  size={FONT_SIZES.lg}
                  color={COLORS.white2}
                />
                <ListItem.Content>
                  <ListItem.Title style={s.listItemTitle}>
                    {w.name || 'Solareum Wallet'}
                  </ListItem.Title>
                </ListItem.Content>
                {addressId === w.id ? (
                  <RNIcon
                    type="feather"
                    name="check-circle"
                    size={16}
                    color={COLORS.success}
                  />
                ) : null}
              </ListItem>
            ))}

            <View style={s.group}>
              <View style={s.groupItem}>
                <Button
                  title="Tạo Ví"
                  type="clear"
                  onPress={() => {
                    ref.current?.close();
                    navigation.navigate(Routes.CreateWallet);
                  }}
                  titleStyle={{ color: COLORS.white2 }}
                  icon={
                    <Icon
                      size={FONT_SIZES.md}
                      name="plus"
                      color={COLORS.white2}
                      style={{ marginRight: 6 }}
                    />
                  }
                />
              </View>
              <View style={s.groupItem}>
                <Button
                  title="Khôi phục"
                  type="clear"
                  onPress={() => {
                    ref.current?.close();
                    navigation.navigate(Routes.ImportWallet);
                  }}
                  titleStyle={{ color: COLORS.white2 }}
                  icon={
                    <Icon
                      size={FONT_SIZES.md}
                      name="download"
                      color={COLORS.white2}
                      style={{ marginRight: 6 }}
                    />
                  }
                />
              </View>
            </View>
          </View>
        </FixedContent>
      </Portal>
    </View>
  );
};

export default WalletPicker;
