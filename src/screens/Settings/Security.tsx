import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, Button } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Portal } from 'react-native-portalize';
import PINCode, {
  hasUserSetPinCode,
  deleteUserPinCode,
  resetPinCodeInternalStates,
} from '@haskkor/react-native-pincode';
import { PinStatus } from '@haskkor/react-native-pincode/src/PinCode';
import { Modalize } from 'react-native-modalize';

import { COLORS } from '../../theme/colors';

type PINCodeStatusType = null | 'choose' | 'enter' | 'locked';
const Security = () => {
  const [PINCodeStatus, setPINCodeStatus] = useState<PINCodeStatusType>(null);
  const modalizeRef = useRef<Modalize>(null);
  const [isCorrectPINCode, setIsCorrectPINCode] = useState<boolean>(false);
  const navigation = useNavigation();

  const clearPINCode = React.useCallback(async () => {
    await deleteUserPinCode();
    await resetPinCodeInternalStates();
  }, []);

  const togglePINCodeModal = React.useCallback(() => {
    hasUserSetPinCode().then((result: boolean) => {
      if (result) {
        setPINCodeStatus(null);
        clearPINCode();
      } else {
        setPINCodeStatus(PinStatus.choose);
        modalizeRef.current?.open();
      }
    });
  }, [setPINCodeStatus, modalizeRef, clearPINCode]);

  const handleCloseModal = React.useCallback(() => {
    hasUserSetPinCode().then((result: boolean) => {
      if (!result) {
        setPINCodeStatus(null);
      } else if (!isCorrectPINCode) {
        navigation.goBack();
      }
    });
  }, [navigation, setPINCodeStatus, isCorrectPINCode]);

  const finishProcess = React.useCallback(() => {
    setIsCorrectPINCode(true);

    if (PINCodeStatus === PinStatus.enter) {
      // waiting for `isCorrectPINCode` be updated then closing the modal
      setTimeout(() => {
        modalizeRef.current?.close();
      }, 1000);
    } else {
      // closing modal immediately
      modalizeRef.current?.close();
    }
  }, [modalizeRef, PINCodeStatus]);

  useEffect(() => {
    hasUserSetPinCode().then((result: boolean) => {
      if (result) {
        setPINCodeStatus(PinStatus.enter);
        modalizeRef.current?.open();
      }
    });
  }, []);

  return (
    <View style={styles.container}>
      <View>
        <Button
          onPress={togglePINCodeModal}
          title={`App Lock: ${PINCodeStatus !== null ? 'ON' : 'OFF'}`}
        />
      </View>
      <Portal>
        <Modalize ref={modalizeRef} onClose={handleCloseModal}>
          <View style={styles.modalContent}>
            {PINCodeStatus !== null ? (
              <PINCode
                status={PINCodeStatus}
                touchIDDisabled
                finishProcess={finishProcess}
              />
            ) : null}
          </View>
        </Modalize>
      </Portal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.dark2,
  },
  modalContent: {
    padding: 15,
  },
});

export default Security;
