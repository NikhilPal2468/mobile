import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert, TextInput, Switch } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Icon from '../Icon';
import FieldLabel from '../FieldLabel';
import { step11Schema } from '../../validation/schemas';
// Razorpay requires development build - conditionally import
let RazorpayCheckout: any = null;
try {
  RazorpayCheckout = require('react-native-razorpay').default;
} catch (e) {
  console.warn('Razorpay not available in Expo Go. Development build required.');
}
import { pdfAPI, applicationAPI, paymentAPI } from '../../services/api';
import PdfViewerModal, { arrayBufferToBase64 } from '../PdfViewerModal';

interface Step11FormProps {
  onSubmit: (data: any) => void;
  initialData?: any;
  /** Called after successful submit with the refetched application; use to update store and navigate */
  onSubmitSuccess?: (application: any) => void;
}

interface Preference {
  preferenceNumber: number;
  schoolCode: string;
  combinationCode: string;
}

const Step11Form: React.FC<Step11FormProps> = ({ onSubmit, initialData, onSubmitSuccess }) => {
  const { t } = useTranslation();
  const { control, handleSubmit: handleFormSubmit, formState: { errors: formErrors } } = useForm({
    resolver: zodResolver(step11Schema),
    defaultValues: initialData || {},
  });
  const [preferences, setPreferences] = useState<Preference[]>(() => {
    if (initialData?.preferences) {
      return initialData.preferences;
    }
    return [{ preferenceNumber: 1, schoolCode: '', combinationCode: '' }];
  });
  const [generatingPDF, setGeneratingPDF] = useState(false);
  const [paymentCompleted, setPaymentCompleted] = useState(false);
  const [checkingPayment, setCheckingPayment] = useState(true);
  const [pdfModalVisible, setPdfModalVisible] = useState(false);
  const [pdfDataUrl, setPdfDataUrl] = useState<string | null>(null);

  useEffect(() => {
    checkPaymentStatus();
  }, []);

  const checkPaymentStatus = async () => {
    try {
      const response = await paymentAPI.getStatus();
      if (response.data && response.data.paid) {
        setPaymentCompleted(true);
      }
    } catch (error) {
      console.error('Failed to check payment status:', error);
    } finally {
      setCheckingPayment(false);
    }
  };

  const handlePreviewPDF = async () => {
    if (generatingPDF || pdfModalVisible) return;
    setGeneratingPDF(true);
    setPdfModalVisible(true);
    setPdfDataUrl(null);
    try {
      const response = await pdfAPI.get();
      const arrayBuffer = await response.arrayBuffer();
      const base64 = arrayBufferToBase64(arrayBuffer);
      if (base64) {
        setPdfDataUrl(`data:application/pdf;base64,${base64}`);
      } else {
        setPdfModalVisible(false);
        setTimeout(() => Alert.alert(t('common.error'), 'Failed to load PDF preview'), 300);
      }
    } catch (error: any) {
      setPdfModalVisible(false);
      setTimeout(() => Alert.alert(t('common.error'), error.message || 'Failed to generate PDF'), 300);
    } finally {
      setGeneratingPDF(false);
    }
  };

  const handlePayment = async () => {
    if (!RazorpayCheckout) {
      Alert.alert(
        'Development Build Required',
        'Payment requires a development build. Please build the app using EAS Build or run: npx expo run:ios'
      );
      return;
    }

    try {
      const orderResponse = await paymentAPI.createOrder(500);
      const { orderId, key } = orderResponse.data;

      const options = {
        description: 'School Admission Application Fee',
        image: 'https://your-logo-url.com/logo.png',
        currency: 'INR',
        key: key,
        amount: 50000,
        name: 'School Admission',
        order_id: orderId,
        prefill: {
          email: initialData?.email || '',
          contact: initialData?.phone || '',
          name: initialData?.applicantName || '',
        },
        theme: { color: '#007AFF' },
      };

      const paymentData = await RazorpayCheckout.open(options);

      const verifyResponse = await paymentAPI.verify(
        orderId,
        paymentData.razorpay_payment_id,
        paymentData.razorpay_signature
      );

      if (verifyResponse.data.success) {
        setPaymentCompleted(true);
        Alert.alert(t('common.success'), 'Payment completed successfully!');
      } else {
        Alert.alert(t('common.error'), 'Payment verification failed');
      }
    } catch (error: any) {
      if (error.code === 'RazorpayCheckout') {
        Alert.alert('Payment Cancelled', 'Payment was cancelled');
      } else {
        Alert.alert(t('common.error'), error.description || error.message || 'Payment failed');
      }
    }
  };

  const addPreference = () => {
    if (preferences.length >= 50) {
      Alert.alert('Limit', 'Maximum 50 preferences allowed');
      return;
    }
    setPreferences([
      ...preferences,
      { preferenceNumber: preferences.length + 1, schoolCode: '', combinationCode: '' },
    ]);
  };

  const removePreference = (index: number) => {
    if (preferences.length === 1) {
      Alert.alert('Required', 'At least one preference is required');
      return;
    }
    const newPrefs = preferences.filter((_, i) => i !== index);
    // Renumber preferences
    const renumbered = newPrefs.map((p, i) => ({
      ...p,
      preferenceNumber: i + 1,
    }));
    setPreferences(renumbered);
  };

  const updatePreference = (index: number, field: 'schoolCode' | 'combinationCode', value: string) => {
    const updated = [...preferences];
    updated[index] = { ...updated[index], [field]: value || '' };
    setPreferences(updated);
    console.log(`Updated ${field} for preference ${index + 1}:`, value);
  };

  const handlePreferencesSubmit = () => {
    // Validate that all preferences have school and combination
    const invalid = preferences.some(
      (p) => !p.schoolCode || !p.combinationCode
    );
    
    if (invalid) {
      Alert.alert('Validation Error', 'Please fill all preferences completely');
      return;
    }
    
    // Save preferences first
    onSubmit({ preferences });
  };

  const handleFinalSubmit = async (data: any) => {
    if (!paymentCompleted) {
      Alert.alert('Payment Required', 'Please complete payment before submitting');
      return;
    }

    if (!data.disclaimerAccepted) {
      Alert.alert('Required', 'Please accept the disclaimer');
      return;
    }

    try {
      await applicationAPI.submit();
      const getRes = await applicationAPI.get();
      const application = getRes.data?.application ?? null;
      if (application) {
        onSubmitSuccess?.(application);
      }
      Alert.alert(t('common.success'), 'Application submitted successfully!');
      onSubmit(data);
    } catch (error: any) {
      Alert.alert(t('common.error'), 'Failed to submit application');
    }
  };

  return (
    <>
    <ScrollView style={styles.scrollView}>
      <View style={styles.container}>
        <Text style={styles.title}>{t('form.step11.title')}</Text>

        {preferences.map((pref, index) => (
          <View key={index} style={styles.preferenceCard}>
            <View style={styles.preferenceHeader}>
              <Text style={styles.preferenceNumber}>
                {t('form.step11.preference')} {pref.preferenceNumber}
              </Text>
              {preferences.length > 1 && (
                <TouchableOpacity
                  onPress={() => removePreference(index)}
                  style={styles.removeButton}
                >
                  <Icon name="close" size={20} color="#FF3B30" />
                </TouchableOpacity>
              )}
            </View>

            <View style={styles.field}>
              <FieldLabel
                label={t('form.step11.schoolCode')}
                helperText={t('form.step11.schoolCodeHelp', '')}
              />
              <TextInput
                style={styles.input}
                value={pref.schoolCode}
                onChangeText={(value) => updatePreference(index, 'schoolCode', value)}
                placeholder="Enter School Code"
                placeholderTextColor="#999"
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>

            <View style={styles.field}>
              <FieldLabel
                label={t('form.step11.combinationCode')}
                helperText={t('form.step11.combinationCodeHelp', '')}
              />
              <TextInput
                style={styles.input}
                value={pref.combinationCode}
                onChangeText={(value) => updatePreference(index, 'combinationCode', value)}
                placeholder="Enter Combination Code"
                placeholderTextColor="#999"
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>
          </View>
        ))}

        {preferences.length < 50 && (
          <TouchableOpacity style={styles.addButton} onPress={addPreference}>
            <Icon name="add" size={20} color="#007AFF" />
            <Text style={styles.addButtonText}>{t('form.step11.addPreference')}</Text>
          </TouchableOpacity>
        )}

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={handlePreferencesSubmit}>
            <Text style={styles.buttonText}>{t('common.next')}</Text>
          </TouchableOpacity>
        </View>

        {/* Step 13 content merged here */}
        <View style={styles.section}>
          <Controller
            control={control}
            name="disclaimerAccepted"
            render={({ field: { onChange, value } }) => (
              <View style={styles.disclaimerRow}>
                <Switch
                  value={value || false}
                  onValueChange={onChange}
                  trackColor={{ false: '#ddd', true: '#007AFF' }}
                  thumbColor={value ? '#fff' : '#f4f3f4'}
                />
                <Text style={styles.disclaimerText}>{t('form.step13.disclaimer')}</Text>
              </View>
            )}
          />
          {formErrors.disclaimerAccepted && (
            <Text style={styles.errorText}>{formErrors.disclaimerAccepted.message as string}</Text>
          )}
        </View>

        <TouchableOpacity
          style={styles.previewButton}
          onPress={handlePreviewPDF}
          disabled={generatingPDF}
        >
          <Text style={styles.previewButtonText}>
            {generatingPDF ? t('common.loading') : t('form.step13.previewPDF')}
          </Text>
        </TouchableOpacity>

        {!paymentCompleted && !checkingPayment && (
          <TouchableOpacity style={styles.paymentButton} onPress={handlePayment}>
            <Text style={styles.paymentButtonText}>Pay ₹500</Text>
          </TouchableOpacity>
        )}

        {checkingPayment && (
          <View style={styles.checkingPayment}>
            <Text style={styles.checkingPaymentText}>Checking payment status...</Text>
          </View>
        )}

        {paymentCompleted && (
          <View style={styles.paymentSuccess}>
            <Text style={styles.paymentSuccessText}>✓ Payment Completed</Text>
          </View>
        )}

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.submitButton, !paymentCompleted && styles.buttonDisabled]}
            onPress={handleFormSubmit(handleFinalSubmit, (err) => {
              const firstMessage = Object.values(err).map((e: any) => e?.message).filter(Boolean)[0];
              if (firstMessage) Alert.alert(t('common.error', 'Error'), firstMessage);
            })}
            disabled={!paymentCompleted}
          >
            <Text style={styles.buttonText}>{t('form.step13.finalSubmit')}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
    <PdfViewerModal
      visible={pdfModalVisible}
      onClose={() => setPdfModalVisible(false)}
      dataUrl={pdfDataUrl}
      loading={generatingPDF && !pdfDataUrl}
    />
    </>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  container: {
    padding: 20,
    backgroundColor: '#fff',
    margin: 15,
    borderRadius: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  preferenceCard: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
    backgroundColor: '#f9f9f9',
  },
  preferenceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  preferenceNumber: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  removeButton: {
    padding: 5,
  },
  field: {
    marginBottom: 15,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 5,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    backgroundColor: '#fff',
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
    color: '#333',
    minHeight: 50,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#007AFF',
    borderStyle: 'dashed',
    borderRadius: 8,
    padding: 15,
    marginBottom: 20,
  },
  addButtonText: {
    color: '#007AFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  buttonContainer: {
    marginTop: 10,
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
  errorText: {
    color: '#FF3B30',
    fontSize: 12,
    marginTop: 5,
    fontStyle: 'italic',
  },
  section: {
    marginTop: 20,
    marginBottom: 15,
  },
  disclaimerRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  disclaimerText: {
    flex: 1,
    marginLeft: 10,
    fontSize: 14,
    color: '#333',
  },
  previewButton: {
    backgroundColor: '#34C759',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 15,
  },
  previewButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  paymentButton: {
    backgroundColor: '#FF9500',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 15,
  },
  paymentButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  paymentSuccess: {
    backgroundColor: '#f0fdf4',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#34C759',
  },
  paymentSuccessText: {
    color: '#34C759',
    fontSize: 16,
    fontWeight: '600',
  },
  checkingPayment: {
    padding: 15,
    alignItems: 'center',
    marginBottom: 15,
  },
  checkingPaymentText: {
    color: '#666',
    fontSize: 14,
  },
  submitButton: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
  },
});

export default Step11Form;
