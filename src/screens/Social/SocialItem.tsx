import React, { useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Portal } from 'react-native-portalize';
import { format } from 'date-fns';

import { ImageCached } from '../../components/ImageCached/ImageCached';
import { COLORS } from '../../theme';
import { FacebookWebView } from '../../components/Modals/FacebookWebView';
import { typo } from '../../components/Styles';
import bullImg from './bull.jpg';
import { useRewards } from '../../core/AppProvider/RewardsProvider';

const s = StyleSheet.create({
  main: {
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'row',
    marginBottom: 16,
  },
  image: {
    width: 50,
    height: 50,
    flex: 0,
    marginRight: 16,
    borderRadius: 4,
  },
  titleWrp: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    lineHeight: 24,
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 12,
    lineHeight: 16,
    color: COLORS.white4,
  },
});

const DOMAIN = 'https://www.wealthclub.vn/t';

export const SocialItem = ({ model }) => {
  const refView = useRef();
  const { getRewards } = useRewards();

  const openSendScreen = () => {
    refView?.current?.open();
  };

  const onClose = () => {
    getRewards();
  };

  return (
    <View>
      <TouchableOpacity style={s.main} onPress={openSendScreen}>
        <ImageCached
          source={model.image_url ? { uri: model.image_url } : bullImg}
          style={s.image}
        />
        <View style={s.titleWrp}>
          <Text style={[typo.normal, s.title]}>{model.title}</Text>
          <Text style={[typo.normal, s.subtitle]}>
            {format(new Date(model.created_at), 'MMM dd, yyyy hh:mm')}
          </Text>
        </View>
      </TouchableOpacity>

      <Portal>
        <FacebookWebView
          ref={refView}
          url={`${DOMAIN}/${model.slug}/${model.id}`}
          onClose={onClose}
        />
      </Portal>
    </View>
  );
};
