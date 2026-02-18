import React from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Switch, Alert } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import { step3Schema } from '../../validation/schemas';

interface Step3FormProps {
  onSubmit: (data: any) => void;
  initialData?: any;
}

const Step3Form: React.FC<Step3FormProps> = ({ onSubmit, initialData }) => {
  const { t } = useTranslation();
  const { control, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(step3Schema),
    defaultValues: initialData || {},
  });
  const onNext = handleSubmit(
    (data) => onSubmit(data),
    (err) => {
      const firstMessage = Object.values(err).map((e: any) => e?.message).filter(Boolean)[0];
      if (firstMessage) Alert.alert(t('common.error', 'Error'), firstMessage);
    }
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t('form.step3.title')}</Text>

      <Controller
        control={control}
        name="oec"
        render={({ field: { onChange, value } }) => (
          <View style={styles.field}>
            <View style={styles.switchRow}>
              <Text style={styles.label}>{t('form.step3.oec')}</Text>
              <Switch
                value={value || false}
                onValueChange={onChange}
                trackColor={{ false: '#ddd', true: '#007AFF' }}
                thumbColor={value ? '#fff' : '#f4f3f4'}
              />
            </View>
          </View>
        )}
      />

      <Controller
        control={control}
        name="linguisticMinority"
        render={({ field: { onChange, value } }) => (
          <View style={styles.field}>
            <View style={styles.switchRow}>
              <Text style={styles.label}>{t('form.step3.linguisticMinority')}</Text>
              <Switch
                value={value || false}
                onValueChange={onChange}
                trackColor={{ false: '#ddd', true: '#007AFF' }}
                thumbColor={value ? '#fff' : '#f4f3f4'}
              />
            </View>
          </View>
        )}
      />

      <Controller
        control={control}
        name="linguisticLanguage"
        render={({ field: { onChange, value } }) => (
          <View style={styles.field}>
            <Text style={styles.label}>{t('form.step3.linguisticLanguage')}</Text>
            <TextInput
              style={styles.input}
              value={value}
              onChangeText={onChange}
              placeholder={t('form.step3.linguisticLanguage')}
            />
          </View>
        )}
      />

      <Controller
        control={control}
        name="differentlyAbled"
        render={({ field: { onChange, value } }) => (
          <View style={styles.field}>
            <View style={styles.switchRow}>
              <Text style={styles.label}>{t('form.step3.differentlyAbled')}</Text>
              <Switch
                value={value || false}
                onValueChange={onChange}
                trackColor={{ false: '#ddd', true: '#007AFF' }}
                thumbColor={value ? '#fff' : '#f4f3f4'}
              />
            </View>
          </View>
        )}
      />

      <Controller
        control={control}
        name="differentlyAbledPercentage"
        render={({ field: { onChange, value } }) => (
          <View style={styles.field}>
            <Text style={styles.label}>{t('form.step3.differentlyAbledPercentage')}</Text>
            <TextInput
              style={styles.input}
              value={value?.toString() || ''}
              onChangeText={(text) => {
                const cleaned = text.replace(/[^0-9.]/g, '');
                const num = cleaned ? parseFloat(cleaned) : null;
                onChange(isNaN(num) ? null : num);
              }}
              placeholder="0-100"
              keyboardType="numeric"
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
  );
};

const styles = StyleSheet.create({
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
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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

export default Step3Form;
