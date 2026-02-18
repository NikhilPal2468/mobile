import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import DocumentUploader from '../DocumentUploader';
import { step12Schema } from '../../validation/schemas';
import { DOCUMENT_RULES } from '../../config/documentRules';

interface Step12FormProps {
  onSubmit: (data: any) => void;
  initialData?: any;
}

const Step12Form: React.FC<Step12FormProps> = ({ onSubmit, initialData }) => {
  const { t } = useTranslation();
  const { handleSubmit } = useForm({
    resolver: zodResolver(step12Schema),
    defaultValues: initialData || {},
  });
  const onNext = handleSubmit(
    (data) => onSubmit(data),
    (err) => {
      const firstMessage = Object.values(err).map((e: any) => e?.message).filter(Boolean)[0];
      if (firstMessage) Alert.alert(t('common.error', 'Error'), firstMessage);
    }
  );

  const stepData = initialData || {};

  return (
    <ScrollView style={styles.scrollView}>
      <View style={styles.container}>
        <Text style={styles.title}>{t('form.step12.title')}</Text>

        {DOCUMENT_RULES.map((rule) => {
          const required = rule.alwaysRequired || rule.isRequired(stepData);
          const helpTextKey = rule.getHelpTextKey(stepData);
          const helpText = helpTextKey ? t(helpTextKey) : undefined;
          return (
            <DocumentUploader
              key={rule.type}
              type={rule.type}
              label={t(rule.labelKey)}
              required={required}
              helpText={helpText}
            />
          );
        })}

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

export default Step12Form;
