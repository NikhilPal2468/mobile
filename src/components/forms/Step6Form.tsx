import React from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import FieldLabel from '../FieldLabel';
import { step6Schema } from '../../validation/schemas';

interface Step6FormProps {
  onSubmit: (data: any) => void;
  initialData?: any;
}

const Step6Form: React.FC<Step6FormProps> = ({ onSubmit, initialData }) => {
  const { t } = useTranslation();
  const { control, handleSubmit } = useForm({
    resolver: zodResolver(step6Schema),
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
      <Text style={styles.title}>{t('form.step6.title')}</Text>

      <Controller
        control={control}
        name="sportsStateCount"
        render={({ field: { onChange, value } }) => (
          <View style={styles.field}>
            <FieldLabel label={t('form.step6.stateCount')} helperText={t('form.step6.stateCountHelp', '')} />
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
        name="sportsDistrictFirst"
        render={({ field: { onChange, value } }) => (
          <View style={styles.field}>
            <FieldLabel label={t('form.step6.districtFirst')} helperText={t('form.step6.districtFirstHelp', '')} />
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
        name="sportsDistrictSecond"
        render={({ field: { onChange, value } }) => (
          <View style={styles.field}>
            <FieldLabel label={t('form.step6.districtSecond')} helperText={t('form.step6.districtSecondHelp', '')} />
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
        name="sportsDistrictThird"
        render={({ field: { onChange, value } }) => (
          <View style={styles.field}>
            <FieldLabel label={t('form.step6.districtThird')} helperText={t('form.step6.districtThirdHelp', '')} />
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
        name="sportsDistrictParticipation"
        render={({ field: { onChange, value } }) => (
          <View style={styles.field}>
            <FieldLabel label={t('form.step6.districtParticipation')} helperText={t('form.step6.districtParticipationHelp', '')} />
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

export default Step6Form;
