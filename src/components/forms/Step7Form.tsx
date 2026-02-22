import React from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import FieldLabel from '../FieldLabel';
import { step7Schema } from '../../validation/schemas';

interface Step7FormProps {
  onSubmit: (data: any) => void;
  initialData?: any;
}

const Step7Form: React.FC<Step7FormProps> = ({ onSubmit, initialData }) => {
  const { t } = useTranslation();
  const { control, handleSubmit } = useForm({
    resolver: zodResolver(step7Schema),
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
      <Text style={styles.title}>{t('form.step7.title')}</Text>

      <Controller
        control={control}
        name="kalolsavamStateCount"
        render={({ field: { onChange, value } }) => (
          <View style={styles.field}>
            <FieldLabel label={t('form.step7.stateCount')} helperText={t('form.step7.stateCountHelp', '')} />
            <TextInput
              style={styles.input}
              value={value?.toString() || ''}
              onChangeText={(text) => {
                const cleaned = text.replace(/[^0-9]/g, '');
                const num = cleaned ? parseInt(cleaned, 10) : null;
                onChange(isNaN(num) ? null : num);
              }}
              placeholder="0"
              keyboardType="number-pad"
            />
          </View>
        )}
      />

      <Controller
        control={control}
        name="kalolsavamDistrictA"
        render={({ field: { onChange, value } }) => (
          <View style={styles.field}>
            <FieldLabel label={t('form.step7.districtA')} helperText={t('form.step7.districtAHelp', '')} />
            <TextInput
              style={styles.input}
              value={value?.toString() || ''}
              onChangeText={(text) => {
                const cleaned = text.replace(/[^0-9]/g, '');
                const num = cleaned ? parseInt(cleaned, 10) : null;
                onChange(isNaN(num) ? null : num);
              }}
              placeholder="0"
              keyboardType="number-pad"
            />
          </View>
        )}
      />

      <Controller
        control={control}
        name="kalolsavamDistrictB"
        render={({ field: { onChange, value } }) => (
          <View style={styles.field}>
            <FieldLabel label={t('form.step7.districtB')} helperText={t('form.step7.districtBHelp', '')} />
            <TextInput
              style={styles.input}
              value={value?.toString() || ''}
              onChangeText={(text) => {
                const cleaned = text.replace(/[^0-9]/g, '');
                const num = cleaned ? parseInt(cleaned, 10) : null;
                onChange(isNaN(num) ? null : num);
              }}
              placeholder="0"
              keyboardType="number-pad"
            />
          </View>
        )}
      />

      <Controller
        control={control}
        name="kalolsavamDistrictC"
        render={({ field: { onChange, value } }) => (
          <View style={styles.field}>
            <FieldLabel label={t('form.step7.districtC')} helperText={t('form.step7.districtCHelp', '')} />
            <TextInput
              style={styles.input}
              value={value?.toString() || ''}
              onChangeText={(text) => {
                const cleaned = text.replace(/[^0-9]/g, '');
                const num = cleaned ? parseInt(cleaned, 10) : null;
                onChange(isNaN(num) ? null : num);
              }}
              placeholder="0"
              keyboardType="number-pad"
            />
          </View>
        )}
      />

      <Controller
        control={control}
        name="kalolsavamDistrictParticipation"
        render={({ field: { onChange, value } }) => (
          <View style={styles.field}>
            <FieldLabel label={t('form.step7.districtParticipation')} helperText={t('form.step7.districtParticipationHelp', '')} />
            <TextInput
              style={styles.input}
              value={value?.toString() || ''}
              onChangeText={(text) => {
                const cleaned = text.replace(/[^0-9]/g, '');
                const num = cleaned ? parseInt(cleaned, 10) : null;
                onChange(isNaN(num) ? null : num);
              }}
              placeholder="0"
              keyboardType="number-pad"
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

export default Step7Form;
