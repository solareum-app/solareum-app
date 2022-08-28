import { grid } from '@Components/Styles';
import { SWAP_APP, useConfig } from '@Core/AppProvider/RemoteConfigProvider';
import { COLORS } from '@Theme/colors';
import { FONT_SIZES } from '@Theme/index';
import React from 'react';
import { ScrollView, Switch, View } from 'react-native';
import { ListItem } from 'react-native-elements';

const SwapItem = ({ name, active, onChange }) => {
  return (
    <ListItem
      bottomDivider
      containerStyle={{
        backgroundColor: COLORS.dark0,
        borderBottomColor: COLORS.dark4,
      }}
    >
      <ListItem.Content>
        <ListItem.Title
          style={{ color: COLORS.white0, fontSize: FONT_SIZES.lg }}
        >
          {name}
        </ListItem.Title>
      </ListItem.Content>
      <Switch
        trackColor={{ false: COLORS.white4, true: COLORS.white4 }}
        thumbColor={active ? COLORS.success : COLORS.dark4}
        ios_backgroundColor={COLORS.dark4}
        onValueChange={onChange}
        value={active}
      />
    </ListItem>
  );
};

export const SwapContainer = () => {
  const { swap, setSwap } = useConfig();

  return (
    <View>
      <SwapItem
        name="Jupiter"
        active={swap === SWAP_APP.JUPITER}
        onChange={() => setSwap(SWAP_APP.JUPITER)}
      />
      <SwapItem
        name="1Sol"
        active={swap === SWAP_APP.ONE_SOL}
        onChange={() => setSwap(SWAP_APP.ONE_SOL)}
      />
    </View>
  );
};

const ManageSwapApplication: React.FC = () => {
  return (
    <View style={grid.container}>
      <ScrollView>
        <SwapContainer />
      </ScrollView>
    </View>
  );
};

export default ManageSwapApplication;
