import React, { useState } from 'react';
import PINCode from '@haskkor/react-native-pincode';
import { Alert, StyleSheet, View } from 'react-native';
import {
  resetPinCodeInternalStates,
  deleteUserPinCode,
} from '@haskkor/react-native-pincode';
import Routes from '../../navigators/Routes';
import { useNavigation } from '@react-navigation/native';

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

const ChangePinLock = () => {
  const [showPinCodeStatus, setShowPinCodeStatus] = useState<
    string | undefined
  >('enter');
  const navigation = useNavigation();

  const finishProcess = async () => {
    if (showPinCodeStatus === 'choose') {
      Alert.alert(null, 'You have successfully set your pin.', [
        {
          title: 'Ok',
          onPress: () => {
            navigation.navigate(Routes.Home);
          },
        },
      ]);
    }

    if (showPinCodeStatus === 'enter') {
      Alert.alert(null, 'You have successfully entered your pin.', [
        {
          title: 'Ok',
          onPress: () => {
            resetPinCodeInternalStates();
            deleteUserPinCode();
            setShowPinCodeStatus('choose');
          },
        },
      ]);
    }
  };

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

export default ChangePinLock;
