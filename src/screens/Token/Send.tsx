import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, Linking } from 'react-native';
import { Input, Button } from 'react-native-elements';
import { PublicKey } from '@solana/web3.js';

import imgDone from '../../assets/clip-done.png';
import { typo } from '../../components/Styles';
import { COLORS } from '../../theme';
import { price } from '../../utils/autoRound';
import { useApp } from '../../core/AppProvider';

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
    paddingRight: 0,
  },
  inputLabel: {
    fontWeight: 'normal',
  },
  input: {},
  footer: {
    marginTop: 40,
  },
  button: {
    height: 44,
  },
  group: {
    marginBottom: 12,
  },
  groupTitle: {
    marginBottom: 8,
    color: COLORS.white4,
  },
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
  },
});

const Step1 = ({ address, setAddress, amount, setAmount, next, token }) => {
  const { symbol } = token;
  const { priceData } = useApp();
  const id = token.coingeckoId;
  const tokenPrice = priceData[id] ? priceData[id].usd : 0;
  const estValue = amount * tokenPrice;

  return (
    <View style={s.main}>
      <Text style={typo.title}>Chuyển {symbol}</Text>
      <View style={s.body}>
        <Input
          label="Địa chỉ ví"
          placeholder=""
          style={typo.input}
          labelStyle={s.inputLabel}
          containerStyle={s.inputContainer}
          value={address}
          onChangeText={(value) => setAddress(value)}
        />
        <Input
          label="Số lượng"
          placeholder=""
          keyboardType="numbers-and-punctuation"
          style={typo.input}
          labelStyle={s.inputLabel}
          containerStyle={s.inputContainer}
          value={amount}
          onChangeText={(value) => setAmount(value)}
          errorMessage={`≈$${price(estValue)}`}
          errorStyle={{ color: COLORS.white4 }}
        />
      </View>
      <View style={s.footer}>
        <Button title="Tiếp tục" buttonStyle={s.button} onPress={next} />
      </View>
    </View>
  );
};

const Step2 = ({ token, address, amount, next, busy, error }) => {
  const { symbol } = token;
  return (
    <View style={s.main}>
      <Text style={typo.title}>Chuyển {symbol}</Text>
      <View style={s.body}>
        <View style={s.group}>
          <Text style={[typo.helper, s.groupTitle]}>Token</Text>
          <Text style={[typo.normal, { lineHeight: 18 }]}>
            {symbol} / Native
          </Text>
        </View>
        <View style={s.group}>
          <Text style={[typo.helper, s.groupTitle]}>Từ Ví</Text>
          <Text style={[typo.normal, { lineHeight: 18 }]}>
            {token.publicKey || '-'}
          </Text>
        </View>
        <View style={s.group}>
          <Text style={[typo.helper, s.groupTitle]}>Chuyển đến Ví</Text>
          <Text style={[typo.normal, { lineHeight: 18 }]}>
            {address || '-'}
          </Text>
        </View>
        <View style={s.group}>
          <Text style={[typo.helper, s.groupTitle]}>Số lượng</Text>
          <Text style={[typo.normal, { lineHeight: 18 }]}>
            {amount || 0} {symbol}
          </Text>
        </View>
        <View style={s.group}>
          <Text style={[typo.helper, s.groupTitle]}>Phí</Text>
          <Text style={[typo.normal, { lineHeight: 18 }]}>0.000005 SOL</Text>
        </View>
      </View>
      <View style={s.footer}>
        {error ? (
          <View style={s.group}>
            <Text style={[typo.warning]}>
              Hiện tại chúng tôi chưa hỗ trợ chuyển token thông qua địa chỉ SOL.
              Hãy dùng địa chỉ token.
            </Text>
          </View>
        ) : null}
        <Button
          title="Xác nhận giao dịch"
          buttonStyle={s.button}
          onPress={next}
          loading={busy}
        />
      </View>
    </View>
  );
};

const Step3 = ({ signature }) => {
  const openBrowser = () => {
    Linking.openURL(`https://explorer.solana.com/tx/${signature}`);
  };

  return (
    <View style={s.main}>
      <View style={s3.body}>
        <Image source={imgDone} style={s3.cover} />
        <Text style={s3.message}>Giao dịch thành công</Text>
      </View>
      <View style={s.footer}>
        <Button
          title="Chi tiết"
          buttonStyle={s.button}
          type="clear"
          onPress={openBrowser}
        />
      </View>
    </View>
  );
};

export const Send = ({ initStep = 1, token }) => {
  const [step, setStep] = useState(initStep);
  const [address, setAddress] = useState('');
  const [error, setError] = useState('');
  const [amount, setAmount] = useState('');
  const [signature, setSignature] = useState('');
  const { wallet } = useApp();
  const [busy, setBusy] = useState(false);

  const transfer = async () => {
    setBusy(true);
    const destination = new PublicKey(address);
    let qty = Math.round(parseFloat(amount) * Math.pow(10, token.decimals));
    let sig = '';

    try {
      if (!token.mint) {
        sig = await wallet.transferSol(destination, qty);
      } else {
        sig = await wallet.transferToken(
          new PublicKey(token.publicKey),
          destination,
          qty,
          new PublicKey(token.mint),
          token.decimals,
          null,
          true,
        );
      }
      setSignature(sig);
      setBusy(false);
      setStep(3);
    } catch (err) {
      console.log('err', err);
      setError(err);
      setBusy(false);
    }
  };

  if (step === 1) {
    return (
      <Step1
        next={() => setStep(2)}
        address={address}
        setAddress={setAddress}
        amount={amount}
        setAmount={setAmount}
        token={token}
      />
    );
  }

  if (step === 2) {
    return (
      <Step2
        token={token}
        address={address}
        amount={amount}
        next={transfer}
        busy={busy}
        error={error}
      />
    );
  }

  return <Step3 signature={signature} />;
};
