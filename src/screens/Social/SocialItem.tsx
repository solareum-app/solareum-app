import { ImageCached } from '@Components/ImageCached/ImageCached';
import { FacebookWebView } from '@Components/Modals/FacebookWebView';
import { typo } from '@Components/Styles';
import { COLORS } from '@Theme/index';
import { format } from 'date-fns';
import React, { useRef } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Portal } from 'react-native-portalize';
import bullImg from './bull.jpg';

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

  const openSendScreen = () => {
    refView?.current?.open();
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
        />
      </Portal>
    </View>
  );
};
