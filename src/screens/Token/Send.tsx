import React, { useState } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { Input, Button, Avatar } from 'react-native-elements';

import imgDone from '../../assets/clip-done.png';
import { typo } from '../../components/Styles';
import { COLORS } from '../../theme';

const s = StyleSheet.create({
  main: {
    backgroundColor: COLORS.dark0,
    minHeight: 400,
    padding: 20,
    paddingBottom: 40,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  body: {
    marginTop: 20,
  },
  inputContainer: {
    paddingLeft: 0,
    paddingRight: 0
  },
  inputLabel: {
    fontWeight: 'normal'
  },
  input: {
  },
  header: {
    marginBottom: 20,
  },
  footer: {
    marginTop: 40,
  },
  button: {
    height: 52
  },
  card: {
    backgroundColor: COLORS.dark2,
    padding: 20,
    borderRadius: 10,
  },
  group: {
    marginBottom: 12,
  },
  groupTitle: {
    marginBottom: 8,
    color: COLORS.white4
  },
  iconWrp: {
    justifyContent: 'center',
    alignItems: 'center'
  }
});

const s3 = StyleSheet.create({
  body: {
    marginTop: 60,
    marginBottom: 60,
  },
  cover: {
    width: 280,
    height: 140,
    marginBottom: 16,
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  message: {
    color: COLORS.white4,
    textAlign: 'center',
    fontSize: 18,
  },
  footer: {
    marginTop: 40,
  }
});

const Step1 = ({ address, setAddress, amount, setAmount, next }) => {
  return (
    <View style={s.main}>
      <Text style={typo.title}>Chuyển SOL</Text>
      <View style={s.body}>
        <Input
          label="Địa chỉ ví"
          placeholder=""
          style={typo.input}
          labelStyle={s.inputLabel}
          containerStyle={s.inputContainer}
          value={address}
          onChangeText={value => setAddress(value)}
        />
        <Input
          label="Số lượng"
          placeholder=""
          keyboardType="numeric"
          style={typo.input}
          labelStyle={s.inputLabel}
          containerStyle={s.inputContainer}
          value={amount}
          onChangeText={value => setAmount(value)}
        />
        <Text style={typo.helper}>Ad nostrud pariatur commodo deserunt incididunt dolore Lorem sit veniam minim eiusmod laborum culpa.</Text>
      </View>
      <View style={s.footer}>
        <Button title="Tiếp tục" buttonStyle={s.button} onPress={next} />
      </View>
    </View>
  )
}

const Step2 = ({ address, amount, next }) => {
  return (
    <View style={s.main}>
      <View style={s.body}>
        <View style={s.header}>
          <View style={s.iconWrp}>
            <Avatar
              size="large"
              rounded
              source={{
                uri: "https://cdn.jsdelivr.net/gh/trustwallet/assets@master/blockchains/solana/info/logo.png"
              }}
            />
            <Text style={[typo.normal, typo.bold]}>Solana</Text>
          </View>
        </View>
        <View style={s.card}>
          <View style={s.group}>
            <Text style={[typo.helper, s.groupTitle]}>Token</Text>
            <Text style={[typo.normal, { lineHeight: 18 }]}>SOL / Native</Text>
          </View>
          <View style={s.group}>
            <Text style={[typo.helper, s.groupTitle]}>Từ Ví</Text>
            <Text style={[typo.normal, { lineHeight: 18 }]}>{address || '-'}</Text>
          </View>
          <View style={s.group}>
            <Text style={[typo.helper, s.groupTitle]}>Chuyển đến Ví</Text>
            <Text style={[typo.normal, { lineHeight: 18 }]}>{address || '-'}</Text>
          </View>
          <View style={s.group}>
            <Text style={[typo.helper, s.groupTitle]}>Số lượng</Text>
            <Text style={[typo.normal, { lineHeight: 18 }]}>{amount || 0} SOL</Text>
          </View>
          <View style={s.group}>
            <Text style={[typo.helper, s.groupTitle]}>Phí</Text>
            <Text style={[typo.normal, { lineHeight: 18 }]}>0.000005 SOL</Text>
          </View>
        </View>
      </View>
      <View style={s.footer}>
        <Button title="Xác nhận giao dịch" buttonStyle={s.button} onPress={next} />
      </View>
    </View>
  )
}

const Step3 = () => {
  return (
    <View style={s.main}>
      <View style={s3.body}>
        <Image source={imgDone} style={s3.cover} />
        <Text style={s3.message}>Giao dịch thành công</Text>
      </View>
      <View style={s.footer}>
        <Button title="Kiểm tra" buttonStyle={s.button} type="clear" />
      </View>
    </View>
  )
};

export const Send = ({ initStep }) => {
  const [step, setStep] = useState(1);
  const [address, setAddress] = useState('');
  const [amount, setAmount] = useState('');

  if (step === 1) {
    return (
      <Step1
        next={() => setStep(2)}
        address={address}
        setAddress={setAddress}
        amount={amount}
        setAmount={setAmount}
      />
    )
  }

  if (step === 2) {
    return <Step2 address={address} amount={amount} next={() => setStep(3)} />;
  }

  return <Step3 />
};
