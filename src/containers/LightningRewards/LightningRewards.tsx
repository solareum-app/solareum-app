import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  DeviceEventEmitter,
  Share,
  Linking,
} from 'react-native';
import Clipboard from '@react-native-community/clipboard';
import dynamicLinks from '@react-native-firebase/dynamic-links';
import { Button, Icon } from 'react-native-elements';

import { COLORS } from '../../theme/colors';
import { typo } from '../../components/Styles';
import { useLocalize } from '../../core/AppProvider/LocalizeProvider';
import { usePrice } from '../../core/AppProvider/PriceProvider';
import { getItem, setItem } from '../../storage/Collection';
import { MESSAGE_TYPE } from '../../screens/EventMessage/EventMessage';

const s = StyleSheet.create({
  main: {},
  buttonStyle: {
    backgroundColor: '#9945FF',
  },
  buttonIcon: {
    marginRight: 4,
  },
  title: {
    ...typo.title,
    marginBottom: 0,
  },
  helper: {
    ...typo.helper,
    marginBottom: 16,
    textAlign: 'center',
  },
});

export const KEY_LR = 'LIGHTNING_REWARDS_00';

export const getLRLink = async (address: string, token: string = 'XSB') => {
  const defaultLink = `https://solareum.page.link/rewards?address=${address}&token=${token}`;
  const link = `https://solareum.app/lightning-rewards/?address=${address}&token=${token}`;

  try {
    const dmLink = await dynamicLinks().buildShortLink({
      link: link,
      domainUriPrefix: 'https://solareum.page.link',
      ios: {
        bundleId: 'com.solareum.wallet.WLRC5ZTG7',
        fallbackUrl: link,
      },
      android: {
        packageName: 'com.solareum',
        fallbackUrl: link,
      },
    });

    return dmLink;
  } catch {
    return defaultLink;
  }
};

export const LightningRewards = () => {
  const { t } = useLocalize();
  const { accountList } = usePrice();

  const solAccount = accountList.find((i) => i.mint === 'SOL');
  const address = solAccount?.publicKey || '';

  const copyRewardsLink = async () => {
    let link = await getItem(KEY_LR, address);
    if (!link) {
      link = await getLRLink(address);
      await setItem(KEY_LR, address, link);
    }

    const message = t('lr-share', { link });
    Clipboard.setString(message);
    DeviceEventEmitter.emit(MESSAGE_TYPE.copy, message);

    try {
      const result = await Share.share({
        message,
      });
      return result;
    } catch {}
  };

  return (
    <View style={s.main}>
      <Text style={s.title}>Lightning Rewards</Text>
      <Text style={s.helper}>A better way to receive XSB, USDC, & SOL</Text>
      <Button
        title="Share XSB Link"
        buttonStyle={s.buttonStyle}
        onPress={copyRewardsLink}
        icon={
          <Icon
            name="zap"
            type="feather"
            size={20}
            color={COLORS.white0}
            style={s.buttonIcon}
          />
        }
      />
      <Button
        title="Learn more"
        type="clear"
        titleStyle={{ color: COLORS.white4 }}
        onPress={() => {
          Linking.openURL('https://solareum.app/lightning-rewards');
        }}
      />
    </View>
  );
};
