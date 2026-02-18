import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '../../store/authStore';
import { authAPI } from '../../services/api';
import { runNetworkTest, formatNetworkTestResult } from '../../utils/networkTest';

const LoginScreen = () => {
  const { t } = useTranslation();
  const { setAuth } = useAuthStore();
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [loading, setLoading] = useState(false);
  const [testingNetwork, setTestingNetwork] = useState(false);

  const handleTestNetwork = async () => {
    setTestingNetwork(true);
    try {
      const result = await runNetworkTest();
      Alert.alert('Network test', formatNetworkTestResult(result));
    } catch (e: any) {
      Alert.alert('Network test', `Error: ${e?.message || e}`);
    } finally {
      setTestingNetwork(false);
    }
  };

  const handleSendOTP = async () => {
    if (!/^\d{10}$/.test(phone)) {
      Alert.alert(t('common.error'), t('auth.invalidPhone'));
      return;
    }

    setLoading(true);
    try {
      await authAPI.sendOTP(phone);
      setStep('otp');
      Alert.alert(t('common.success'), 'OTP sent successfully');
    } catch (error: any) {
      Alert.alert(t('common.error'), error.response?.data?.error || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    if (!otp || otp.length !== 6) {
      Alert.alert(t('common.error'), t('auth.invalidOTP'));
      return;
    }

    setLoading(true);
    try {
      const response = await authAPI.verifyOTP(phone, otp);
      await setAuth(response.data.user, response.data.token);
    } catch (error: any) {
      Alert.alert(t('common.error'), error.response?.data?.error || 'Invalid OTP');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t('auth.phoneNumber')}</Text>
      
      {step === 'phone' ? (
        <>
          <TextInput
            style={styles.input}
            placeholder={t('auth.enterPhone')}
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
            maxLength={10}
          />
          <TouchableOpacity
            style={styles.button}
            onPress={handleSendOTP}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>{t('auth.sendOTP')}</Text>
            )}
          </TouchableOpacity>
        </>
      ) : (
        <>
          <TextInput
            style={styles.input}
            placeholder={t('auth.enterOTP')}
            value={otp}
            onChangeText={setOtp}
            keyboardType="number-pad"
            maxLength={6}
          />
          <TouchableOpacity
            style={styles.button}
            onPress={handleVerifyOTP}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>{t('auth.verifyOTP')}</Text>
            )}
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.linkButton}
            onPress={() => setStep('phone')}
          >
            <Text style={styles.linkText}>{t('auth.resendOTP')}</Text>
          </TouchableOpacity>
        </>
      )}

      <TouchableOpacity
        style={styles.networkTestButton}
        onPress={handleTestNetwork}
        disabled={testingNetwork}
      >
        {testingNetwork ? (
          <ActivityIndicator size="small" color="#666" />
        ) : (
          <Text style={styles.networkTestText}>Test network</Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 15,
    fontSize: 16,
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  linkButton: {
    marginTop: 15,
    alignItems: 'center',
  },
  linkText: {
    color: '#007AFF',
    fontSize: 14,
  },
  networkTestButton: {
    marginTop: 24,
    paddingVertical: 10,
    alignItems: 'center',
  },
  networkTestText: {
    color: '#666',
    fontSize: 13,
  },
});

export default LoginScreen;
