import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, Input } from 'react-native-elements';
import { grid, typo } from '../../components/Styles';
import { useApp } from '../../core/AppProvider/AppProvider';
import { useLocalize } from '../../core/AppProvider/LocalizeProvider';
import { usePrice } from '../../core/AppProvider/PriceProvider';
import AsyncStorage from '../../storage';
import { COLORS } from '../../theme';
import {
  actorAddress,
  fioProtocol,
  publicKey,
  TOKEN_CHAIN
} from '../../utils/fioSDK';

const AddressManagement: React.FC = () => {
  const { wallet } = useApp();

  const { t } = useLocalize();
  const [addressName, setAddressName] = useState('');
  const [valid, setValid] = useState({
    isLoading: false,
    error: '',
    isRegister: false,
  });
  const { accountList } = usePrice();

  const sol = accountList.find((i) => i.mint === 'SOL') || {
    publicKey: wallet?.publicKey?.toBase58(),
    decimals: 8,
  };
  const address = sol.publicKey;

  const handleCheckAddressName = async (value: string) => {
    setAddressName(value);
    setValid((pState) => ({
      ...pState,
      isLoading: true,
    }));

    if (value) {
      try {
        const isRegistered = await fioProtocol.checkAvailAddress({
          fio_name: `${value}@fiotestnet`,
        });

        setValid((pState) => ({
          ...pState,
          isLoading: false,
          error: `${
            value
              ? isRegistered === 1
                ? 'address-registered'
                : 'address-available'
              : 'address-not-empty'
          }`,
          isRegister: isRegistered,
        }));
      } catch (error) {
        setValid((pState) => ({
          ...pState,
          isLoading: false,
        }));
      }
    }
  };

  const handleRegisterAddressName = async () => {
    let fioAddress = `${addressName}@fiotestnet`;
    try {
      const fee = await fioProtocol.getFee('register_fio_address');
      if (fee) {
        const result = await fioProtocol.registerFioAddress({
          fioAddress: fioAddress,
          maxFee: fee,
          ownerFioPubKey: publicKey,
          tpid: '',
          actor: actorAddress,
        });

        if (result.transaction_id) {
          const feeMap = await fioProtocol.getFee('add_pub_address');
          if (feeMap) {
            const res = await fioProtocol.addPublicAddress({
              fioAddress: fioAddress,
              maxFee: feeMap,
              chainCode: TOKEN_CHAIN.CHAIN_CODE,
              tokenCode: TOKEN_CHAIN.TOKEN_CODE,
              publicAddress: address,
              technologyProviderId: '',
            });
            if (res) {
              AsyncStorage.setItem('fioAddress', fioAddress);
            }
          }
        }
      }
    } catch (error) {}
  };

  const hasDisabled = () => !valid.isRegister && addressName;

  return (
    <View style={grid.container}>
      <View style={s.main}>
        <View style={s.body}>
          <Input
            label={t('address-name')}
            placeholder=""
            keyboardType="decimal-pad"
            style={typo.input}
            labelStyle={s.inputLabel}
            containerStyle={s.inputContainer}
            value={addressName}
            onChangeText={(value) => handleCheckAddressName(value)}
            errorMessage={`${t(`${valid?.error}`)}`}
            errorStyle={{
              color: `${
                addressName
                  ? !valid.isRegister
                    ? COLORS.caution
                    : COLORS.success
                  : COLORS.white0
              }`,
            }}
          />
        </View>
        <View style={s.footer}>
          <Button
            title={t('register-address-name')}
            buttonStyle={s.button}
            onPress={handleRegisterAddressName}
            disabled={!hasDisabled()}
          />
        </View>
      </View>
    </View>
  );
};

export default AddressManagement;

const s = StyleSheet.create({
  main: {
    minHeight: 320,
    padding: 20,
    paddingBottom: 40,
  },
  body: {
    marginTop: 20,
  },
  inputContainer: {
    paddingLeft: 0,
    paddingRight: 0,
  },
  inputLabel: {
    fontWeight: 'normal',
  },
  input: {},
  footer: {
    marginTop: 20,
  },
  button: {
    height: 44,
  },
  group: {
    marginBottom: 8,
  },
  groupTitle: {
    marginBottom: 8,
    color: COLORS.white4,
  },
  groupValue: {
    lineHeight: 20,
    fontSize: 17,
  },
  containerInput: {
    position: 'relative',
  },
  controls: {
    position: 'absolute',
    right: 0,
    top: 22,
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    width: 100,
    zIndex: 1,
    backgroundColor: COLORS.dark0,
    paddingLeft: 20,
  },
  iconQrCamera: {
    marginLeft: 20,
  },
  pasteTxt: {
    color: COLORS.white4,
    fontSize: 16,
  },
});
