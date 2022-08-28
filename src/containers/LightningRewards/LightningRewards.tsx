import { typo } from '@Components/Styles';
import { useLocalize } from '@Core/AppProvider/LocalizeProvider';
import { usePrice } from '@Core/AppProvider/PriceProvider';
import Clipboard from '@react-native-community/clipboard';
import dynamicLinks from '@react-native-firebase/dynamic-links';
import { MESSAGE_TYPE } from '@Screens/EventMessage/EventMessage';
import { getItem, setItem } from '@Storage/Collection';
import { COLORS } from '@Theme/colors';
import React from 'react';
import {
  DeviceEventEmitter,
  Linking,
  Share,
  StyleSheet,
  Text,
  View
} from 'react-native';
import { Button, Icon } from 'react-native-elements';

const s = StyleSheet.create({
  main: {
    borderWidth: 1,
    borderColor: '#9945FF',
    borderRadius: 4,
    padding: 16,
  },
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

export const KEY_LR = 'LIGHTNING_REWARDS_07';

export const getLRLink = async (address: string, token: string = 'XSB') => {
  if (!address) {
    return 'https://solareum.app/lightning-rewards';
  }

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

export const LightningRewards = ({ asset = 'XSB' }: { asset: string }) => {
  const { t } = useLocalize();
  const { accountList } = usePrice();

  const solAccount = accountList.find((i) => i.mint === 'SOL');
  const address = solAccount?.publicKey || '';

  const copyRewardsLink = async () => {
    const lrLinkId = `${KEY_LR}-${asset}`;
    let link = await getItem(lrLinkId, address);
    if (!link) {
      link = await getLRLink(address, asset);
      await setItem(lrLinkId, address, link);
    }

    const message = t('lr-share', { link, asset });
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
        title={`Share ${asset} Link`}
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
