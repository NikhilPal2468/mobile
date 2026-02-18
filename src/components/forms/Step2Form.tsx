import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView, Switch, Alert } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import SelectModal from '../SelectModal';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import { step2Schema } from '../../validation/schemas';

interface Step2FormProps {
  onSubmit: (data: any) => void;
  initialData?: any;
}

const GENDER_OPTIONS = [
  { label: 'Male', value: 'Male' },
  { label: 'Female', value: 'Female' },
  { label: 'Others', value: 'Others' },
];

const Step2Form: React.FC<Step2FormProps> = ({ onSubmit, initialData }) => {
  const { t } = useTranslation();
  const [genderModalVisible, setGenderModalVisible] = useState(false);
  const { control, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(step2Schema),
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
    <ScrollView style={styles.scrollView}>
      <View style={styles.container}>
        <Text style={styles.title}>{t('form.step2.title')}</Text>

      <Controller
        control={control}
        name="applicantName"
        render={({ field: { onChange, value } }) => (
          <View style={styles.field}>
            <Text style={styles.label}>{t('form.step2.name')}</Text>
            <TextInput
              style={[styles.input, errors.applicantName && styles.inputError]}
              value={value}
              onChangeText={onChange}
              placeholder={t('form.step2.name')}
            />
            {errors.applicantName && (
              <Text style={styles.errorText}>{errors.applicantName.message as string}</Text>
            )}
          </View>
        )}
      />

      <Controller
        control={control}
        name="aadhaarNumber"
        render={({ field: { onChange, value } }) => (
          <View style={styles.field}>
            <Text style={styles.label}>{t('form.step2.aadhaarNumber')}</Text>
            <TextInput
              style={styles.input}
              value={value}
              onChangeText={onChange}
              placeholder={t('form.step2.aadhaarNumber')}
              keyboardType="number-pad"
            />
          </View>
        )}
      />

      <Controller
        control={control}
        name="gender"
        render={({ field: { onChange, value } }) => (
          <View style={styles.field}>
            <Text style={styles.label}>{t('form.step2.gender')}</Text>
            <TouchableOpacity
              style={styles.selectTouchable}
              onPress={() => setGenderModalVisible(true)}
            >
              <Text style={value ? styles.selectText : styles.selectPlaceholder}>
                {value || t('form.step2.genderPlaceholder', 'Select gender')}
              </Text>
            </TouchableOpacity>
            <SelectModal
              visible={genderModalVisible}
              onClose={() => setGenderModalVisible(false)}
              label={t('form.step2.gender')}
              options={GENDER_OPTIONS}
              selectedValue={value}
              onSelect={onChange}
            />
          </View>
        )}
      />

      <Controller
        control={control}
        name="category"
        render={({ field: { onChange, value } }) => (
          <View style={styles.field}>
            <Text style={styles.label}>{t('form.step2.category')}</Text>
            <TextInput
              style={styles.input}
              value={value}
              onChangeText={onChange}
              placeholder={t('form.step2.category')}
            />
          </View>
        )}
      />

      <Controller
        control={control}
        name="categoryCode"
        render={({ field: { onChange, value } }) => (
          <View style={styles.field}>
            <Text style={styles.label}>{t('form.step2.categoryCode')}</Text>
            <TextInput
              style={styles.input}
              value={value}
              onChangeText={onChange}
              placeholder={t('form.step2.categoryCode')}
            />
          </View>
        )}
      />

      <Controller
        control={control}
        name="dateOfBirth"
        render={({ field: { onChange, value } }) => (
          <View style={styles.field}>
            <Text style={styles.label}>{t('form.step2.dateOfBirth')}</Text>
            <TextInput
              style={styles.input}
              value={value}
              onChangeText={onChange}
              placeholder={t('form.step2.dateOfBirth')}
            />
          </View>
        )}
      />

      <Controller
        control={control}
        name="motherName"
        render={({ field: { onChange, value } }) => (
          <View style={styles.field}>
            <Text style={styles.label}>{t('form.step2.motherName')}</Text>
            <TextInput
              style={styles.input}
              value={value}
              onChangeText={onChange}
              placeholder={t('form.step2.motherName')}
            />
          </View>
        )}
      />

      <Controller
        control={control}
        name="fatherName"
        render={({ field: { onChange, value } }) => (
          <View style={styles.field}>
            <Text style={styles.label}>{t('form.step2.fatherName')}</Text>
            <TextInput
              style={styles.input}
              value={value}
              onChangeText={onChange}
              placeholder={t('form.step2.fatherName')}
            />
          </View>
        )}
      />

      <Controller
        control={control}
        name="ews"
        render={({ field: { onChange, value } }) => (
          <View style={styles.field}>
            <View style={styles.switchRow}>
              <Text style={styles.label}>{t('form.step2.ewsEligible')}</Text>
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
  scrollView: { flex: 1 },
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
  selectTouchable: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    minHeight: 48,
    justifyContent: 'center',
  },
  selectText: {
    fontSize: 16,
    color: '#000',
  },
  selectPlaceholder: {
    fontSize: 16,
    color: '#999',
  },
  errorText: {
    color: '#FF3B30',
    fontSize: 12,
    marginTop: 4,
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

export default Step2Form;
