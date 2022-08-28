import { row, typo } from '@Components/Styles';
import { useLocalize } from '@Core/AppProvider/LocalizeProvider';
import React from 'react';
import { Linking, Text, View } from 'react-native';
import { Button } from 'react-native-elements';
import { style as s } from './style';

export const TokenSaleStepInfo = ({ dismiss, next, error, presale }: any) => {
  const { t } = useLocalize();

  return (
    <View style={s.main}>
      <Text style={typo.title}>XSB Token Sales</Text>
      <Text style={typo.normal}>
        For your safety, please make sure that you're going through the steps
        below before participating in the Token Sales.
      </Text>
      <View style={s.body}>
        <View style={row.mainContent}>
          <View style={row.left}>
            <Text style={row.label}>
              1. Check the ability to recover your wallet.
            </Text>
          </View>
          <View style={row.right}>
            <Button
              title="Details"
              type="clear"
              onPress={() => {
                Linking.openURL('https://bit.ly/3HeHsWN');
              }}
            />
          </View>
        </View>
        <View style={row.mainContent}>
          <View style={row.left}>
            <Text style={row.label}>
              2. Your wallet should be able to access via Phantom, Sollet, or
              other wallets.
            </Text>
          </View>
        </View>
        <View style={row.mainContent}>
          <View style={row.left}>
            <Text style={row.label}>
              3. You can purchase multiple times, a maximum of 5 times per day.
            </Text>
          </View>
        </View>
        <View style={row.mainContent}>
          <View style={row.left}>
            <Text style={row.label}>
              4. You need to create XSB account before participating in the
              Token Sales. Your USDC account should be positive.
            </Text>
          </View>
        </View>
        <View style={row.main}>
          <View style={row.left}>
            <Text style={row.label}>5. Price</Text>
          </View>
          <View style={row.right}>
            <Text style={row.value2}>
              {presale.price || '0.0075'} USDC / 1XSB
            </Text>
          </View>
        </View>
        <View style={row.main}>
          <View style={row.left}>
            <Text style={row.label}>6. Minimum Order</Text>
          </View>
          <View style={row.right}>
            <Text style={row.value2}>{presale.min_order || '0.1'} USDC</Text>
          </View>
        </View>
        <View style={row.main}>
          <View style={row.left}>
            <Text style={row.label}>7. Maximum Order</Text>
          </View>
          <View style={row.right}>
            <Text style={row.value2}>{presale.max_order || '250.0'} USDC</Text>
          </View>
        </View>
      </View>

      <View style={s.footer}>
        {error ? <Text style={typo.warning}>{error}</Text> : null}
        <Button type="outline" title={t('airdrop-info-next')} onPress={next} />
        <Button
          type="clear"
          title={t('airdrop-info-dismiss')}
          containerStyle={s.button}
          onPress={dismiss}
        />
      </View>
    </View>
  );
};
