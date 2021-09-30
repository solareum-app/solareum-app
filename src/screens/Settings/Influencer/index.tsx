import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  Text,
  ScrollView,
  SafeAreaView,
  Share,
} from 'react-native';
import { Button } from 'react-native-elements';

import { grid, typo } from '../../../components/Styles';
import { useToken } from '../../../core/AppProvider/TokenProvider';
import { authFetch } from '../../../utils/authfetch';
import { service } from '../../../config';
import { useLocalize } from '../../../core/AppProvider/LocalizeProvider';

const s = StyleSheet.create({
  wrp: {
    marginBottom: 24,
  },
  helper: {
    ...typo.helper,
    marginTop: 8,
  },
});

type Props = {};

const Influencer: React.FC<Props> = () => {
  const { accountList } = useToken();
  const [rewardRef, setRewardRef] = useState(1);
  const { t } = useLocalize();

  const onShare = async () => {
    try {
      const solAccount = accountList.find((i) => i.mint === 'SOL');
      const message = t('airdrop-final-share', {
        address: solAccount?.publicKey,
      });

      const result = await Share.share({
        message,
      });
      return result;
    } catch { }
  };

  useEffect(() => {
    (async () => {
      const solAccount = accountList.find((i) => i.mint === 'SOL');
      const xsbAccount = accountList.find((i) => i.symbol === 'XSB');
      const resp = await authFetch(service.postCheckAirdrop, {
        method: 'POST',
        body: {
          solAddress: solAccount?.publicKey,
          xsbAddress: xsbAccount?.publicKey,
        },
      });
      setRewardRef(resp.rewardRef);
    })();
  }, [accountList]);

  return (
    <View style={grid.container}>
      <SafeAreaView style={grid.wrp}>
        <ScrollView>
          <View style={grid.content}>
            <View style={s.wrp}>
              <Text style={typo.normal}>{t('setting-ref-message-01')}</Text>
              <Text style={typo.normal}>{t('setting-ref-message-02')}</Text>
              <Text style={typo.normal}>{t('setting-ref-message-03')}</Text>
              <Text style={typo.normal}>
                {t('setting-ref-message-04', { rewardRef })}
              </Text>
            </View>

            <View style={s.wrp}>
              <Button title={t('setting-ref-share')} onPress={onShare} />
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

export default Influencer;
