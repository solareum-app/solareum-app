import { useLocalize } from '@Core/AppProvider/LocalizeProvider';
import { usePrice } from '@Core/AppProvider/PriceProvider';
import { useMetaData } from '@Hooks/useMetaData';
import Routes from '@Navigators/Routes';
import { useNavigation } from '@react-navigation/core';
import { COLORS } from '@Theme/index';
import { authFetch } from '@Utils/authfetch';
import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, Icon } from 'react-native-elements';
import { service } from '../../config';

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
    navigation.navigate(Routes.Explore);
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
    } catch {}
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
