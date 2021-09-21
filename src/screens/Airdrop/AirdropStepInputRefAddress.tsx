import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Clipboard from '@react-native-community/clipboard';
import { Input, Button, Icon } from 'react-native-elements';

import { typo } from '../../components/Styles';
import { COLORS } from '../../theme';
import { QRScan } from '../Token/QRScan';

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

  const onPaste = async () => {
    const text = await Clipboard.getString();
    setRefAddress(text);
  };

  const onNext = () => {
    if (!refAddress) {
      setError('Bạn chưa nhập địa chỉ người giới thiệu');
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
          <Text style={typo.title}>Nhập địa chỉ người giới thiệu</Text>
          <Text style={typo.normal}>
            Hãy nhập địa chỉ SOL của người giới thiệu, để cả 2 cùng nhận được
            Airdrop. Nếu bạn không có người giới thiệu hãy nhập `XSB` và tiếp
            tục.
          </Text>
          <View style={s.containerInput}>
            <Input
              label="Địa chỉ ví"
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
                title="Dán"
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
            {error ? <Text style={typo.critical}>{error}</Text> : null}
            <Button
              type="outline"
              title="Tiếp tục, xem lại thông tin"
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
