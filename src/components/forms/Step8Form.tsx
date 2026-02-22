import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Switch, Alert } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import FieldLabel from '../FieldLabel';
import { step8Schema } from '../../validation/schemas';

interface Step8FormProps {
  onSubmit: (data: any) => void;
  initialData?: any;
}

const Step8Form: React.FC<Step8FormProps> = ({ onSubmit, initialData }) => {
  const { t } = useTranslation();
  const { control, handleSubmit } = useForm({
    resolver: zodResolver(step8Schema),
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
      <Text style={styles.title}>{t('form.step8.title')}</Text>

      <Controller
        control={control}
        name="ntse"
        render={({ field: { onChange, value } }) => (
          <View style={styles.field}>
            <View style={styles.switchRow}>
              <View style={styles.switchLabel}>
                <FieldLabel
                  label={t('form.step8.ntse')}
                  helperText={t('form.step8.ntseHelp', '')}
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
          </View>
        )}
      />

      <Controller
        control={control}
        name="nmms"
        render={({ field: { onChange, value } }) => (
          <View style={styles.field}>
            <View style={styles.switchRow}>
              <View style={styles.switchLabel}>
                <FieldLabel
                  label={t('form.step8.nmms')}
                  helperText={t('form.step8.nmmsHelp', '')}
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
          </View>
        )}
      />

      <Controller
        control={control}
        name="uss"
        render={({ field: { onChange, value } }) => (
          <View style={styles.field}>
            <View style={styles.switchRow}>
              <View style={styles.switchLabel}>
                <FieldLabel
                  label={t('form.step8.uss')}
                  helperText={t('form.step8.ussHelp', '')}
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
          </View>
        )}
      />

      <Controller
        control={control}
        name="lss"
        render={({ field: { onChange, value } }) => (
          <View style={styles.field}>
            <View style={styles.switchRow}>
              <View style={styles.switchLabel}>
                <FieldLabel
                  label={t('form.step8.lss')}
                  helperText={t('form.step8.lssHelp', '')}
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
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  switchLabel: {
    flex: 1,
    paddingRight: 12,
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

export default Step8Form;
