import React, { useRef } from 'react';
import { View, Text, StyleSheet, Image, Dimensions, TouchableOpacity } from 'react-native';
import { Portal } from 'react-native-portalize';

import { FacebookWebView } from '../../components/Modals/FacebookWebView';
import { typo } from '../../components/Styles';
import bullImg from './bull.jpg';

const windowWidth = Dimensions.get('window').width;

const s = StyleSheet.create({
  main: {
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  image: {
    width: windowWidth - 40,
    height: 160,
    marginBottom: 4,
  },
  title: {
    fontSize: 16,
    lineHeight: 20,
  }
});

const DOMAIN = 'https://www.wealthclub.vn/t';

export const SocialItem = ({ model }) => {
  const refSend = useRef();
  const openSendScreen = () => {
    refSend?.current?.open();
  }

  return (
    <View>
      <TouchableOpacity style={s.main} onPress={openSendScreen}>
        <Image source={model.image_url ? { uri: model.image_url } : bullImg} style={s.image} />
        <Text style={[typo.normal, s.title]}>{model.title}</Text>
      </TouchableOpacity>

      <Portal>
        <FacebookWebView ref={refSend} url={`${DOMAIN}/${model.slug}/${model.id}`} />
      </Portal>
    </View>
  )
}
