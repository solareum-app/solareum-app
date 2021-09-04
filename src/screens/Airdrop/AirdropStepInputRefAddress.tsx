import React, { useState } from 'react';
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

export const AirdropStepInputRefAddress = ({ next }) => {
  const [camera, setCamera] = useState(false);
  const [address, setAddress] = useState('');

  const onPaste = async () => {
    const text = await Clipboard.getString();
    setAddress(text);
  };

  return (
    <View>
      {!camera ? (
        <View style={s.main}>
          <Text style={typo.title}>Nhập địa chỉ người giới thiệu</Text>
          <Text style={typo.normal}>
            Hãy nhập địa chỉ của người đã giới thiệu bạn đến với Solareum, để cả
            2 cùng nhận được Airdrop. Nếu bạn không có người giới thiệu hãy để
            trống và tiếp tục.
          </Text>
          <View style={s.containerInput}>
            <Input
              label="Địa chỉ ví"
              placeholder=""
              style={typo.input}
              labelStyle={s.inputLabel}
              containerStyle={s.inputContainer}
              value={address}
              onChangeText={(value) => setAddress(value)}
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
            <Button
              type="outline"
              title="Tiếp tục, xem lại thông tin"
              onPress={next}
            />
          </View>
        </View>
      ) : (
        <QRScan
          onChange={(value) => {
            setAddress(value);
            setCamera(false);
          }}
        />
      )}
    </View>
  );
};
