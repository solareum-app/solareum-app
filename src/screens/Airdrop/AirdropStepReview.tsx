import { grid, typo } from '@Components/Styles';
import { useLocalize } from '@Core/AppProvider/LocalizeProvider';
import { style as s } from '@Screens/Airdrop/style';
import React from 'react';
import { Text, View } from 'react-native';
import { Button } from 'react-native-elements';

export const AirdropStepReview = ({
  next,
  refAddress,
  airdrop,
  rewardRef,
  loading,
  error,
}) => {
  const { t } = useLocalize();

  return (
    <View style={s.main}>
      <Text style={typo.title}>{t('airdrop-review-title')}</Text>
      <View style={grid.group}>
        <Text style={grid.groupTitle}>{t('airdrop-review-ref-address')}</Text>
        <Text style={grid.groupValue}>{refAddress}</Text>
        <Text style={grid.groupTitle}>{t('airdrop-review-you-receive')}</Text>
        <Text style={grid.groupValue}>+{airdrop} XSB</Text>
        <Text style={grid.groupTitle}>{t('airdrop-review-ref-receive')}</Text>
        <Text style={grid.groupValue}>+{rewardRef} XSB</Text>
        <Text style={typo.helper}>{t('airdrop-review-note')}</Text>
      </View>
      <View style={s.footer}>
        {error ? <Text style={typo.warning}>{error}</Text> : null}
        <Button
          type="outline"
          title={t('airdrop-review-next')}
          onPress={next}
          loading={loading}
        />
      </View>
    </View>
  );
};
