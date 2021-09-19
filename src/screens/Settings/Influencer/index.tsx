import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  Text,
  ScrollView,
  SafeAreaView,
  Share,
} from 'react-native';
import { Button } from 'react-native-elements';

import { grid, typo } from '../../../components/Styles';
import { useToken } from '../../../core/AppProvider/TokenProvider';
import { authFetch } from '../../../utils/authfetch';
import { service } from '../../../config';

const s = StyleSheet.create({
  wrp: {
    marginBottom: 24,
  },
  helper: {
    ...typo.helper,
    marginTop: 8,
  },
});

type Props = {};

const Influencer: React.FC<Props> = () => {
  const { accountList } = useToken();
  const [rewardRef, setRewardRef] = useState(1);

  const onShare = async () => {
    try {
      const solAccount = accountList.find((i) => i.mint === 'SOL');
      const message = `Tải Solareum Wallet - https://solareum.app/getwallet. Nhập địa chỉ SOL của mình để nhận Airdrop nhé - ${solAccount?.publicKey}`;

      const result = await Share.share({
        message,
      });
      return result;
    } catch { }
  };

  useEffect(() => {
    (async () => {
      const solAccount = accountList.find((i) => i.mint === 'SOL');
      const xsbAccount = accountList.find((i) => i.symbol === 'XSB');
      const resp = await authFetch(service.postCheckAirdrop, {
        method: 'POST',
        body: {
          solAddress: solAccount?.publicKey,
          xsbAddress: xsbAccount?.publicKey,
        },
      });
      setRewardRef(resp.rewardRef);
    })();
  }, []);

  return (
    <View style={grid.container}>
      <SafeAreaView style={grid.wrp}>
        <ScrollView>
          <View style={grid.content}>
            <View style={s.wrp}>
              <Text style={typo.normal}>
                Solareum Wallet định hướng trở thành một ứng dụng không thể
                thiếu trong tương lai. Khi mà mọi người có thể chuyển, nhận SPL
                token với nhau mỗi ngày.
              </Text>
              <Text style={typo.normal}>
                Không chỉ vậy XSB còn được sử dụng trong hệ sinh thái Solareum
                Lightning, một ứng dụng web3.0, giúp mọi người có thể thưởng cho
                những nhà phát triển nội dung số.
              </Text>
              <Text style={typo.normal}>
                Hãy chia sẻ ứng dụng Solareum Wallet tới bạn bè và người thân.
                Trở thành người tiên phong và nhận được XSB không giới hạn.
              </Text>
              <Text style={typo.normal}>
                Với mỗi lượt tải và kích hoạt thành công bạn sẽ nhận được +
                {rewardRef}&nbsp;XBS.
              </Text>
            </View>

            <View style={s.wrp}>
              <Button title="Okie, Chia sẻ ngay" onPress={onShare} />
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

export default Influencer;
