import { useNavigation } from '@react-navigation/native';
import React, { useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, Input, Text } from 'react-native-elements';
import { Address } from '../../components/Address/Address';
import { FixedContent } from '../../components/Modals/FixedContent';
import { grid } from '../../components/Styles';
import { useApp } from '../../core/AppProvider/AppProvider';
import { useLocalize } from '../../core/AppProvider/LocalizeProvider';
import { usePrice } from '../../core/AppProvider/PriceProvider';
import { setItem } from '../../storage/Collection';
import { COLORS } from '../../theme';
import { copyToClipboard } from '../../utils/address';
import {
  actorAddress,
  addPublicAddress,
  checkAddress,
  DOMAIN_NAME,
  getFee,
  publicKey,
  registerAddress,
  TOKEN_CHAIN
} from '../../utils/fioProtocool';

const AddressManagement: React.FC = () => {
  const refRegAddress = useRef();

  const navigation = useNavigation();

  const { wallet } = useApp();

  const { t } = useLocalize();
  const [addressName, setAddressName] = useState('');
  const [valid, setValid] = useState({
    isLoading: false,
    error: 'address-not-empty',
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
        const resp = await checkAddress(
          'https://fiotestnet.blockpane.com/v1/chain/avail_check',
          {
            method: 'post',
            body: {
              fio_name: `${value}${DOMAIN_NAME}`,
            },
          },
        );
        console.log('is_registered', resp.is_registered);

        setValid((pState) => ({
          ...pState,
          isLoading: false,
          error: `${
            value
              ? resp.is_registered === 1
                ? 'address-registered'
                : 'address-available'
              : 'address-not-empty'
          }`,
          isRegister: resp.is_registered,
        }));
      } catch (error) {
        setValid((pState) => ({
          ...pState,
          isLoading: false,
        }));
      }
    } else {
      setValid({
        isLoading: false,
        error: 'address-not-empty',
        isRegister: false,
      });
    }
  };

  const handleRegisterAddressName = async () => {
    setValid((pState) => ({
      ...pState,
      isLoading: true,
    }));

    let fioAddress = `${addressName}${DOMAIN_NAME}`;
    try {
      const { fee } = await getFee('register_fio_address', {
        method: 'post',
        body: {
          end_point: 'register_fio_address',
          fio_address: fioAddress,
        },
      });
      if (fee) {
        const result = await registerAddress({
          fioAddress: fioAddress,
          maxFee: fee,
          ownerFioPubKey: publicKey,
          tpid: '',
          actor: actorAddress,
        });

        if (result?.transaction_id) {
          const res = await addPublicAddress({
            fioAddress: fioAddress,
            maxFee: 0,
            chainCode: TOKEN_CHAIN.CHAIN_CODE,
            tokenCode: TOKEN_CHAIN.TOKEN_CODE,
            publicAddress: address,
            technologyProviderId: '',
          });
          if (res) {
            await setItem('fioAddress', address, fioAddress);
            setValid((pState) => ({
              ...pState,
              isLoading: false,
            }));
            refRegAddress?.current?.open();
          }
        }
      }
    } catch (error) {
      setValid((pState) => ({
        ...pState,
        isLoading: false,
      }));
    }
  };

  const hasDisabled = () => !valid.isRegister && addressName;

  const renderIconRight = () => <Text style={s.rightIcon}>{DOMAIN_NAME}</Text>;

  return (
    <>
      <View style={grid.container}>
        <View style={s.main}>
          <View style={s.body}>
            <Input
              label={t('address-name')}
              placeholder=""
              style={s.input}
              autoFocus={true}
              autoCapitalize="none"
              labelStyle={s.inputLabel}
              containerStyle={s.inputContainer}
              value={addressName}
              onChangeText={(value) => handleCheckAddressName(value)}
              errorMessage={`${t(`${valid?.error}`)}`}
              errorStyle={{
                color: `${
                  addressName
                    ? !valid.isRegister
                      ? COLORS.success
                      : COLORS.caution
                    : COLORS.white0
                }`,
              }}
              rightIcon={renderIconRight()}
            />
          </View>
          <View style={s.footer}>
            <Button
              title={t('register-address-name')}
              buttonStyle={s.button}
              onPress={handleRegisterAddressName}
              disabled={!hasDisabled()}
              loading={valid.isLoading}
            />
          </View>
        </View>
      </View>
      <FixedContent ref={refRegAddress}>
        <View style={s.main__success}>
          <View style={s.main__success__body}>
            <Text style={s.message}>{t('register-address-done')}</Text>
          </View>
          <View style={s.fioAddress}>
            <Address
              copyToClipboard={() =>
                copyToClipboard(`${addressName}${DOMAIN_NAME}`)
              }
              address={`${addressName}${DOMAIN_NAME}`}
            />
          </View>
          <View style={s.footer}>
            <Button
              title={t('btn-ok')}
              buttonStyle={s.button}
              type="clear"
              onPress={() => navigation.goBack()}
            />
          </View>
        </View>
      </FixedContent>
    </>
  );
};

export default AddressManagement;

const s = StyleSheet.create({
  main: {
    minHeight: 320,
    padding: 20,
    paddingBottom: 40,
  },
  main__success: {
    backgroundColor: COLORS.dark0,
    minHeight: 320,
    padding: 20,
    paddingBottom: 40,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
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
  input: {
    color: COLORS.white2,
  },
  rightIcon: {
    color: COLORS.white2,
  },
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
  fioAddress: {
    marginTop: 10,
  },

  main__success__body: {
    marginTop: 20,
    marginBottom: 20,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },

  message: {
    color: COLORS.success,
    textAlign: 'center',
    fontSize: 18,
  },
});
