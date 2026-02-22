import React, { useMemo, useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView, Switch, Alert, Platform, NativeModules } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import SelectModal from '../SelectModal';
import FieldLabel from '../FieldLabel';
import DateTimePicker from '@react-native-community/datetimepicker';
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

const CATEGORY_OPTIONS = [
  { label: 'General', value: 'General' },
  { label: 'OBC', value: 'OBC' },
  { label: 'SC', value: 'SC' },
  { label: 'ST', value: 'ST' },
];

const Step2Form: React.FC<Step2FormProps> = ({ onSubmit, initialData }) => {
  const { t } = useTranslation();
  const [genderModalVisible, setGenderModalVisible] = useState(false);
  const [categoryModalVisible, setCategoryModalVisible] = useState(false);
  const [dobPickerVisible, setDobPickerVisible] = useState(false);
  const { control, handleSubmit, setValue, formState: { errors } } = useForm({
    resolver: zodResolver(step2Schema),
    defaultValues: initialData || {},
  });

  const hasNativeDatePicker = useMemo(() => {
    // Different builds/platforms expose different module names. We gate rendering to avoid crashes.
    const nm: any = NativeModules || {};
    return Boolean(
      nm.RNCDatePicker ||
      nm.RNCDateTimePicker ||
      nm.RNDateTimePicker ||
      nm.RNDateTimePickerAndroid
    );
  }, []);

  const parseDate = (v: any): Date | null => {
    if (!v) return null;
    if (v instanceof Date && !Number.isNaN(v.getTime())) return v;
    if (typeof v === 'string') {
      const d = new Date(v);
      return Number.isNaN(d.getTime()) ? null : d;
    }
    return null;
  };

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
            <FieldLabel label={t('form.step2.name')} helperText={t('form.step2.nameHelp', '')} />
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
            <FieldLabel
              label={t('form.step2.aadhaarNumber')}
              helperText={t('form.step2.aadhaarNumberHelp', '')}
            />
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
            <FieldLabel label={t('form.step2.gender')} helperText={t('form.step2.genderHelp', '')} />
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
            <FieldLabel label={t('form.step2.category')} helperText={t('form.step2.categoryHelp', '')} />
            <TouchableOpacity
              style={styles.selectTouchable}
              onPress={() => setCategoryModalVisible(true)}
            >
              <Text style={value ? styles.selectText : styles.selectPlaceholder}>
                {value || t('form.step2.categoryPlaceholder', 'Select category')}
              </Text>
            </TouchableOpacity>
            <SelectModal
              visible={categoryModalVisible}
              onClose={() => setCategoryModalVisible(false)}
              label={t('form.step2.category')}
              options={CATEGORY_OPTIONS}
              selectedValue={value}
              onSelect={(selected) => {
                onChange(selected);
                setValue('categoryCode', selected as any, { shouldDirty: true, shouldValidate: true });
              }}
            />
          </View>
        )}
      />

      <Controller
        control={control}
        name="categoryCode"
        render={({ field: { value } }) => (
          <View style={styles.field}>
            <FieldLabel
              label={t('form.step2.categoryCode')}
              helperText={t('form.step2.categoryCodeHelp', '')}
            />
            <TextInput
              style={[styles.input, styles.inputDisabled]}
              value={value}
              placeholder={t('form.step2.categoryCode')}
              editable={false}
            />
          </View>
        )}
      />

      <Controller
        control={control}
        name="caste"
        render={({ field: { onChange, value } }) => (
          <View style={styles.field}>
            <FieldLabel label={t('form.step2.caste')} helperText={t('form.step2.casteHelp', '')} />
            <TextInput
              style={styles.input}
              value={value}
              onChangeText={onChange}
              placeholder={t('form.step2.caste')}
            />
          </View>
        )}
      />

      <Controller
        control={control}
        name="religion"
        render={({ field: { onChange, value } }) => (
          <View style={styles.field}>
            <FieldLabel
              label={t('form.step2.religion')}
              helperText={t('form.step2.religionHelp', '')}
            />
            <TextInput
              style={styles.input}
              value={value}
              onChangeText={onChange}
              placeholder={t('form.step2.religion')}
            />
          </View>
        )}
      />

      <Controller
        control={control}
        name="dateOfBirth"
        render={({ field: { onChange, value } }) => (
          <View style={styles.field}>
            <FieldLabel
              label={t('form.step2.dateOfBirth')}
              helperText={t('form.step2.dateOfBirthHelp', '')}
            />
            <TouchableOpacity
              style={styles.selectTouchable}
              onPress={() => {
                if (!hasNativeDatePicker) {
                  Alert.alert(
                    t('common.error', 'Error'),
                    'Date picker is not available in the current app build. Please rebuild the Android app (expo run:android) and try again.'
                  );
                  return;
                }
                setDobPickerVisible(true);
              }}
              activeOpacity={0.8}
            >
              <Text style={parseDate(value) ? styles.selectText : styles.selectPlaceholder}>
                {parseDate(value)
                  ? (parseDate(value) as Date).toLocaleDateString()
                  : t('form.step2.dateOfBirthPlaceholder', 'Select date')}
              </Text>
            </TouchableOpacity>
            {hasNativeDatePicker && dobPickerVisible && (
              <DateTimePicker
                value={parseDate(value) ?? new Date(2008, 0, 1)}
                mode="date"
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                maximumDate={new Date()}
                onChange={(_event, selectedDate) => {
                  if (Platform.OS !== 'ios') setDobPickerVisible(false);
                  if (selectedDate) {
                    onChange(selectedDate);
                  }
                }}
              />
            )}
            {hasNativeDatePicker && Platform.OS === 'ios' && dobPickerVisible && (
              <TouchableOpacity
                style={styles.inlineDone}
                onPress={() => setDobPickerVisible(false)}
              >
                <Text style={styles.inlineDoneText}>{t('common.done', 'Done')}</Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      />

      <Controller
        control={control}
        name="motherName"
        render={({ field: { onChange, value } }) => (
          <View style={styles.field}>
            <FieldLabel
              label={t('form.step2.motherName')}
              helperText={t('form.step2.motherNameHelp', '')}
            />
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
            <FieldLabel
              label={t('form.step2.fatherName')}
              helperText={t('form.step2.fatherNameHelp', '')}
            />
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
        name="guardianName"
        render={({ field: { onChange, value } }) => (
          <View style={styles.field}>
            <FieldLabel
              label={t('form.step2.guardianName')}
              helperText={t('form.step2.guardianNameHelp', '')}
            />
            <TextInput
              style={styles.input}
              value={value}
              onChangeText={onChange}
              placeholder={t('form.step2.guardianName')}
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
              <View style={styles.switchLabel}>
                <FieldLabel
                  label={t('form.step2.ewsEligible')}
                  helperText={t('form.step2.ewsEligibleHelp', '')}
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
  inputDisabled: {
    backgroundColor: '#F2F2F7',
    color: '#666',
  },
  inlineDone: {
    alignSelf: 'flex-end',
    marginTop: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#F0F0F0',
  },
  inlineDoneText: {
    color: '#007AFF',
    fontWeight: '600',
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

export default Step2Form;
