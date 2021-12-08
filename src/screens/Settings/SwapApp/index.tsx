import React from 'react';
import { ScrollView, View, Switch } from 'react-native';
import { ListItem } from 'react-native-elements';

import { grid } from '../../../components/Styles';
import { FONT_SIZES } from '../../../theme';
import { COLORS } from '../../../theme/colors';
import {
  SWAP_APP,
  useConfig,
} from '../../../core/AppProvider/RemoteConfigProvider';

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

const ManageSwapApplication: React.FC = () => {
  const { swap, setSwap } = useConfig();

  return (
    <View style={grid.container}>
      <ScrollView>
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
      </ScrollView>
    </View>
  );
};

export default ManageSwapApplication;
