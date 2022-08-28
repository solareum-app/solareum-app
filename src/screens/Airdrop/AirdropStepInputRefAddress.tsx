import { typo } from '@Components/Styles';
import { useLocalize } from '@Core/AppProvider/LocalizeProvider';
import Clipboard from '@react-native-community/clipboard';
import { QRScan } from '@Screens/Token/QRScan';
import { COLORS } from '@Theme/index';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Button, Icon, Input } from 'react-native-elements';
import { style } from './style';

const s = StyleSheet.create({
  ...style,
  main: {
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
  input: {},
  footer: {
    marginTop: 20,
  },
  button: {
    height: 44,
  },
  group: {
    marginBottom: 12,
  },
  groupTitle: {
    marginBottom: 8,
    color: COLORS.white4,
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

export const AirdropStepInputRefAddress = ({
  next,
  refAddress,
  setRefAddress,
}) => {
  const [error, setError] = useState<string>('');
  const [camera, setCamera] = useState(false);
  const { t } = useLocalize();

  const onPaste = async () => {
    const text = await Clipboard.getString();
    setRefAddress(text.trim());
  };

  const onNext = () => {
    if (!refAddress) {
      setError(t('airdrop-ref-error-ref-address'));
      return;
    }

    if (refAddress.length > 44) {
      setError('Your referral address is invalid');
      return;
    }

    next();
  };

  useEffect(() => {
    setError('');
  }, [refAddress]);

  return (
    <View>
      {!camera ? (
        <View style={s.main}>
          <Text style={typo.title}>{t('airdrop-ref-title')}</Text>
          <Text style={typo.normal}>{t('airdrop-ref-message')}</Text>
          <View style={s.containerInput}>
            <Input
              label={t('airdrop-ref-address')}
              placeholder=""
              style={typo.input}
              labelStyle={s.inputLabel}
              containerStyle={s.inputContainer}
              errorMessage={refAddress}
              errorStyle={{ color: COLORS.white4 }}
              value={refAddress}
              onChangeText={(value) => setRefAddress(value)}
            />
            <View style={s.controls}>
              <Button
                title={t('airdrop-ref-paste')}
                type="clear"
                onPress={onPaste}
                titleStyle={s.pasteTxt}
              />
              <Button
                title=""
                type="clear"
                icon={
                  <Icon
                    type="feather"
                    name="camera"
                    color={COLORS.white4}
                    size={20}
                  />
                }
                onPress={() => {
                  setCamera(true);
                }}
              />
            </View>
          </View>

          <View style={s.footer}>
            {error ? <Text style={typo.warning}>{error}</Text> : null}
            <Button
              type="outline"
              title={t('airdrop-ref-next')}
              onPress={onNext}
            />
          </View>
        </View>
      ) : (
        <QRScan
          onChange={(value) => {
            setRefAddress(value);
            setCamera(false);
          }}
        />
      )}
    </View>
  );
};
