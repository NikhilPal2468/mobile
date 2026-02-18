import React from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Switch, Alert } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
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

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t('form.step9.title')}</Text>

      <Controller
        control={control}
        name="scienceFairGrade"
        render={({ field: { onChange, value } }) => (
          <View style={styles.field}>
            <Text style={styles.label}>{t('form.step9.scienceFairGrade')}</Text>
            <TextInput
              style={styles.input}
              value={value || ''}
              onChangeText={(text) => {
                const cleaned = text.replace(/[^A-Za-z0-9]/g, '').toUpperCase();
                onChange(cleaned);
              }}
              placeholder="Enter Grade (e.g., A, B, C)"
              maxLength={2}
              autoCapitalize="characters"
            />
          </View>
        )}
      />

      <Controller
        control={control}
        name="mathsFairGrade"
        render={({ field: { onChange, value } }) => (
          <View style={styles.field}>
            <Text style={styles.label}>{t('form.step9.mathsFairGrade')}</Text>
            <TextInput
              style={styles.input}
              value={value || ''}
              onChangeText={(text) => {
                const cleaned = text.replace(/[^A-Za-z0-9]/g, '').toUpperCase();
                onChange(cleaned);
              }}
              placeholder="Enter Grade (e.g., A, B, C)"
              maxLength={2}
              autoCapitalize="characters"
            />
          </View>
        )}
      />

      <Controller
        control={control}
        name="itFairGrade"
        render={({ field: { onChange, value } }) => (
          <View style={styles.field}>
            <Text style={styles.label}>{t('form.step9.itFairGrade')}</Text>
            <TextInput
              style={styles.input}
              value={value || ''}
              onChangeText={(text) => {
                const cleaned = text.replace(/[^A-Za-z0-9]/g, '').toUpperCase();
                onChange(cleaned);
              }}
              placeholder="Enter Grade (e.g., A, B, C)"
              maxLength={2}
              autoCapitalize="characters"
            />
          </View>
        )}
      />

      <Controller
        control={control}
        name="workExperienceGrade"
        render={({ field: { onChange, value } }) => (
          <View style={styles.field}>
            <Text style={styles.label}>{t('form.step9.workExperienceGrade')}</Text>
            <TextInput
              style={styles.input}
              value={value || ''}
              onChangeText={(text) => {
                const cleaned = text.replace(/[^A-Za-z0-9]/g, '').toUpperCase();
                onChange(cleaned);
              }}
              placeholder="Enter Grade (e.g., A, B, C)"
              maxLength={2}
              autoCapitalize="characters"
            />
          </View>
        )}
      />

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
              <Text style={styles.label}>{t('form.step9.clubs')}</Text>
              <Text style={styles.hint}>
                {t('form.step9.clubs')}
              </Text>
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
