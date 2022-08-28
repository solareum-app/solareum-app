import { COLORS } from '@Theme/colors';
import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import imgDelivering from '../../assets/clip-message-sent.png';

const s = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.dark2,
  },
  placeholderWrp: {
    marginTop: 120,
  },
  placeholderImage: {
    width: 280,
    height: 140,
    marginBottom: 16,
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  message: {
    color: COLORS.white4,
    textAlign: 'center',
    fontSize: 16,
  },
});

const Notifications: React.FC = () => {
  return (
    <View style={s.container}>
      <View style={s.placeholderWrp}>
        <Image source={imgDelivering} style={s.placeholderImage} />
        <Text style={s.message}>Thông báo sẽ xuất hiện ở đây</Text>
      </View>
    </View>
  );
};

export default Notifications;
