import React, { useState, useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, Icon } from 'react-native-elements';
import { useNavigation } from '@react-navigation/core';

import { useLocalize } from '../../core/AppProvider/LocalizeProvider';
import { authFetch } from '../../utils/authfetch';
import { service } from '../../config';
import { useMetaData } from '../../hooks/useMetaData';
import { COLORS } from '../../theme';
import Routes from '../../navigators/Routes';
import { usePrice } from '../../core/AppProvider/PriceProvider';

const s = StyleSheet.create({
  manageBtnWrp: {
    padding: 20,
  },
  manageIcon: {
    marginRight: 10,
  },
  manageBtn: {
    borderColor: COLORS.dark4,
  },
  txtManageBtn: {
    color: COLORS.white4,
  },
});

export const MissionLeftButton = ({ padding = 20 }) => {
  const [missionLeft, setMissionLeft] = useState(0);
  const { accountList } = usePrice();
  const { t } = useLocalize();
  const metaData = useMetaData();
  const navigation = useNavigation();

  const solAccount = accountList.find((i) => i.mint === 'SOL');

  const navToMission = () => {
    navigation.navigate(Routes.Social);
  };

  const loadCheckMission = async () => {
    try {
      const resp = await authFetch(service.postCheckMission, {
        method: 'POST',
        body: {
          solAddress: solAccount?.publicKey,
          meta: {
            ...metaData,
          },
        },
      });
      setMissionLeft(resp.missionLeft);
    } catch { }
  };

  useEffect(() => {
    loadCheckMission();
  }, [accountList]);

  if (missionLeft === 0) {
    return null;
  }

  return (
    <View style={{ ...s.manageBtnWrp, padding }}>
      <Button
        title={t('mission-number-label', { missionLeft })}
        type="outline"
        buttonStyle={s.manageBtn}
        titleStyle={s.txtManageBtn}
        onPress={navToMission}
        icon={
          <Icon
            size={16}
            style={s.manageIcon}
            color={COLORS.white4}
            name="zap"
            type="feather"
          />
        }
      />
    </View>
  );
};
