import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import { useApplicationStore } from '../../store/applicationStore';
import { pdfAPI } from '../../services/api';
import { backendStepToRoute } from '../../utils/stepUtils';
import PdfViewerModal, { arrayBufferToBase64 } from '../../components/PdfViewerModal';

const ApplicationViewScreen = () => {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const { application } = useApplicationStore();
  const [loading, setLoading] = useState(false);
  const [pdfModalVisible, setPdfModalVisible] = useState(false);
  const [pdfDataUrl, setPdfDataUrl] = useState<string | null>(null);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING':
        return '#FFA500';
      case 'VERIFIED':
        return '#34C759';
      case 'REJECTED':
        return '#FF3B30';
      case 'DRAFT':
        return '#8E8E93';
      default:
        return '#8E8E93';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'PENDING':
        return t('admission.statusPending');
      case 'VERIFIED':
        return t('admission.statusVerified');
      case 'REJECTED':
        return t('admission.statusRejected');
      case 'DRAFT':
        return t('admission.statusDraft');
      default:
        return status;
    }
  };

  const handleEdit = () => {
    if (application && (application.status === 'DRAFT' || application.status === 'PENDING')) {
      const routeStep = backendStepToRoute(application.currentStep);
      (navigation as any).navigate('FormStep', { step: routeStep });
    }
  };

  const handleViewPDF = async () => {
    if (loading || pdfModalVisible) return;
    try {
      setLoading(true);
      setPdfModalVisible(true);
      setPdfDataUrl(null);
      const response = await pdfAPI.get();
      const arrayBuffer = await response.arrayBuffer();
      const base64 = arrayBufferToBase64(arrayBuffer);
      if (base64) {
        setPdfDataUrl(`data:application/pdf;base64,${base64}`);
      } else {
        setPdfModalVisible(false);
        setTimeout(() => Alert.alert(t('common.error'), t('admission.pdfNotGeneratedYet')), 300);
      }
    } catch (error: any) {
      setPdfModalVisible(false);
      const is404 = error?.message?.toLowerCase?.().includes('not found') ?? false;
      const message = is404
        ? t('admission.pdfNotGeneratedYet')
        : (error.message || t('admission.pdfError'));
      setTimeout(() => Alert.alert(t('common.error'), message), 300);
    } finally {
      setLoading(false);
    }
  };

  const renderSection = (title: string, data: any, fields: string[], section?: string) => {
    if (!data) return null;
    const getLabel = (field: string) =>
      section ? t(`form.${section}.${field}`) : (t(`form.${field}`) || field);
    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{title}</Text>
        {fields.map((field) => {
          const value = data[field];
          if (value === null || value === undefined || value === '') return null;
          return (
            <View key={field} style={styles.fieldRow}>
              <Text style={styles.fieldLabel}>{getLabel(field)}:</Text>
              <Text style={styles.fieldValue}>
                {typeof value === 'boolean' ? (value ? 'Yes' : 'No') : String(value)}
              </Text>
            </View>
          );
        })}
      </View>
    );
  };

  const getExamNameDisplay = (data: any) => {
    if (!data) return '';
    if (data.examName === 'Others' && data.examNameOther?.trim()) return data.examNameOther.trim();
    return data.examName || '';
  };

  const renderStep1Section = (data: any) => {
    if (!data) return null;
    const step1Fields = [
      'examCode',
      'registerNumber',
      'passingMonth',
      'passingYear',
      'schoolCode',
      'schoolName',
    ];
    const examDisplay = getExamNameDisplay(data);
    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{t('form.step1.title')}</Text>
        {step1Fields.map((field) => {
          const value = data[field];
          if (value === null || value === undefined || value === '') return null;
          return (
            <View key={field} style={styles.fieldRow}>
              <Text style={styles.fieldLabel}>{t(`form.step1.${field}`)}:</Text>
              <Text style={styles.fieldValue}>{String(value)}</Text>
            </View>
          );
        })}
        {examDisplay ? (
          <View style={styles.fieldRow}>
            <Text style={styles.fieldLabel}>{t('form.step1.examName')}:</Text>
            <Text style={styles.fieldValue}>{examDisplay}</Text>
          </View>
        ) : null}
      </View>
    );
  };

  const renderStep9Section = (data: any) => {
    if (!data) return null;
    const hasClubs = Array.isArray(data.clubs) && data.clubs.length > 0;
    const step9GradeFields = [
      'scienceFairGrade',
      'mathsFairGrade',
      'itFairGrade',
      'workExperienceGrade',
    ];
    const hasGrades = step9GradeFields.some((f) => data[f] != null && data[f] !== '');
    if (!hasClubs && !hasGrades) return null;
    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{t('form.step9.title')}</Text>
        {hasClubs && (
          <View style={styles.fieldRow}>
            <Text style={styles.fieldLabel}>{t('form.step9.clubs')}:</Text>
            <Text style={styles.fieldValue}>
              {data.clubs.join(', ')}
            </Text>
          </View>
        )}
        {step9GradeFields.map((field) => {
          const value = data[field];
          if (value === null || value === undefined || value === '') return null;
          return (
            <View key={field} style={styles.fieldRow}>
              <Text style={styles.fieldLabel}>{t(`form.step9.${field}`)}:</Text>
              <Text style={styles.fieldValue}>{String(value)}</Text>
            </View>
          );
        })}
      </View>
    );
  };

  if (!application) {
    return (
      <View style={styles.container}>
        <Text style={styles.noDataText}>{t('admission.noApplicationData')}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView style={styles.content}>
        <View style={styles.header}>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(application.status) }]}>
            <Text style={styles.statusBadgeText}>{getStatusText(application.status)}</Text>
          </View>
          {application.id && (
            <Text style={styles.applicationId}>
              {t('admission.applicationId')}: {application.id.substring(0, 8)}...
            </Text>
          )}
        </View>

        {application.stepData && (
          <>
            {renderStep1Section(application.stepData)}
            {renderSection(
              t('form.step2.title'),
              application.stepData,
              ['applicantName', 'aadhaarNumber', 'gender', 'category', 'dateOfBirth', 'motherName', 'fatherName'],
              'step2'
            )}
            {renderSection(
              t('form.step4.title'),
              application.stepData,
              ['nativeState', 'nativeDistrict', 'permanentAddress', 'phone', 'email'],
              'step4'
            )}
            {renderStep9Section(application.stepData)}
          </>
        )}

        {application.preferences && application.preferences.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t('form.step11.title')}</Text>
            {application.preferences.map((pref: any, index: number) => (
              <View key={index} style={styles.preferenceRow}>
                <Text style={styles.preferenceNumber}>Preference {pref.preferenceNumber}</Text>
                <Text style={styles.preferenceDetails}>
                  School: {pref.schoolCode} | Combination: {pref.combinationCode}
                </Text>
              </View>
            ))}
          </View>
        )}

        {application.documents && application.documents.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t('admission.documents')}</Text>
            {application.documents.map((doc: any) => (
              <View key={doc.id} style={styles.documentRow}>
                <Text style={styles.documentName}>{doc.type}</Text>
                <Text style={styles.documentDate}>
                  {new Date(doc.uploadedAt).toLocaleDateString()}
                </Text>
              </View>
            ))}
          </View>
        )}

        <View style={styles.actions}>
          {(application.status === 'DRAFT' || application.status === 'PENDING') && (
            <TouchableOpacity style={styles.editButton} onPress={handleEdit}>
              <Text style={styles.editButtonText}>{t('admission.editApplication')}</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity style={styles.pdfButton} onPress={handleViewPDF} disabled={loading}>
            <Text style={styles.pdfButtonText}>
              {loading ? t('common.loading') : t('admission.viewPDF')}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      <PdfViewerModal
        visible={pdfModalVisible}
        onClose={() => setPdfModalVisible(false)}
        dataUrl={pdfDataUrl}
        loading={loading && !pdfDataUrl}
      />
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
    backgroundColor: '#fff',
    padding: 20,
    marginBottom: 10,
    alignItems: 'center',
  },
  statusBadge: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
    marginBottom: 10,
  },
  statusBadgeText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  applicationId: {
    fontSize: 12,
    color: '#666',
  },
  section: {
    backgroundColor: '#fff',
    padding: 20,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#000',
  },
  fieldRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  fieldLabel: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
    flex: 1,
  },
  fieldValue: {
    fontSize: 14,
    color: '#000',
    fontWeight: '600',
    flex: 1,
    textAlign: 'right',
  },
  preferenceRow: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  preferenceNumber: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
    marginBottom: 4,
  },
  preferenceDetails: {
    fontSize: 12,
    color: '#666',
  },
  documentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  documentName: {
    fontSize: 14,
    color: '#000',
    fontWeight: '500',
  },
  documentDate: {
    fontSize: 12,
    color: '#666',
  },
  actions: {
    padding: 20,
    gap: 10,
  },
  editButton: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  editButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  pdfButton: {
    backgroundColor: '#F0F0F0',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  pdfButtonText: {
    color: '#007AFF',
    fontSize: 16,
    fontWeight: '600',
  },
  noDataText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 50,
  },
});

export default ApplicationViewScreen;
