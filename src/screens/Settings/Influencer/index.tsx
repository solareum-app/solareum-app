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

import { grid, typo, row } from '../../../components/Styles';
import { authFetch } from '../../../utils/authfetch';
import { service } from '../../../config';
import { useLocalize } from '../../../core/AppProvider/LocalizeProvider';
import { getShortHash } from '../../../utils/address';
import { usePrice } from '../../../core/AppProvider/PriceProvider';

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
  const { accountList } = usePrice();
  const [rewardRef, setRewardRef] = useState(1);
  const [nominated, setNominated] = useState('');
  const [noRef, setNoRef] = useState(0);
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
      const solAddress = solAccount?.publicKey;

      const resp = await authFetch(service.postCheckAirdrop, {
        method: 'POST',
        body: {
          solAddress,
        },
      });
      const wallet = await authFetch(`/wallets?sol_address=${solAddress}`, {
        method: 'get',
      });
      const numberRef = await authFetch(
        `/wallets/count?nominated_by=${solAddress}`,
        {
          method: 'get',
        },
      );

      setRewardRef(resp.rewardRef);
      setNominated(wallet.length ? wallet[0].nominated_by : '-');
      setNoRef(numberRef);
    })();
  }, [accountList]);

  return (
    <View style={grid.container}>
      <SafeAreaView style={grid.wrp}>
        <ScrollView>
          <View style={grid.content}>
            <View style={s.wrp}>
              <View style={row.main}>
                <View style={row.left}>
                  <Text style={row.label}>{t('setting-ref-nominated')}</Text>
                </View>
                <View style={row.right}>
                  <Text style={row.label}>
                    {nominated ? getShortHash(nominated) : '-'}
                  </Text>
                </View>
              </View>
              <View style={row.main}>
                <View style={row.left}>
                  <Text style={row.label}>{t('setting-ref-no-ref')}</Text>
                </View>
                <View style={row.right}>
                  <Text style={row.label}>{noRef ? noRef : '-'}</Text>
                </View>
              </View>
            </View>

            <View style={s.wrp}>
              <Text style={typo.normal}>{t('setting-ref-message-01')}</Text>
              <Text style={typo.normal}>
                {t('setting-ref-message-02')}{' '}
                {t('setting-ref-message-03', { rewardRef })}
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
