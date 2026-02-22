import React from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Switch, Alert } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import FieldLabel from '../FieldLabel';
import { step9Schema } from '../../validation/schemas';

interface Step9FormProps {
  onSubmit: (data: any) => void;
  initialData?: any;
}

const Step9Form: React.FC<Step9FormProps> = ({ onSubmit, initialData }) => {
  const { t } = useTranslation();
  const { control, handleSubmit } = useForm({
    resolver: zodResolver(step9Schema),
    defaultValues: initialData || {},
  });
  const onNext = handleSubmit(
    (data) => onSubmit(data),
    (err) => {
      const firstMessage = Object.values(err).map((e: any) => e?.message).filter(Boolean)[0];
      if (firstMessage) Alert.alert(t('common.error', 'Error'), firstMessage);
    }
  );

  const clubs = [
    'Red Cross',
    'Social Science Club',
    'Science Club',
    'Nature Club',
    'Forestry Club',
    'Maths Club',
    'Health Club',
    'Philately Club',
    'Debating Club',
    'Oratory Club',
    'IT Club',
    'Literary Contribution (Periodicals)',
    'Literary Contribution (School Magazine)',
    'Scouts & Guides',
  ];

  const GRADES = ['A', 'B', 'C', 'D', 'E'] as const;
  const fairs = [
    { key: 'scienceFairCounts', label: t('form.step9.fair.science', 'Science Fair') },
    { key: 'mathsFairCounts', label: t('form.step9.fair.maths', 'Maths Fair') },
    { key: 'itFairCounts', label: t('form.step9.fair.it', 'IT Fair') },
    { key: 'workExperienceCounts', label: t('form.step9.fair.workExperience', 'Work Experience') },
    { key: 'socialScienceFairCounts', label: t('form.step9.fair.socialScience', 'Social Science Fair') },
  ] as const;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t('form.step9.title')}</Text>

      <View style={styles.field}>
        <FieldLabel
          label={t('form.step9.fairGrades', 'Fair grades')}
          helperText={t('form.step9.fairGradesHelp', '')}
        />
        <View style={styles.grid}>
          <View style={styles.gridHeaderRow}>
            <Text style={[styles.gridHeaderCell, styles.gridFairHeaderCell]} />
            {GRADES.map((g) => (
              <Text key={g} style={styles.gridHeaderCell}>
                {g}
              </Text>
            ))}
          </View>
          {fairs.map((fair) => (
            <View key={fair.key} style={styles.gridRow}>
              <Text style={styles.gridFairCell}>{fair.label}</Text>
              {GRADES.map((g) => (
                <Controller
                  key={`${fair.key}.${g}`}
                  control={control}
                  name={`${fair.key}.${g}` as any}
                  render={({ field: { onChange, value } }) => (
                    <TextInput
                      style={styles.gridInput}
                      value={value == null ? '' : String(value)}
                      onChangeText={(text) => {
                        const cleaned = text.replace(/\D/g, '').slice(0, 2);
                        onChange(cleaned === '' ? null : parseInt(cleaned, 10));
                      }}
                      keyboardType="number-pad"
                      maxLength={2}
                      placeholder="0"
                      placeholderTextColor="#999"
                    />
                  )}
                />
              ))}
            </View>
          ))}
        </View>
      </View>

      <Controller
        control={control}
        name="clubs"
        render={({ field: { value, onChange } }) => {
          const selected: string[] = value || [];
          const toggleClub = (club: string) => {
            if (selected.includes(club)) {
              onChange(selected.filter((c) => c !== club));
            } else {
              onChange([...selected, club]);
            }
          };
          return (
            <View style={styles.field}>
              <FieldLabel label={t('form.step9.clubs')} helperText={t('form.step9.clubsHelp', '')} />
              {clubs.map((club) => (
                <View key={club} style={styles.clubRow}>
                  <Text style={styles.clubLabel}>{club}</Text>
                  <Switch
                    value={selected.includes(club)}
                    onValueChange={() => toggleClub(club)}
                    trackColor={{ false: '#ddd', true: '#007AFF' }}
                    thumbColor={selected.includes(club) ? '#fff' : '#f4f3f4'}
                  />
                </View>
              ))}
            </View>
          );
        }}
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
  hint: {
    fontSize: 12,
    color: '#666',
    fontStyle: 'italic',
  },
  clubRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
  },
  clubLabel: {
    fontSize: 14,
    color: '#333',
    flex: 1,
    paddingRight: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  grid: {
    borderWidth: 1,
    borderColor: '#E5E5EA',
    borderRadius: 10,
    overflow: 'hidden',
  },
  gridHeaderRow: {
    flexDirection: 'row',
    backgroundColor: '#F2F2F7',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E5E5EA',
  },
  gridHeaderCell: {
    width: 44,
    paddingVertical: 10,
    textAlign: 'center',
    fontWeight: '700',
    color: '#333',
  },
  gridFairHeaderCell: {
    width: 140,
  },
  gridRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E5E5EA',
  },
  gridFairCell: {
    width: 140,
    paddingHorizontal: 10,
    paddingVertical: 12,
    fontSize: 13,
    color: '#333',
  },
  gridInput: {
    width: 44,
    height: 44,
    textAlign: 'center',
    borderLeftWidth: StyleSheet.hairlineWidth,
    borderLeftColor: '#E5E5EA',
    fontSize: 14,
    color: '#111',
    backgroundColor: '#fff',
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

export default Step9Form;
