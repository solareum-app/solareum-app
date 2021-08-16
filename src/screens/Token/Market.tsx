import React from 'react';
import { StyleSheet, View, Text, Image } from 'react-native';

import { typo } from '../../components/Styles';
import { MarketItem } from '../Market/MarketItem';
import { useMarket } from '../../core/AppProvider/MarketProvider';
import imgDelivering from '../../assets/clip-message-sent.png';

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

export const Market = ({ symbol }) => {
  const { marketList } = useMarket();
  const filteredList = marketList.filter(
    (i) => i.base === symbol || i.quote === symbol,
  );

  return (
    <View style={s.main}>
      {!filteredList.length ? (
        <View style={s.messageWrp}>
          <Image source={imgDelivering} style={s.placeholderImage} />
          <Text style={s.helper}>Hiện tại chưa có thị trường nào</Text>
        </View>
      ) : (
        <View>
          <Text style={s.title}>Thị trường</Text>
          <View style={s.market}>
            {filteredList.map((i) => (
              <MarketItem key={i.id} item={i} />
            ))}
          </View>
        </View>
      )}
    </View>
  );
};
