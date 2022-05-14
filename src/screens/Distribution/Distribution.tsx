import React from 'react';
import { SafeAreaView, ScrollView, View, StyleSheet, Text } from 'react-native';
import LottieView from 'lottie-react-native';

import { COLORS } from '../../theme';
import { grid, typo } from '../../components/Styles';
import { Airdrop } from '../Airdrop/Airdrop';

const s = StyleSheet.create({
  main: {
    flex: 1,
  },
  imgWrp: {
    width: 220,
    marginLeft: 'auto',
    marginRight: 'auto',
    marginBottom: 24,
  },
  img: {
    width: 220,
    height: 220,
  },
});

const box = StyleSheet.create({
  main: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: COLORS.dark0,
    borderRadius: 8,
    height: 72,
    marginBottom: 8,
  },
  left: {
    flex: 1,
  },
  right: {
    flex: 0,
  },
  badge: {
    backgroundColor: '#2155CD',
    borderRadius: 4,
    padding: 4,
    paddingHorizontal: 8,
  },
  title: {
    ...typo.titleLeft,
    marginBottom: 0,
    fontSize: 18,
  },
  helper: {
    ...typo.helper,
    marginBottom: 0,
    fontSize: 12,
    lineHeight: 12,
  },
  value: {
    ...typo.normal,
    marginBottom: 0,
    // color: COLORS.dark4,
    fontWeight: 'bold',
  },
});

export const Distribution = () => {
  return (
    <View style={s.main}>
      <SafeAreaView style={grid.container}>
        <ScrollView>
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
                  <Text style={box.value}>APR - 20%</Text>
                </View>
              </View>
            </View>

            <View style={box.main}>
              <View style={box.left}>
                <View>
                  <Text style={box.title}>Referrals</Text>
                  <Text style={box.helper}>Unlimited</Text>
                </View>
              </View>
              <View style={box.right}>
                <View style={box.badge}>
                  <Text style={box.value}>0.015% / mission</Text>
                </View>
              </View>
            </View>

            <Airdrop />
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};
