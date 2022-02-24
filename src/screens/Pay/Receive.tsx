import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  DeviceEventEmitter,
  Share,
  TouchableOpacity,
} from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import Clipboard from '@react-native-community/clipboard';
import dynamicLinks from '@react-native-firebase/dynamic-links';

import { COLORS } from '../../theme/colors';
import { RoundedButton } from '../../components/RoundedButton';
import { typo } from '../../components/Styles';
import { MESSAGE_TYPE } from '../EventMessage/EventMessage';
import { EventMessage } from '../EventMessage/EventMessage';
import { useLocalize } from '../../core/AppProvider/LocalizeProvider';
import { usePrice } from '../../core/AppProvider/PriceProvider';
import { getItem, setItem } from '../../storage/Collection';

const KEY_LR = 'LIGHTNING_REWARDS';

const s = StyleSheet.create({
  main: {
    position: 'relative',
    backgroundColor: COLORS.dark0,
    padding: 20,
    paddingBottom: 40,
    borderRadius: 12,
    margin: 20,
  },
  body: {
    marginTop: 20,
    marginBottom: 20,
  },
  qr: {
    marginLeft: 'auto',
    marginRight: 'auto',
    borderRadius: 4,
    borderWidth: 16,
    marginBottom: 20,
    borderColor: 'white',
  },
  footer: {},
  control: {
    flexDirection: 'row',
    marginLeft: 'auto',
    marginRight: 'auto',
    marginTop: 20,
  },
  controlItem: {
    marginLeft: 12,
    marginRight: 12,
  },
  button: {
    marginTop: 8,
  },
  loadingWrp: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: 240,
  },
  warning: { marginBottom: 16 },
  notificationWrp: {
    position: 'relative',
    zIndex: 9999,
  },
});

const getLRLink = async (address: string, token: string = 'XSB') => {
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

export const Receive = () => {
  const { t } = useLocalize();
  const { accountList } = usePrice();

  const solAccount = accountList.find((i) => i.mint === 'SOL');
  const address = solAccount.publicKey;

  const copyToClipboard = () => {
    Clipboard.setString(address);
    DeviceEventEmitter.emit(MESSAGE_TYPE.copy, address);
  };

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

  const onShare = async () => {
    try {
      const result = await Share.share({ message: address });
      return result;
    } catch {}
  };

  return (
    <View>
      <View style={s.notificationWrp}>
        <EventMessage top={36} />
      </View>

      <View style={s.main}>
        <Text style={typo.title}>Receive Tokens</Text>
        <View style={s.body}>
          <TouchableOpacity style={s.qr} onPress={copyToClipboard}>
            <QRCode value={address} size={220} />
          </TouchableOpacity>
          <TouchableOpacity onPress={copyToClipboard}>
            <Text style={typo.address}>{address}</Text>
          </TouchableOpacity>
        </View>
        <View style={s.footer}>
          <Text style={typo.helper}>{t('receive-note-01')}</Text>
          <Text style={typo.helper}>
            {t('receive-note-02', { name: 'SOL' })}
          </Text>
        </View>
      </View>

      <View>
        <View style={s.control}>
          <View style={s.controlItem}>
            <RoundedButton
              onClick={copyToClipboard}
              title={t('receive-copy')}
              iconName="addfile"
            />
          </View>
          <View style={s.controlItem}>
            <RoundedButton
              onClick={() => onShare()}
              title={t('receive-share')}
              iconName="upload"
            />
          </View>
          <View style={s.controlItem}>
            <RoundedButton
              isRewards
              onClick={copyRewardsLink}
              title="XSB"
              iconName="zap"
              type="feather"
            />
          </View>
        </View>
      </View>
    </View>
  );
};
