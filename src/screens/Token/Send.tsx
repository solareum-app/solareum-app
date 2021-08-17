import React, { useState } from 'react';
import { View, Text, StyleSheet, Linking } from 'react-native';
import Clipboard from '@react-native-community/clipboard';
import { Input, Button, Icon } from 'react-native-elements';
import { PublicKey } from '@solana/web3.js';
import LottieView from 'lottie-react-native';
import QRCodeScanner from 'react-native-qrcode-scanner';
// import { RNCamera } from 'react-native-camera';

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
  containerInput: {
    position: 'relative',
  },
  controls: {
    position: 'absolute',
    top: 0,
    right: 0,
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    width: 100,
    zIndex: 1,
    backgroundColor: COLORS.dark0,
    paddingLeft: 20,
  },
  iconQrCamera: {
    marginLeft: 20,
  },
  pasteTxt: {
    color: COLORS.white0,
  },
});

const qr = StyleSheet.create({
  qrContainer: {
    position: 'absolute',
    zIndex: 10,
    backgroundColor: COLORS.dark0,
    flex: 1,
    height: '120%',
    marginRight: 20,
  },
  rqCodeScannerContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    width: '100%',
  },
  camera: {
    position: 'relative',
    width: 200,
    height: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottomText: {
    color: COLORS.white0,
    top: 40,
    maxWidth: 300,
    textAlign: 'center',
  },
  iconBack: {
    position: 'absolute',
    top: 10,
    left: 10,
  },
});

const Step1 = ({ address, setAddress, amount, setAmount, next, token }) => {
  const [isShowQrCode, setIsShowQrCode] = useState(false);
  const { symbol, usd } = token;
  const estValue = amount * usd;

  const openCameraQrCode = () => {
    setIsShowQrCode(true);
  };

  const onSuccess = (e: any) => {
    setAddress(e.data);
    if (e.data) {
      setIsShowQrCode(false);
    }
  };

  const onPaste = async () => {
    const text = await Clipboard.getString();
    setAddress(text);
  }

  const closeQrCodeView = () => {
    setIsShowQrCode(false);
  };

  const renderQrCodeCamera = () => {
    return (
      <View style={qr.qrContainer}>
        <QRCodeScanner
          containerStyle={qr.rqCodeScannerContainer}
          cameraStyle={qr.camera}
          onRead={onSuccess}
          cameraType="front"
          bottomContent={
            <Text style={qr.bottomText}>
              Place a barcode inside the viewfinder rectangle to scan it
            </Text>
          }
        />
        <Icon
          type="feather"
          name="arrow-left"
          color={COLORS.white4}
          size={20}
          onPress={() => closeQrCodeView()}
          containerStyle={qr.iconBack}
        />
      </View>
    );
  };

  return (
    <View style={s.main}>
      {isShowQrCode && renderQrCodeCamera()}
      <Text style={typo.title}>Chuyển {symbol}</Text>
      <View style={s.body}>
        <View style={s.containerInput}>
          <Input
            label="Địa chỉ ví"
            placeholder=""
            style={typo.input}
            labelStyle={s.inputLabel}
            containerStyle={s.inputContainer}
            value={address}
            onChangeText={(value) => setAddress(value)}
          />
          <View style={s.controls}>
            <Text onPress={() => onPaste()} style={s.pasteTxt}>Paste</Text>
            <Icon
              type="feather"
              name="camera"
              color={COLORS.white4}
              size={20}
              containerStyle={s.iconQrCamera}
              onPress={() => openCameraQrCode()}
            />
          </View>
        </View>

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

const s3 = StyleSheet.create({
  body: {
    marginTop: 20,
    marginBottom: 20,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  img: {
    width: 220,
    height: 220,
  },
  message: {
    color: COLORS.white4,
    textAlign: 'center',
    fontSize: 18,
  },
  footer: {
    marginTop: 20,
  },
});

const Step3 = ({ signature }) => {
  const openBrowser = () => {
    Linking.openURL(`https://solscan.io/tx/${signature}`);
  };

  return (
    <View style={s.main}>
      <View style={s3.body}>
        <LottieView
          autoPlay
          loop
          source={require('../../theme/lottie/check.json')}
          style={s3.img}
        />
        <Text style={s3.message}>Giao dịch thành công</Text>
      </View>
      <View style={s.footer}>
        <Button
          title="Chi tiết giao dịch"
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
      if (token.mint === 'SOL') {
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
