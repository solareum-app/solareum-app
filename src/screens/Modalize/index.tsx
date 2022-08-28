import { Button } from '@Components/Button/Button';
import { Header } from '@Components/Header/Header';
import { Layout } from '@Components/Layout/Layout';
import { AbsoluteHeader } from '@Components/Modals/AbsoluteHeader';
import { AppleMusicPlayer } from '@Components/Modals/AppleMusicPlayer';
import { FacebookWebView } from '@Components/Modals/FacebookWebView';
import { FixedContent } from '@Components/Modals/FixedContent';
import { FlatList } from '@Components/Modals/FlatList';
import { SectionList } from '@Components/Modals/SectionList';
import { SimpleContent } from '@Components/Modals/SimpleContent';
import { SlackTabView } from '@Components/Modals/SlackTabView';
import { SnappingList } from '@Components/Modals/SnappingList';
import React, { useRef } from 'react';
import { Animated, View } from 'react-native';
import { Portal } from 'react-native-portalize';
// import { AlwaysOpen } from '../../components/Modals/AlwaysOpen';

const CashScreen = () => {
  const modals = Array.from({ length: 8 }).map(_ => useRef(null).current);
  const animated = useRef(new Animated.Value(0)).current;

  const renderButtons = links => {
    return links.map((link, i) => <Button key={i} onPress={() => modals[i].open()} name={link} />);
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#000' }}>
      <Layout
        // Style here is used to create the iOS 13 modal presentation style for the AppleMusicPlayer example
        style={{
          borderRadius: animated.interpolate({ inputRange: [0, 1], outputRange: [0, 12] }),
          transform: [
            {
              scale: animated.interpolate({ inputRange: [0, 1], outputRange: [1, 0.92] }),
            },
          ],
          opacity: animated.interpolate({ inputRange: [0, 1], outputRange: [1, 0.75] }),
        }}
      >
        <Header subheading="Run with React Navigation" />

        {renderButtons([
          'Fixed content',
          'Absolute header',
          'Simple content',
          'Snapping list',
          'Flat List',
          'Section List',
          'Apple Music Player',
          'Facebook WebView',
          'Slack TabView',
        ])}

        <Portal>
          <FixedContent ref={el => (modals[0] = el)} />
          <AbsoluteHeader ref={el => (modals[1] = el)} />
          <SimpleContent ref={el => (modals[2] = el)} />
          <SnappingList ref={el => (modals[3] = el)} />
          <FlatList ref={el => (modals[4] = el)} />
          <SectionList ref={el => (modals[5] = el)} />
          <AppleMusicPlayer ref={el => (modals[6] = el)} animated={animated} />
          <FacebookWebView ref={el => (modals[7] = el)} />
          <SlackTabView ref={el => (modals[8] = el)} />
          {/* <AlwaysOpen /> */}
        </Portal>
      </Layout>
    </View>
  );
};

export default CashScreen;
