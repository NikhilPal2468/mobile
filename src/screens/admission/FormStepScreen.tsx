import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useApplicationStore } from '../../store/applicationStore';
import { applicationAPI } from '../../services/api';
import AIChatButton from '../../components/AIChatButton';
import i18n from '../../i18n';

// Import step-specific components
import Step1Form from '../../components/forms/Step1Form';
import Step2Form from '../../components/forms/Step2Form';
import Step3Form from '../../components/forms/Step3Form';
import Step4Form from '../../components/forms/Step4Form';
import Step5Form from '../../components/forms/Step5Form';
import Step6Form from '../../components/forms/Step6Form';
import Step7Form from '../../components/forms/Step7Form';
import Step8Form from '../../components/forms/Step8Form';
import Step9Form from '../../components/forms/Step9Form';
import Step10Form from '../../components/forms/Step10Form';
import Step11Form from '../../components/forms/Step11Form';
import Step12Form from '../../components/forms/Step12Form';
import Step13Form from '../../components/forms/Step13Form';
import { getDisplayStep, routeToBackendStep } from '../../utils/stepUtils';

const FormStepScreen = () => {
  const { t } = useTranslation();
  const route = useRoute();
  const navigation = useNavigation();
  const { application, updateStepData, updateStep, setApplication } = useApplicationStore();
  const step = (route.params as any)?.step || 1;
  const displayStep = getDisplayStep(step);
  const [loading, setLoading] = useState(false);

  // When resuming, ensure we have application (and stepData) so forms get correct initialData
  useEffect(() => {
    if (application) return;
    let cancelled = false;
    (async () => {
      try {
        const res = await applicationAPI.get();
        if (!cancelled && res.data.application) {
          setApplication(res.data.application);
        }
      } catch {
        // ignore
      }
    })();
    return () => { cancelled = true; };
  }, [application, setApplication]);

  const handleSave = async (data: any) => {
    setLoading(true);
    try {
      const backendStep = routeToBackendStep(step);
      const res = await applicationAPI.saveStep(backendStep, data);
      updateStepData(data);
      if (res.data?.currentStep != null) {
        updateStep(res.data.currentStep);
      }
      Alert.alert(t('common.success'), 'Step saved successfully');
    } catch (error: any) {
      Alert.alert(t('common.error'), error.response?.data?.error || 'Failed to save');
    } finally {
      setLoading(false);
    }
  };

  const handlePrevious = () => {
    if (step > 1) {
      navigation.navigate('FormStep' as never, { step: step - 1 } as never);
    }
  };

  const toggleLanguage = () => {
    const currentLang = i18n.language;
    i18n.changeLanguage(currentLang === 'en' ? 'ml' : 'en');
  };

  const handleNext = async (data: any) => {
    // Route 12 = Preferences (final step before submit; submit handled in Step11Form)
    if (step === 12) {
      if (data.preferences) {
        try {
          setLoading(true);
          await applicationAPI.savePreferences(data.preferences);
          updateStepData(data);
          Alert.alert(t('common.success'), 'Preferences saved successfully');
        } catch (error: any) {
          Alert.alert(t('common.error'), error.message || 'Failed to save preferences');
        } finally {
          setLoading(false);
        }
      }
      return;
    }

    await handleSave(data);
    // Linear flow: 1→…→10→11 (Documents)→12 (Preferences)
    if (step < 12) {
      navigation.navigate('FormStep' as never, { step: step + 1 } as never);
    }
  };

  // Key so forms remount when application loads (resume) and get correct initialData
  const formKey = `${step}-${application?.id ?? 'none'}`;

  const renderStepForm = () => {
    switch (step) {
      case 1:
        return <Step1Form key={formKey} onSubmit={handleNext} initialData={application?.stepData} />;
      case 2:
        return <Step2Form key={formKey} onSubmit={handleNext} initialData={application?.stepData} />;
      case 3:
        return <Step3Form key={formKey} onSubmit={handleNext} initialData={application?.stepData} />;
      case 4:
        return <Step4Form key={formKey} onSubmit={handleNext} initialData={application?.stepData} />;
      case 5:
        return <Step5Form key={formKey} onSubmit={handleNext} initialData={application?.stepData} />;
      case 6:
        return <Step6Form key={formKey} onSubmit={handleNext} initialData={application?.stepData} />;
      case 7:
        return <Step7Form key={formKey} onSubmit={handleNext} initialData={application?.stepData} />;
      case 8:
        return <Step8Form key={formKey} onSubmit={handleNext} initialData={application?.stepData} />;
      case 9:
        return <Step9Form key={formKey} onSubmit={handleNext} initialData={application?.stepData} />;
      case 10:
        return <Step10Form key={formKey} onSubmit={handleNext} initialData={application?.stepData} />;
      case 11:
        return <Step12Form key={formKey} onSubmit={handleNext} initialData={application?.stepData} />;
      case 12:
        return (
          <Step11Form
            key={formKey}
            onSubmit={handleNext}
            initialData={application?.stepData}
            onSubmitSuccess={(app) => {
              setApplication(app);
              navigation.navigate('ApplicationView' as never);
            }}
          />
        );
      case 13:
        return <Step13Form key={formKey} onSubmit={handleNext} initialData={application?.stepData} />;
      default:
        return <Text>Step {step} form coming soon...</Text>;
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.content}>
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <Text style={styles.title}>
              {t('admission.step')} {displayStep} {t('admission.of')} 12
            </Text>
            <TouchableOpacity style={styles.languageButton} onPress={toggleLanguage}>
              <Text style={styles.languageText}>
                {i18n.language === 'en' ? 'മലയാളം' : 'English'}
              </Text>
            </TouchableOpacity>
          </View>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${(displayStep / 12) * 100}%` }]} />
          </View>
        </View>
        {renderStepForm()}
        <View style={styles.navigationButtons}>
          {step > 1 && (
            <TouchableOpacity style={styles.previousButton} onPress={handlePrevious}>
              <Text style={styles.previousButtonText}>{t('common.back')}</Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
      <AIChatButton currentStep={step} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    flex: 1,
  },
  header: {
    padding: 20,
    backgroundColor: '#fff',
    marginBottom: 10,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    flex: 1,
  },
  languageButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#F0F0F0',
    borderRadius: 6,
  },
  languageText: {
    fontSize: 12,
    color: '#007AFF',
    fontWeight: '600',
  },
  progressBar: {
    height: 4,
    backgroundColor: '#E5E5EA',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#007AFF',
    borderRadius: 2,
  },
  navigationButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    padding: 20,
    gap: 10,
  },
  previousButton: {
    backgroundColor: '#F0F0F0',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  previousButtonText: {
    color: '#007AFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default FormStepScreen;
