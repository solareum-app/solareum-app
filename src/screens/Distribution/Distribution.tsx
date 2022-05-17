import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
  StyleSheet,
  Text,
  RefreshControl,
} from 'react-native';
import LottieView from 'lottie-react-native';

import { COLORS } from '../../theme';
import { grid } from '../../components/Styles';
import { Airdrop } from '../Airdrop/Airdrop';
import { Mission } from './Mission';
import { authFetch } from '../../utils/authfetch';
import { usePrice } from '../../core/AppProvider/PriceProvider';
import { service } from '../../config';
import { useMetaData } from '../../hooks/useMetaData';
import { LoadingImage } from '../../components/LoadingIndicator';
import { box } from './style';

const s = StyleSheet.create({
  main: {
    flex: 1,
  },
  imgWrp: {
    width: 220,
    marginLeft: 'auto',
    marginRight: 'auto',
    marginTop: 12,
    marginBottom: 24,
  },
  img: {
    width: 220,
    height: 220,
  },
});

export const Distribution = () => {
  const { accountList } = usePrice();
  const [loading, setLoading] = useState<boolean>(true);
  const [mode, setMode] = useState<'airdrop' | 'mission'>('airdrop');
  const metaData = useMetaData();

  const solAccount = accountList.find((i) => i.mint === 'SOL') || {
    publicKey: '-',
    decimals: 8,
    amount: 0,
  };
  const solAddress = solAccount?.publicKey;

  const checkAirdrop = async () => {
    if (!solAddress) {
      return;
    }

    const resp = await authFetch(service.postCheckAirdrop, {
      method: 'POST',
      body: {
        solAddress,
        meta: {
          ...metaData,
        },
      },
    });

    if (resp.rewardAirdrop > 0) {
      setMode('airdrop');
    } else {
      setMode('mission');
    }
    setLoading(false);
  };

  useEffect(() => {
    checkAirdrop();
  }, [solAddress]);

  return (
    <View style={s.main}>
      <SafeAreaView style={grid.container}>
        <ScrollView
          refreshControl={
            <RefreshControl
              refreshing={false}
              onRefresh={() => null}
              colors={[COLORS.white2]}
              tintColor={COLORS.white2}
            />
          }
        >
          <View style={grid.content}>
            <View style={s.imgWrp}>
              <LottieView
                autoPlay
                loop
                source={require('../../theme/lottie/diamond.json')}
                style={s.img}
              />
            </View>

            <View style={box.main}>
              <View style={box.left}>
                <Text style={box.title}>Hold XSB</Text>
              </View>
              <View style={box.right}>
                <View style={box.badge}>
                  <Text style={box.value}>APR 20%</Text>
                </View>
              </View>
            </View>

            <View style={box.main}>
              <View style={box.left}>
                <View>
                  <Text style={box.title}>Referrals</Text>
                  <Text style={box.helper}>0.015% / mission</Text>
                </View>
              </View>
              <View style={box.right}>
                <View style={box.badge}>
                  <Text style={box.value}>Unlimited</Text>
                </View>
              </View>
            </View>

            {loading ? (
              <LoadingImage />
            ) : (
              <>{mode === 'mission' ? <Mission /> : <Airdrop />}</>
            )}
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};
