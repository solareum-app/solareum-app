import React from 'react';
import { StyleSheet, View, Text, Image } from 'react-native';

import imgDelivering from '../../assets/clip-message-sent.png';
import { typo } from '../../components/Styles';
import { useLocalize } from '../../core/AppProvider/LocalizeProvider';
import { MarketItem } from './MarketItem';

const s = StyleSheet.create({
  main: {
    marginTop: 8,
    marginBottom: 40,
  },
  title: {
    ...typo.title,
    textAlign: 'left',
  },
  market: {
    marginLeft: -20,
    marginRight: -20,
  },

  messageWrp: {
    marginTop: 60,
  },
  placeholderImage: {
    width: 240,
    height: 120,
    marginBottom: 16,
    marginLeft: 'auto',
    marginRight: 'auto',
    opacity: 0.75,
  },
  helper: {
    ...typo.normal,
    textAlign: 'center',
    opacity: 0.75,
  },
});

const fromList = ['USDC', 'USDT', 'SOL'];

export const Market = ({ symbol }) => {
  const { t } = useLocalize();

  const filteredList = fromList.filter((i) => i !== symbol);

  return (
    <View style={s.main}>
      {!filteredList.length ? (
        <View style={s.messageWrp}>
          <Image source={imgDelivering} style={s.placeholderImage} />
          <Text style={s.helper}>{t('token-market-empty')}</Text>
        </View>
      ) : (
        <View>
          <Text style={s.title}>{t('token-market-title')}</Text>
          <View style={s.market}>
            {filteredList.map((i) => (
              <MarketItem key={i.id} from={i} to={symbol} />
            ))}
          </View>
        </View>
      )}
    </View>
  );
};
