import React from 'react';
import PINCode from '@haskkor/react-native-pincode';
import { StyleSheet, View } from 'react-native';

const s = StyleSheet.create({
  container: {
    flex: 1,
  },
  styleMain: {
    backgroundColor: '#444444',
    flex: 1,
    width: '100%',
  },
});

const LockScreen = ({ showPinCodeStatus, finishProcess }: any) => {
  return (
    <View style={s.container}>
      <PINCode
        status={showPinCodeStatus}
        touchIDDisabled={true}
        styleMainContainer={s.styleMain}
        colorCircleButtons="#444444"
        finishProcess={() => finishProcess()}
      />
    </View>
  );
};

export default LockScreen;
