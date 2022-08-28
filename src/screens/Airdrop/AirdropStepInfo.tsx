import { typo } from '@Components/Styles';
import { useLocalize } from '@Core/AppProvider/LocalizeProvider';
import { SOL_BALANCE_TARGET } from '@Screens/Airdrop/const';
import { style as s } from '@Screens/Airdrop/style';
import React from 'react';
import { Text, View } from 'react-native';
import { Button } from 'react-native-elements';

interface IAirdropStep {
  dismiss?(): (value: string) => void;
  next?(): (value: string) => void;
  error?: string | null;
}

export const AirdropStepInfo = ({ dismiss, next, error }: IAirdropStep) => {
  const { t } = useLocalize();

  return (
    <View style={s.main}>
      <Text style={typo.title}>{t('airdrop-info-title')}</Text>
      <Text style={typo.normal}>{t('airdrop-info-3steps')}</Text>
      <Text style={typo.normal}>
        {t('airdrop-info-step1', { balance: SOL_BALANCE_TARGET })}
      </Text>
      <Text style={typo.normal}>{t('airdrop-info-step2')}</Text>
      <Text style={typo.normal}>{t('airdrop-info-step3')}</Text>

      <View style={s.footer}>
        {error ? <Text style={typo.caution}>{error}</Text> : null}
        <Button type="outline" title={t('airdrop-info-next')} onPress={next} />
        <Button
          type="clear"
          title={t('airdrop-info-dismiss')}
          containerStyle={s.button}
          onPress={dismiss}
        />
      </View>
    </View>
  );
};
