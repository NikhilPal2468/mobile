import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import SelectModal from '../SelectModal';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import FieldLabel from '../FieldLabel';
import { step10Schema } from '../../validation/schemas';

interface Step10FormProps {
  onSubmit: (data: any) => void;
  initialData?: any;
}

const ATTEMPT_OPTIONS = Array.from({ length: 10 }, (_, i) => {
  const n = i + 1;
  return { label: n.toString(), value: n };
});

const Step10Form: React.FC<Step10FormProps> = ({ onSubmit, initialData }) => {
  const { t } = useTranslation();
  const [attemptsModalVisible, setAttemptsModalVisible] = useState(false);
  const { control, handleSubmit } = useForm({
    resolver: zodResolver(step10Schema),
    defaultValues: initialData || {},
  });
  const [attempts, setAttempts] = useState(initialData?.sslcAttempts || 1);
  const onNext = handleSubmit(
    (data) => onSubmit(data),
    (err) => {
      const firstMessage = Object.values(err).map((e: any) => e?.message).filter(Boolean)[0];
      if (firstMessage) Alert.alert(t('common.error', 'Error'), firstMessage);
    }
  );

  const subjects = [
    { id: 'LangI', label: t('form.step10.subject.langI', 'Lang I (Language I)') },
    { id: 'LangII', label: t('form.step10.subject.langII', 'Lang II (Language II)') },
    { id: 'Eng', label: t('form.step10.subject.eng', 'Eng (English)') },
    { id: 'Hin', label: t('form.step10.subject.hin', 'Hin (Hindi)') },
    { id: 'SS', label: t('form.step10.subject.ss', 'SS (Social Studies)') },
    { id: 'Phy', label: t('form.step10.subject.phy', 'Phy (Physics)') },
    { id: 'Che', label: t('form.step10.subject.che', 'Che (Chemistry)') },
    { id: 'Bio', label: t('form.step10.subject.bio', 'Bio (Biology)') },
    { id: 'Maths', label: t('form.step10.subject.maths', 'Maths (Mathematics)') },
    { id: 'IT', label: t('form.step10.subject.it', 'IT (Information Technology)') },
  ] as const;

  return (
    <ScrollView style={styles.scrollView}>
      <View style={styles.container}>
        <Text style={styles.title}>{t('form.step10.title')}</Text>

        <Controller
          control={control}
          name="sslcAttempts"
          render={({ field: { onChange, value } }) => {
            const numValue = value ?? attempts;
            return (
              <View style={styles.field}>
                <FieldLabel
                  label={t('form.step10.attempts')}
                  helperText={t('form.step10.attemptsHelp', '')}
                />
                <TouchableOpacity
                  style={styles.selectTouchable}
                  onPress={() => setAttemptsModalVisible(true)}
                >
                  <Text style={styles.selectText}>
                    {numValue}
                  </Text>
                </TouchableOpacity>
                <SelectModal<number>
                  visible={attemptsModalVisible}
                  onClose={() => setAttemptsModalVisible(false)}
                  label={t('form.step10.attempts')}
                  options={ATTEMPT_OPTIONS}
                  selectedValue={numValue}
                  onSelect={(n) => {
                    onChange(n);
                    setAttempts(n);
                    setAttemptsModalVisible(false);
                  }}
                />
              </View>
            );
          }}
        />

        {attempts >= 1 && (
          <View style={styles.field}>
            <FieldLabel
              label={t('form.step10.previousAttempts')}
              helperText={t('form.step10.previousAttemptsHelp', '')}
            />
            {Array.from({ length: attempts }).map((_, index) => (
              <View key={index} style={styles.previousAttemptRow}>
                <Text style={styles.hint}>
                  {t('form.step10.previousAttempts')} #{index + 1}
                </Text>
                <Controller
                  control={control}
                  name={`previousAttempts.${index}.regNo`}
                  render={({ field: { onChange, value } }) => (
                    <TextInput
                      style={styles.input}
                      value={value || ''}
                      onChangeText={onChange}
                      placeholder={t('form.step1.registerNumber')}
                    />
                  )}
                />
                <Controller
                  control={control}
                  name={`previousAttempts.${index}.month`}
                  render={({ field: { onChange, value } }) => (
                    <TextInput
                      style={styles.input}
                      value={value || ''}
                      onChangeText={onChange}
                      placeholder={t('form.step1.passingMonth')}
                    />
                  )}
                />
                <Controller
                  control={control}
                  name={`previousAttempts.${index}.year`}
                  render={({ field: { onChange, value } }) => (
                    <TextInput
                      style={styles.input}
                      value={value || ''}
                      onChangeText={onChange}
                      placeholder={t('form.step1.passingYear')}
                      keyboardType="number-pad"
                    />
                  )}
                />
              </View>
            ))}
          </View>
        )}

        <View style={styles.field}>
          <FieldLabel
            label={t('form.step10.subjectGrades')}
            helperText={t('form.step10.subjectGradesHelp', '')}
          />
          {subjects.map((subject) => (
            <Controller
              key={subject.id}
              control={control}
              name={`subjectGrade_${subject.id}` as any}
              render={({ field: { onChange, value } }) => (
                <View style={styles.subjectRow}>
                  <Text style={styles.subjectLabel}>{subject.label}</Text>
                  <TextInput
                    style={[styles.input, styles.gradeInput]}
                    value={value || ''}
                    onChangeText={(text) => {
                      // Only allow English alphanumeric characters (A-Z, 0-9)
                      const cleaned = text.replace(/[^A-Za-z0-9]/g, '').toUpperCase();
                      onChange(cleaned);
                    }}
                    placeholder="Grade"
                    maxLength={2}
                    keyboardType="default"
                    autoCapitalize="characters"
                  />
                </View>
              )}
            />
          ))}
        </View>

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
  hint: {
    fontSize: 12,
    color: '#666',
    fontStyle: 'italic',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
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
  previousAttemptRow: {
    marginBottom: 10,
  },
  subjectRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  subjectLabel: {
    flex: 1,
    fontSize: 14,
    color: '#333',
  },
  gradeInput: {
    width: 80,
    textAlign: 'center',
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

export default Step10Form;
