import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import { useTranslation } from 'react-i18next';
import { documentsAPI } from '../services/api';
import Icon from './Icon';

interface DocumentUploaderProps {
  type: string;
  label: string;
  onUploaded?: (documentId: string) => void;
  required?: boolean;
  helpText?: string;
}

const DocumentUploader: React.FC<DocumentUploaderProps> = ({
  type,
  label,
  onUploaded,
  required = false,
  helpText,
}) => {
  const { t } = useTranslation();
  const [uploading, setUploading] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<any>(null);

  const pickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['image/*', 'application/pdf'],
        copyToCacheDirectory: true,
      });

      if (result.canceled) {
        return;
      }

      const file = result.assets[0];
      
      // Validate file size (10MB max)
      if (file.size && file.size > 10 * 1024 * 1024) {
        Alert.alert(t('common.error'), 'File size must be less than 10MB');
        return;
      }

      setUploading(true);

      const filePayload = {
        uri: file.uri,
        name: file.name,
        type: file.mimeType || 'application/pdf',
      } as any;

      const response = await documentsAPI.upload(filePayload, type);
      setUploadedFile(response.data.document);
      
      if (onUploaded) {
        onUploaded(response.data.document.id);
      }

      Alert.alert(t('common.success'), 'Document uploaded successfully');
    } catch (error: any) {
      Alert.alert(t('common.error'), error.message || 'Failed to upload document');
    } finally {
      setUploading(false);
    }
  };

  const deleteDocument = async () => {
    if (!uploadedFile) return;

    Alert.alert(
      t('common.delete'),
      'Are you sure you want to delete this document?',
      [
        { text: t('common.cancel'), style: 'cancel' },
        {
          text: t('common.delete'),
          style: 'destructive',
          onPress: async () => {
            try {
              await documentsAPI.delete(uploadedFile.id);
              setUploadedFile(null);
            } catch (error: any) {
              Alert.alert(t('common.error'), 'Failed to delete document');
            }
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>
        {label} {required && <Text style={styles.required}>*</Text>}
      </Text>
      
      {uploadedFile ? (
        <View style={styles.uploadedContainer}>
          <Text style={styles.uploadedText}>{uploadedFile.fileName}</Text>
          <TouchableOpacity onPress={deleteDocument} style={styles.deleteButton}>
            <Icon name="close" size={16} color="#FF3B30" />
          </TouchableOpacity>
        </View>
      ) : (
        <TouchableOpacity
          style={styles.uploadButton}
          onPress={pickDocument}
          disabled={uploading}
        >
          {uploading ? (
            <ActivityIndicator color="#007AFF" />
          ) : (
            <>
              <Icon name="add" size={20} color="#007AFF" />
              <Text style={styles.uploadButtonText}>{t('form.step12.uploadDocument')}</Text>
            </>
          )}
        </TouchableOpacity>
      )}
      {helpText ? <Text style={styles.helpText}>{helpText}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 15,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },
  required: {
    color: '#FF3B30',
  },
  helpText: {
    fontSize: 12,
    color: '#666',
    marginTop: 6,
  },
  uploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#007AFF',
    borderStyle: 'dashed',
    borderRadius: 8,
    padding: 15,
    backgroundColor: '#f9f9f9',
  },
  uploadButtonText: {
    color: '#007AFF',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
  },
  uploadedContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#34C759',
    borderRadius: 8,
    padding: 12,
    backgroundColor: '#f0fdf4',
  },
  uploadedText: {
    flex: 1,
    fontSize: 14,
    color: '#333',
  },
  deleteButton: {
    padding: 5,
  },
});

export default DocumentUploader;
