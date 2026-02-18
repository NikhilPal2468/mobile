import React from 'react';
import { View, StyleSheet, TouchableOpacity, Text, Modal, ScrollView } from 'react-native';
import { useTranslation } from 'react-i18next';

export interface ExploreContentItem {
  id: string;
  type: string;
  titleEn: string;
  titleMl?: string | null;
  contentEn: string;
  contentMl?: string | null;
  category?: string | null;
}

interface ExploreDetailModalProps {
  visible: boolean;
  onClose: () => void;
  item: ExploreContentItem | null;
  /** Current app language (e.g. from i18n.language); 'ml' shows ML fields */
  language: string;
}

const ExploreDetailModal: React.FC<ExploreDetailModalProps> = ({
  visible,
  onClose,
  item,
  language,
}) => {
  const { t } = useTranslation();

  if (!item) return null;

  const isMl = language === 'ml' || language.startsWith('ml');
  const title = isMl && item.titleMl?.trim() ? item.titleMl : item.titleEn;
  const content = isMl && item.contentMl?.trim() ? item.contentMl : item.contentEn;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Text style={styles.closeButtonText}>{t('common.close')}</Text>
          </TouchableOpacity>
        </View>
        <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
          <Text style={styles.title}>{title}</Text>
          {item.category ? (
            <Text style={styles.category}>{item.category}</Text>
          ) : null}
          <Text style={styles.body}>{content}</Text>
        </ScrollView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  closeButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  closeButtonText: {
    fontSize: 16,
    color: '#007AFF',
    fontWeight: '600',
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 8,
    color: '#111',
  },
  category: {
    fontSize: 13,
    color: '#666',
    marginBottom: 16,
  },
  body: {
    fontSize: 16,
    lineHeight: 24,
    color: '#333',
  },
});

export default ExploreDetailModal;
