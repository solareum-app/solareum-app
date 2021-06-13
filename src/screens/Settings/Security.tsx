import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Button } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import {
  hasUserSetPinCode,
  deleteUserPinCode,
  resetPinCodeInternalStates,
} from '@haskkor/react-native-pincode';
import { PinStatus } from '@haskkor/react-native-pincode/src/PinCode';

import { COLORS } from '../../theme/colors';
import Routes from '../../navigators/Routes';

type PINCodeStatusType = null | 'choose' | 'enter' | 'locked';
const Security = () => {
  const [PINCodeStatus, setPINCodeStatus] = useState<PINCodeStatusType>(null);
  const navigation = useNavigation();

  const clearPINCode = React.useCallback(async () => {
    await deleteUserPinCode();
    await resetPinCodeInternalStates();
  }, []);

  useEffect(() => {
    hasUserSetPinCode().then((result: boolean) => {
      if (result) {
        setPINCodeStatus(PinStatus.enter);
        navigation.navigate(Routes.PassCode, {
          PINCodeStatus: PinStatus.enter,
          setPINCodeStatus,
        });
      } else {
        setPINCodeStatus(null);
      }
    });
  }, [navigation, setPINCodeStatus, clearPINCode]);

  const togglePINCodeModal = React.useCallback(() => {
    hasUserSetPinCode().then((result: boolean) => {
      if (result) {
        setPINCodeStatus(null);
        clearPINCode();
      } else {
        navigation.navigate(Routes.PassCode, {
          PINCodeStatus: PinStatus.choose,
          setPINCodeStatus,
        });
      }
    });
  }, [setPINCodeStatus, clearPINCode, navigation]);

  return (
    <View style={styles.container}>
      <Button
        onPress={togglePINCodeModal}
        title={`App Lock: ${PINCodeStatus !== null ? 'ON' : 'OFF'}`}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.dark2,
  },
});

export default Security;
