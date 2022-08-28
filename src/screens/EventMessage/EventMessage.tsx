import { useLocalize } from '@Core/AppProvider/LocalizeProvider';
import { COLORS } from '@Theme/index';
import { getShortPublicKey } from '@Utils/index';
import React, { useEffect, useState } from 'react';
import {
  DeviceEventEmitter,
  Dimensions,
  StyleSheet,
  Text,
  View
} from 'react-native';
import { Icon } from 'react-native-elements';

export enum MESSAGE_TYPE {
  copy = 'copy',
}

const s = StyleSheet.create({
  alertZone: {
    position: 'absolute',
    top: 70,
    width: Dimensions.get('window').width,
    height: 100,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 9999,
  },
  messageWrp: {
    backgroundColor: COLORS.success,
    borderColor: COLORS.dark2,
    borderRadius: 16,
    paddingVertical: 4,
    paddingHorizontal: 12,
    paddingLeft: 4,
    display: 'flex',
    flexDirection: 'row',
    borderWidth: 1,
  },
  alertZoneMessage: {
    color: COLORS.dark4,
    fontSize: 14,
    lineHeight: 20,
    marginLeft: 8,
  },
});

// place this component into a PORTAL
export const EventMessage = ({ top = 70 }) => {
  const [message, setMessage] = useState('');
  const { t } = useLocalize();

  const handleCopy = (value: string) => {
    setMessage(value);
    setTimeout(() => {
      setMessage('');
    }, 2000);
  };

  useEffect(() => {
    DeviceEventEmitter.addListener(MESSAGE_TYPE.copy, handleCopy);
    return () => {
      DeviceEventEmitter.removeListener(MESSAGE_TYPE.copy, handleCopy);
    };
  }, []);

  return (
    <View>
      {message ? (
        <View style={{ ...s.alertZone, top }}>
          <View style={s.messageWrp}>
            <Icon
              type="antdesign"
              name="checkcircle"
              color={COLORS.white0}
              size={20}
            />
            <Text style={s.alertZoneMessage}>
              {t('message-copy', { message: getShortPublicKey(message) })}
            </Text>
          </View>
        </View>
      ) : null}
    </View>
  );
};
