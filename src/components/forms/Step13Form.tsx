import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert, Switch } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import { step13Schema } from '../../validation/schemas';
import FieldLabel from '../FieldLabel';
// Razorpay requires development build - conditionally import
let RazorpayCheckout: any = null;
try {
  RazorpayCheckout = require('react-native-razorpay').default;
} catch (e) {
  console.warn('Razorpay not available in Expo Go. Development build required.');
}
import { pdfAPI, applicationAPI, paymentAPI } from '../../services/api';
import PdfViewerModal, { arrayBufferToBase64 } from '../PdfViewerModal';

interface Step13FormProps {
  onSubmit: (data: any) => void;
  initialData?: any;
}

const Step13Form: React.FC<Step13FormProps> = ({ onSubmit, initialData }) => {
  const { t } = useTranslation();
  const { control, handleSubmit } = useForm({
    resolver: zodResolver(step13Schema),
    defaultValues: initialData || {},
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
      const response = await paymentAPI.getStatus('');
      if (response.data && response.data.paid) {
        setPaymentCompleted(true);
      }
    } catch (error) {
      console.error('Failed to check payment status:', error);
      // If no payment record exists, that's okay - user hasn't paid yet
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
      // Create payment order
      const orderResponse = await paymentAPI.createOrder(500);
      const { orderId, key } = orderResponse.data;

      // Open Razorpay checkout
      const options = {
        description: 'School Admission Application Fee',
        image: 'https://your-logo-url.com/logo.png', // Optional: Add your logo
        currency: 'INR',
        key: key,
        amount: 50000, // ₹500 in paise
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

      // Verify payment
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
        // User cancelled payment
        Alert.alert('Payment Cancelled', 'Payment was cancelled');
      } else {
        Alert.alert(t('common.error'), error.description || error.message || 'Payment failed');
      }
    }
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
        <Text style={styles.title}>{t('form.step13.title')}</Text>

        <View style={styles.section}>
          <Controller
            control={control}
            name="disclaimerAccepted"
            render={({ field: { onChange, value } }) => (
              <>
                <View style={styles.switchRow}>
                  <View style={styles.switchLabel}>
                    <FieldLabel
                      label={t('form.step13.acceptDisclaimer')}
                      helperText={t('form.step13.acceptDisclaimerHelp', '')}
                      containerStyle={{ marginBottom: 0 }}
                    />
                  </View>
                  <Switch
                    value={value || false}
                    onValueChange={onChange}
                    trackColor={{ false: '#ddd', true: '#007AFF' }}
                    thumbColor={value ? '#fff' : '#f4f3f4'}
                  />
                </View>
                <Text style={styles.disclaimerText}>{t('form.step13.disclaimer')}</Text>
              </>
            )}
          />
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
            style={[styles.button, !paymentCompleted && styles.buttonDisabled]}
            onPress={handleSubmit(handleFinalSubmit, (err) => {
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
  section: {
    marginBottom: 25,
  },
  disclaimerRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  switchLabel: {
    flex: 1,
    paddingRight: 12,
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
    fontSize: 14,
    color: '#666',
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
  buttonDisabled: {
    backgroundColor: '#ccc',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default Step13Form;
