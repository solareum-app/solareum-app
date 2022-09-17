import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import { Button } from 'react-native-elements';
import { grid } from '../../components/Styles';
import { useLocalize } from '../../core/AppProvider/LocalizeProvider';
import { COLORS } from '../../theme';
import { main } from '../../utils/fioSDK';

const AddressManagement: React.FC = () => {
  
  const { t } = useLocalize();
  const [addressName, setAddressName] = useState('');
  const [valid, setValid] = useState({
    isLoading: false,
    error: '',
    isRegister: false,
  });

  const { chainData } = main()
  console.log('user', chainData)

  const handleCheckAddressName = async () => {
    setValid((pState) => ({
      ...pState,
      isLoading: true,
    }));

    try {
      setValid((pState) => ({
        ...pState,
        isLoading: false,
        error: 'register',
        isRegister: true,
      }));
    } catch (error) {
      console.log('error', error);
      setValid((pState) => ({
        ...pState,
        isLoading: false,
      }));
    }
  };

  const handleRegisterAddressName = () => {};

  const hasDisabled = () => valid.isLoading || !addressName;

  return (
    <View style={grid.container}>
      <View style={grid.content}>
        <View style={s.content__input__container}>
          <TextInput
            style={s.content__input}
            placeholder="Type your address name"
            clearButtonMode="while-editing"
            value={addressName}
            onChangeText={(text: string) => setAddressName(text)}
            autoCapitalize="none"
          />
          <Text style={s.content__suffix}>@xsb</Text>
        </View>

        {valid.error ? (
          <>
            {valid.isRegister ? (
              <Text style={s.content__error__text}>{valid.error}</Text>
            ) : (
              <Text style={s.content__success__text}>{valid.error}</Text>
            )}
          </>
        ) : null}

        <Button
          disabled={hasDisabled()}
          title={t(
            `${
              !valid.isRegister ? 'check-address-name' : 'register-address-name'
            }`,
          )}
          buttonStyle={s.buttonCaution}
          containerStyle={s.buttonCaution}
          titleStyle={s.buttonCautionTitle}
          onPress={
            valid.isRegister
              ? handleRegisterAddressName
              : handleCheckAddressName
          }
          type="outline"
        />
      </View>
    </View>
  );
};

export default AddressManagement;

const s = StyleSheet.create({
  content__input: {
    paddingVertical: 15,
    width: '90%',
    borderColor: 'transparent',
    borderBottomColor: COLORS.blue0,
    color: COLORS.dark4,
  },

  content__input__container: {
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white0,
    borderBottomColor: COLORS.blue0,
    borderRadius: 10,
    paddingHorizontal: 10,
    marginBottom: 10,
  },

  content__suffix: {
    color: COLORS.dark4,
  },

  content__error__text: {
    color: COLORS.critical,
    marginBottom: 10,
  },

  content__success__text: {
    color: COLORS.success,
    marginBottom: 10,
  },

  buttonCaution: {
    borderColor: COLORS.blue0,
  },
  buttonCautionTitle: {
    color: COLORS.blue0,
  },
});
