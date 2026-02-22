import React from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Switch, Alert } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import FieldLabel from '../FieldLabel';
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
              <View style={styles.switchLabel}>
                <FieldLabel
                  label={t('form.step3.oec')}
                  helperText={t('form.step3.oecHelp', '')}
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
        name="linguisticMinority"
        render={({ field: { onChange, value } }) => (
          <View style={styles.field}>
            <View style={styles.switchRow}>
              <View style={styles.switchLabel}>
                <FieldLabel
                  label={t('form.step3.linguisticMinority')}
                  helperText={t('form.step3.linguisticMinorityHelp', '')}
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
        name="linguisticLanguage"
        render={({ field: { onChange, value } }) => (
          <View style={styles.field}>
            <FieldLabel
              label={t('form.step3.linguisticLanguage')}
              helperText={t('form.step3.linguisticLanguageHelp', '')}
            />
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
        name="differentlyAbledTypes"
        render={({ field: { onChange, value } }) => {
          const selected: string[] = Array.isArray(value) ? value : [];
          const toggle = (id: string) => {
            if (selected.includes(id)) {
              onChange(selected.filter((x) => x !== id));
            } else {
              onChange([...selected, id]);
            }
          };

          const options = [
            { id: 'OrthopaedicallyChallenged', label: t('form.step3.disability.orthopaedic') },
            { id: 'Blind', label: t('form.step3.disability.blind') },
            { id: 'Deaf', label: t('form.step3.disability.deaf') },
            { id: 'MentalBrainDiseases', label: t('form.step3.disability.mental') },
          ];

          return (
            <View style={styles.field}>
              <FieldLabel
                label={t('form.step3.differentlyAbled')}
                helperText={t('form.step3.differentlyAbledHelp', '')}
              />
              {options.map((opt) => {
                const isOn = selected.includes(opt.id);
                return (
                  <TouchableOpacity
                    key={opt.id}
                    style={[styles.checkRow, isOn && styles.checkRowSelected]}
                    onPress={() => toggle(opt.id)}
                    activeOpacity={0.8}
                  >
                    <View style={[styles.checkbox, isOn && styles.checkboxSelected]}>
                      <Text style={[styles.checkboxTick, isOn && styles.checkboxTickSelected]}>
                        {isOn ? '✓' : ''}
                      </Text>
                    </View>
                    <Text style={styles.checkLabel}>{opt.label}</Text>
                  </TouchableOpacity>
                );
              })}

              {selected.length > 0 && (
                <Controller
                  control={control}
                  name="differentlyAbledPercentage"
                  render={({ field: { onChange, value } }) => (
                    <View style={[styles.field, { marginTop: 10 }]}>
                      <FieldLabel
                        label={t('form.step3.differentlyAbledPercentage')}
                        helperText={t('form.step3.differentlyAbledPercentageHelp', '')}
                      />
                      <TextInput
                        style={[styles.input, errors.differentlyAbledPercentage && styles.inputError]}
                        value={value?.toString() || ''}
                        onChangeText={(text) => {
                          const cleaned = text.replace(/[^0-9.]/g, '');
                          const num = cleaned ? parseFloat(cleaned) : null;
                          onChange(num == null || Number.isNaN(num) ? null : num);
                        }}
                        placeholder="0-100"
                        keyboardType="numeric"
                      />
                      {errors.differentlyAbledPercentage && (
                        <Text style={styles.errorText}>
                          {errors.differentlyAbledPercentage.message as string}
                        </Text>
                      )}
                    </View>
                  )}
                />
              )}
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
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  switchLabel: {
    flex: 1,
    paddingRight: 12,
  },
  checkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#E5E5EA',
    borderRadius: 10,
    marginTop: 8,
    backgroundColor: '#fff',
  },
  checkRowSelected: {
    borderColor: '#007AFF',
    backgroundColor: '#F2F8FF',
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#C7C7CC',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
    backgroundColor: '#fff',
  },
  checkboxSelected: {
    borderColor: '#007AFF',
    backgroundColor: '#007AFF',
  },
  checkboxTick: {
    fontSize: 14,
    color: '#fff',
    lineHeight: 16,
  },
  checkboxTickSelected: {
    color: '#fff',
    fontWeight: '700',
  },
  checkLabel: {
    fontSize: 14,
    color: '#333',
    flex: 1,
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

export default Step3Form;
