import faker from 'faker';
import React, { forwardRef, useRef, useState } from 'react';
import {
  StyleSheet,
  Text, TextInput, TouchableOpacity, View
} from 'react-native';
import { Modalize } from 'react-native-modalize';
import { useCombinedRefs } from '../../hooks/use-combined-refs';
import { COLORS } from '../../theme';


export const FixedContent = forwardRef(
  ({ children, onClose }: { children: any, onClose?: () => void }, ref) => {
    const modalizeRef = useRef(null);
    const combinedRef = useCombinedRefs(ref, modalizeRef);
    const [toggle, setToggle] = useState(true);

    const handleClose = () => {
      if (combinedRef.current) {
        combinedRef.current.close();
      }
    };

    const renderContent = () => (
      <View style={s.content}>
        <Text style={s.content__subheading}>{'Last step'.toUpperCase()}</Text>
        <Text style={s.content__heading}>Send the message?</Text>
        <Text style={s.content__description}>{faker.lorem.paragraph()}</Text>

        <TouchableOpacity
          style={s.content__description}
          activeOpacity={0.75}
          onPress={() => setToggle(!toggle)}
        >
          <Text>adjustToContentHeight {JSON.stringify(toggle)}</Text>
        </TouchableOpacity>

        <TextInput
          style={s.content__input}
          placeholder="Type your username"
          clearButtonMode="while-editing"
        />

        <TouchableOpacity
          style={s.content__button}
          activeOpacity={0.75}
          onPress={handleClose}
        >
          <Text style={s.content__buttonText}>{'Send'.toUpperCase()}</Text>
        </TouchableOpacity>
      </View>
    );

    return (
      <Modalize
        ref={combinedRef}
        adjustToContentHeight={toggle}
        onClose={onClose}
        scrollViewProps={{
          style: {
            backgroundColor: COLORS.dark0,
            borderTopLeftRadius: 10,
            borderTopRightRadius: 10,
            overflow: 'hidden',
          },
        }}
      >
        {children ? children : renderContent()}
      </Modalize>
    );
  },
);

const s = StyleSheet.create({
  content: {
    padding: 20,
    paddingBottom: 40,
  },

  content__icon: {
    width: 32,
    height: 32,

    marginBottom: 20,
  },

  content__subheading: {
    marginBottom: 2,

    fontSize: 16,
    fontWeight: '600',
    color: '#ccc',
  },

  content__heading: {
    fontSize: 24,
    fontWeight: '600',
    color: '#333',
  },

  content__description: {
    paddingTop: 10,
    paddingBottom: 10,

    fontSize: 15,
    fontWeight: '200',
    lineHeight: 22,
    color: '#666',
  },

  content__input: {
    paddingVertical: 15,
    marginBottom: 20,

    width: '100%',

    borderWidth: 1,
    borderColor: 'transparent',
    borderBottomColor: '#cdcdcd',
    borderRadius: 6,
  },

  content__button: {
    paddingVertical: 15,

    width: '100%',

    backgroundColor: '#333',
    borderRadius: 6,
  },

  content__buttonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
    textAlign: 'center',
  },
});
