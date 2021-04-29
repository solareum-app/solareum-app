import React from 'react';
import { View, ScrollView } from 'react-native';
import { SearchBar } from 'react-native-elements';

import TokensList from '../../components/TokensList';

const TokensListed: React.FC = () => {
  const [query, setQuery] = React.useState('');

  return (
    <View style={{ flex: 1 }}>
      {/* <SearchBar
        // placeholder="Type Here..."
        onChangeText={setQuery}
        value={query}
      /> */}
      <ScrollView>
        <TokensList query={query} />
      </ScrollView>
    </View>
  );
};

export default TokensListed;
