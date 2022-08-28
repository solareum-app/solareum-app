import { typo } from '@Components/Styles';
import { useApp } from '@Core/AppProvider/AppProvider';
import { useLocalize } from '@Core/AppProvider/LocalizeProvider';
import { Routes } from '@Navigators/Routes';
import { useNavigation } from '@react-navigation/native';
import { COLORS } from '@Theme/index';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Button } from 'react-native-elements';

const s = StyleSheet.create({
  main: {
    margin: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.blue0,
    borderRadius: 4,
  },
});

export const BackupNotice = () => {
  const { t } = useLocalize();
  const { addressId, addressList } = useApp();
  const navigation = useNavigation();

  const goBackup = () => {
    const item = addressList.find((i) => i.id === addressId);
    if (item) {
      navigation.navigate(Routes.EditWallet, { address: item });
    }
  };

  return (
    <View style={s.main}>
      <Text style={typo.titleLeft}>{t('backup-title')}</Text>
      <Text style={typo.normal}>{t('backup-message')}</Text>
      <Button type="outline" onPress={goBackup} title={t('backup-btn-label')} />
    </View>
  );
};
