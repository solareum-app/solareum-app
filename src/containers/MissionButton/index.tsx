import { useRewards } from '@Core/AppProvider/RewardsProvider';
import { COLORS } from '@Theme/index';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, Icon } from 'react-native-elements';

const s = StyleSheet.create({
  manageBtnWrp: {
    padding: 20,
  },
  manageIcon: {
    marginRight: 10,
  },
  manageBtn: {
    borderColor: COLORS.blue4,
  },
  txtManageBtn: {
    color: COLORS.blue2,
  },
  btnDisabled: {
    borderColor: COLORS.dark4,
  },
  txtManageBtnDisabled: {
    color: COLORS.white4,
  },
});

export const MissionButton = ({ padding = 20 }) => {
  const { getRewards, loading, getActive, getLabel } = useRewards();

  return (
    <View style={{ ...s.manageBtnWrp, padding }}>
      <Button
        title={getLabel()}
        type="outline"
        loading={loading}
        disabled={!getActive()}
        onPress={getRewards}
        buttonStyle={s.manageBtn}
        titleStyle={s.txtManageBtn}
        disabledStyle={s.btnDisabled}
        disabledTitleStyle={s.txtManageBtnDisabled}
        icon={
          <Icon
            size={16}
            style={s.manageIcon}
            color={getActive() ? COLORS.blue2 : COLORS.white4}
            name="zap"
            type="feather"
          />
        }
      />
    </View>
  );
};
