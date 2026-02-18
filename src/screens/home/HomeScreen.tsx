import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import { useApplicationStore } from '../../store/applicationStore';
import { applicationAPI } from '../../services/api';
import { backendStepToRoute } from '../../utils/stepUtils';

const HomeScreen = () => {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const { application, setApplication } = useApplicationStore();

  useEffect(() => {
    loadApplication();
  }, []);

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

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{t('home.welcome')}</Text>
      </View>

      {application && application.status === 'DRAFT' && (
        <TouchableOpacity
          style={styles.card}
          onPress={() => navigation.navigate('Admission' as never)}
        >
          <Text style={styles.cardTitle}>{t('home.resumeDraft')}</Text>
          <Text style={styles.cardText}>
            {t('admission.step')} {backendStepToRoute(application.currentStep)} {t('admission.of')} 12
          </Text>
        </TouchableOpacity>
      )}

      {!application && (
        <View style={styles.card}>
          <Text style={styles.cardText}>{t('home.noDraft')}</Text>
        </View>
      )}

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{t('home.recentUpdates')}</Text>
        {/* Add recent updates here */}
      </View>
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
  section: {
    padding: 15,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 10,
  },
});

export default HomeScreen;
