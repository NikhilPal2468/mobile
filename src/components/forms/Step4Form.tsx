import React from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useForm, Controller, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import FieldLabel from '../FieldLabel';
import { step4Schema } from '../../validation/schemas';

interface Step4FormProps {
  onSubmit: (data: any) => void;
  initialData?: any;
}

const Step4Form: React.FC<Step4FormProps> = ({ onSubmit, initialData }) => {
  const { t } = useTranslation();
  const { control, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(step4Schema),
    defaultValues: initialData || {},
  });
  const onNext = handleSubmit(
    (data) => onSubmit(data),
    (err) => {
      const firstMessage = Object.values(err).map((e: any) => e?.message).filter(Boolean)[0];
      if (firstMessage) Alert.alert(t('common.error', 'Error'), firstMessage);
    }
  );

  const watchedNativeState = useWatch({
    control,
    name: 'nativeState',
  });
  const showNativeCountry =
    String(watchedNativeState ?? '').trim().length > 0 &&
    String(watchedNativeState ?? '').trim().toLowerCase() !== 'kerala';

  return (
    <ScrollView style={styles.scrollView}>
      <View style={styles.container}>
        <Text style={styles.title}>{t('form.step4.title')}</Text>

        <Controller
          control={control}
          name="nativeState"
          render={({ field: { onChange, value } }) => (
            <View style={styles.field}>
              <FieldLabel
                label={t('form.step4.nativeState')}
                helperText={t('form.step4.nativeStateHelp', '')}
              />
              <TextInput
                style={styles.input}
                value={value}
                onChangeText={onChange}
                placeholder={t('form.step4.nativeState')}
              />
            </View>
          )}
        />

        {showNativeCountry && (
          <Controller
            control={control}
            name="nativeCountry"
            render={({ field: { onChange, value } }) => (
              <View style={styles.field}>
                <FieldLabel
                  label={t('form.step4.nativeCountry')}
                  helperText={t('form.step4.nativeCountryHelp', '')}
                />
                <TextInput
                  style={styles.input}
                  value={value}
                  onChangeText={onChange}
                  placeholder={t('form.step4.nativeCountry')}
                />
              </View>
            )}
          />
        )}

        <Controller
          control={control}
          name="nativeDistrict"
          render={({ field: { onChange, value } }) => (
            <View style={styles.field}>
              <FieldLabel
                label={t('form.step4.nativeDistrict')}
                helperText={t('form.step4.nativeDistrictHelp', '')}
              />
              <TextInput
                style={styles.input}
                value={value}
                onChangeText={onChange}
                placeholder={t('form.step4.nativeDistrict')}
              />
            </View>
          )}
        />

        <Controller
          control={control}
          name="nativeTaluk"
          render={({ field: { onChange, value } }) => (
            <View style={styles.field}>
              <FieldLabel
                label={t('form.step4.nativeTaluk')}
                helperText={t('form.step4.nativeTalukHelp', '')}
              />
              <TextInput
                style={styles.input}
                value={value}
                onChangeText={onChange}
                placeholder={t('form.step4.nativeTaluk')}
              />
            </View>
          )}
        />

        <Controller
          control={control}
          name="nativePanchayat"
          render={({ field: { onChange, value } }) => (
            <View style={styles.field}>
              <FieldLabel
                label={t('form.step4.nativePanchayat')}
                helperText={t('form.step4.nativePanchayatHelp', '')}
              />
              <TextInput
                style={styles.input}
                value={value}
                onChangeText={onChange}
                placeholder={t('form.step4.nativePanchayat')}
              />
            </View>
          )}
        />

        <Controller
          control={control}
          name="permanentAddress"
          render={({ field: { onChange, value } }) => (
            <View style={styles.field}>
              <FieldLabel
                label={t('form.step4.permanentAddress')}
                helperText={t('form.step4.permanentAddressHelp', '')}
              />
              <TextInput
                style={[styles.input, styles.textArea]}
                value={value}
                onChangeText={onChange}
                placeholder={t('form.step4.permanentAddress')}
                multiline
                numberOfLines={4}
              />
            </View>
          )}
        />

        <Controller
          control={control}
          name="permanentPinCode"
          render={({ field: { onChange, value } }) => (
            <View style={styles.field}>
              <FieldLabel
                label={t('form.step4.permanentPinCode')}
                helperText={t('form.step4.permanentPinCodeHelp', '')}
              />
              <TextInput
                style={[styles.input, errors.permanentPinCode && styles.inputError]}
                value={value}
                onChangeText={(text) => onChange(text.replace(/\D/g, '').slice(0, 6))}
                placeholder={t('form.step4.permanentPinCode')}
                keyboardType="number-pad"
                maxLength={6}
              />
              {errors.permanentPinCode && (
                <Text style={styles.errorText}>{errors.permanentPinCode.message as string}</Text>
              )}
            </View>
          )}
        />

        <Controller
          control={control}
          name="communicationAddress"
          render={({ field: { onChange, value } }) => (
            <View style={styles.field}>
              <FieldLabel
                label={t('form.step4.communicationAddress')}
                helperText={t('form.step4.communicationAddressHelp', '')}
              />
              <TextInput
                style={[styles.input, styles.textArea]}
                value={value}
                onChangeText={onChange}
                placeholder={t('form.step4.communicationAddress')}
                multiline
                numberOfLines={4}
              />
            </View>
          )}
        />

        <Controller
          control={control}
          name="communicationPinCode"
          render={({ field: { onChange, value } }) => (
            <View style={styles.field}>
              <FieldLabel
                label={t('form.step4.communicationPinCode')}
                helperText={t('form.step4.communicationPinCodeHelp', '')}
              />
              <TextInput
                style={[styles.input, errors.communicationPinCode && styles.inputError]}
                value={value}
                onChangeText={(text) => onChange(text.replace(/\D/g, '').slice(0, 6))}
                placeholder={t('form.step4.communicationPinCode')}
                keyboardType="number-pad"
                maxLength={6}
              />
              {errors.communicationPinCode && (
                <Text style={styles.errorText}>{errors.communicationPinCode.message as string}</Text>
              )}
            </View>
          )}
        />

        <Controller
          control={control}
          name="phone"
          render={({ field: { onChange, value } }) => (
            <View style={styles.field}>
              <FieldLabel label={t('form.step4.phone')} helperText={t('form.step4.phoneHelp', '')} />
              <TextInput
                style={[styles.input, errors.phone && styles.inputError]}
                value={value}
                onChangeText={onChange}
                placeholder={t('form.step4.phone')}
                keyboardType="phone-pad"
                maxLength={10}
              />
              {errors.phone && (
                <Text style={styles.errorText}>{errors.phone.message as string}</Text>
              )}
            </View>
          )}
        />

        <Controller
          control={control}
          name="email"
          render={({ field: { onChange, value } }) => (
            <View style={styles.field}>
              <FieldLabel label={t('form.step4.email')} helperText={t('form.step4.emailHelp', '')} />
              <TextInput
                style={styles.input}
                value={value}
                onChangeText={onChange}
                placeholder={t('form.step4.email')}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
          )}
        />

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.button}
            onPress={onNext}
          >
            <Text style={styles.buttonText}>{t('common.next')}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
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
    padding: 12,
    fontSize: 16,
  },
  inputError: {
    borderColor: '#FF3B30',
  },
  errorText: {
    color: '#FF3B30',
    fontSize: 12,
    marginTop: 4,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  buttonContainer: {
    marginTop: 20,
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
});

export default Step4Form;
