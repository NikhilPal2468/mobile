import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useForm, Controller, useWatch } from 'react-hook-form';
import SelectModal from '../SelectModal';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import { step1Schema } from '../../validation/schemas';

interface Step1FormProps {
  onSubmit: (data: any) => void;
  initialData?: any;
}

const Step1Form: React.FC<Step1FormProps> = ({ onSubmit, initialData }) => {
  const { t } = useTranslation();
  const [examNameModalVisible, setExamNameModalVisible] = useState(false);
  const { control, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(step1Schema),
    defaultValues: initialData || {},
  });

  const onNext = handleSubmit(
    (data) => onSubmit(data),
    (err) => {
      const firstMessage = Object.values(err).map((e: any) => e?.message).filter(Boolean)[0];
      if (firstMessage) Alert.alert(t('common.error', 'Error'), firstMessage);
    }
  );

  const examNameOptions = [
    'SLCC (2025-2026)',
    'SLCC (2007-2025)',
    'THSLC-IHRD (New scheme)',
    'CBSE',
    'ICSE',
    'Others',
    'THSLC-Tech Edu(Now Scheme 2016 Onwards)',
  ];

  const watchedExamName = useWatch({
    control,
    name: 'examName',
  });

  return (
    <ScrollView style={styles.scrollView}>
      <View style={styles.container}>
        <Text style={styles.title}>{t('form.step1.title')}</Text>

      <Controller
        control={control}
        name="examCode"
        render={({ field: { onChange, value } }) => (
          <View style={styles.field}>
            <Text style={styles.label}>{t('form.step1.examCode')}</Text>
            <TextInput
              style={[styles.input, errors.examCode && styles.inputError]}
              value={value}
              onChangeText={onChange}
              placeholder={t('form.step1.examCode')}
            />
            {errors.examCode && (
              <Text style={styles.errorText}>{errors.examCode.message as string}</Text>
            )}
          </View>
        )}
      />

      <Controller
        control={control}
        name="examName"
        render={({ field: { onChange, value } }) => (
          <View style={styles.field}>
            <Text style={styles.label}>{t('form.step1.examName')}</Text>
            <TouchableOpacity
              style={styles.selectTouchable}
              onPress={() => setExamNameModalVisible(true)}
            >
              <Text style={value ? styles.selectText : styles.selectPlaceholder}>
                {value || t('form.step1.examNamePlaceholder', 'Select exam')}
              </Text>
            </TouchableOpacity>
            <SelectModal
              visible={examNameModalVisible}
              onClose={() => setExamNameModalVisible(false)}
              label={t('form.step1.examName')}
              options={examNameOptions.map((opt) => ({ label: opt, value: opt }))}
              selectedValue={value}
              onSelect={onChange}
            />
          </View>
        )}
      />

      {watchedExamName === 'Others' && (
        <Controller
          control={control}
          name="examNameOther"
          render={({ field: { onChange, value } }) => (
            <View style={styles.field}>
              <Text style={styles.label}>{t('form.step1.examName')}</Text>
              <TextInput
                style={styles.input}
                value={value}
                onChangeText={onChange}
                placeholder={t('form.step1.examName')}
              />
            </View>
          )}
        />
      )}

      <Controller
        control={control}
        name="registerNumber"
        render={({ field: { onChange, value } }) => (
          <View style={styles.field}>
            <Text style={styles.label}>{t('form.step1.registerNumber')}</Text>
            <TextInput
              style={styles.input}
              value={value}
              onChangeText={onChange}
              placeholder={t('form.step1.registerNumber')}
            />
          </View>
        )}
      />

      <Controller
        control={control}
        name="passingMonth"
        render={({ field: { onChange, value } }) => (
          <View style={styles.field}>
            <Text style={styles.label}>{t('form.step1.passingMonth')}</Text>
            <TextInput
              style={styles.input}
              value={value}
              onChangeText={onChange}
              placeholder={t('form.step1.passingMonth')}
            />
          </View>
        )}
      />

      <Controller
        control={control}
        name="passingYear"
        render={({ field: { onChange, value } }) => (
          <View style={styles.field}>
            <Text style={styles.label}>{t('form.step1.passingYear')}</Text>
            <TextInput
              style={styles.input}
              value={value}
              onChangeText={onChange}
              placeholder={t('form.step1.passingYear')}
              keyboardType="number-pad"
            />
          </View>
        )}
      />

      <Controller
        control={control}
        name="schoolCode"
        render={({ field: { onChange, value } }) => (
          <View style={styles.field}>
            <Text style={styles.label}>{t('form.step1.schoolCode')}</Text>
            <TextInput
              style={styles.input}
              value={value}
              onChangeText={onChange}
              placeholder={t('form.step1.schoolCode')}
            />
          </View>
        )}
      />

      <Controller
        control={control}
        name="schoolName"
        render={({ field: { onChange, value } }) => (
          <View style={styles.field}>
            <Text style={styles.label}>{t('form.step1.schoolName')}</Text>
            <TextInput
              style={styles.input}
              value={value}
              onChangeText={onChange}
              placeholder={t('form.step1.schoolName')}
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

export default Step1Form;
