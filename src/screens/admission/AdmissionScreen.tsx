import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import { useApplicationStore } from '../../store/applicationStore';
import { useAuthStore } from '../../store/authStore';
import { applicationAPI } from '../../services/api';
import { backendStepToRoute } from '../../utils/stepUtils';

const AdmissionScreen = () => {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const { application, setApplication } = useApplicationStore();
  const { user } = useAuthStore();

  useEffect(() => {
    loadApplication();
  }, [user?.id]); // Reload when user changes

  const loadApplication = async () => {
    try {
      const response = await applicationAPI.get();
      if (response.data.application) {
        setApplication(response.data.application);
      }
    } catch (error) {
      console.error('Failed to load application:', error);
    }
  };

  const handleResume = () => {
    if (application) {
      const routeStep = backendStepToRoute(application.currentStep);
      navigation.navigate('FormStep' as never, { step: routeStep } as never);
    } else {
      navigation.navigate('FormStep' as never, { step: 1 } as never);
    }
  };

  const handleViewApplication = () => {
    navigation.navigate('ApplicationView' as never);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{t('admission.title')}</Text>
      </View>

      {!application ? (
        <TouchableOpacity
          style={styles.card}
          onPress={handleResume}
          activeOpacity={0.8}
        >
          <Text style={styles.cardTitle}>{t('admission.noApplication')}</Text>
          <Text style={styles.cardText}>{t('admission.tapToStart')}</Text>
        </TouchableOpacity>
      ) : application.status === 'DRAFT' ? (
        <TouchableOpacity
          style={styles.card}
          onPress={handleResume}
        >
          <Text style={styles.cardTitle}>{t('admission.resumeApplication')}</Text>
          <Text style={styles.cardText}>
            {t('admission.step')} {backendStepToRoute(application.currentStep)} {t('admission.of')} 12
          </Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          style={styles.card}
          onPress={handleViewApplication}
        >
          <Text style={styles.cardTitle}>{t('admission.applicationSubmitted')}</Text>
          <Text style={styles.cardText}>
            {application.stepData?.applicantName || t('admission.viewApplication')}
          </Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  card: {
    backgroundColor: '#fff',
    margin: 15,
    padding: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 5,
  },
  cardText: {
    fontSize: 14,
    color: '#666',
  },
});

export default AdmissionScreen;
