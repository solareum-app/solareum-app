import React from 'react';
import { View, StyleSheet, Button } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import PINCode from '@haskkor/react-native-pincode';
import { PinStatus } from '@haskkor/react-native-pincode/src/PinCode';

import { COLORS } from '../../theme/colors';

type PINCodeStatusType = null | 'choose' | 'enter' | 'locked';

type Props = {};

const PassCode: React.FC<Props> = ({ route }) => {
  const ref = React.useRef<null | boolean>(null);
  const {
    PINCodeStatus,
    setPINCodeStatus,
    showBackButton = true,
  } = route.params;
  const navigation = useNavigation();

  const finishProcess = React.useCallback(() => {
    ref.current = true;
    setPINCodeStatus && setPINCodeStatus(PINCodeStatus);
    navigation.goBack();
  }, [PINCodeStatus, setPINCodeStatus, navigation, ref]);

  const goBack = React.useCallback(() => {
    if (ref.current || PINCodeStatus === PinStatus.choose) {
      navigation.goBack();
    } else {
      navigation.pop(2);
    }
  }, [navigation, ref, PINCodeStatus]);

  React.useLayoutEffect(() => {
    if (showBackButton) {
      navigation.setOptions({
        headerLeft: () => <Button onPress={goBack} title="Back" />,
      });
    } else {
      navigation.setOptions({
        headerLeft: null,
      });
    }
  }, [showBackButton, navigation, goBack]);

  return (
    <View style={styles.container}>
      {PINCodeStatus !== null ? (
        <PINCode
          status={PINCodeStatus}
          touchIDDisabled
          finishProcess={finishProcess}
        />
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.dark2,
  },
});

export default PassCode;
