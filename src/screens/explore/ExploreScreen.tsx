import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';
import { exploreAPI } from '../../services/api';
import { getYouTubeVideoId } from '../../utils/youtube';
import YouTubeEmbedModal from '../../components/YouTubeEmbedModal';
import ExploreDetailModal, { ExploreContentItem } from '../../components/ExploreDetailModal';
import i18n from '../../i18n';

function getDisplayTitle(item: any): string {
  const lang = i18n.language;
  const isMl = lang === 'ml' || (typeof lang === 'string' && lang.startsWith('ml'));
  if (isMl && item.titleMl?.trim()) return item.titleMl;
  return item.titleEn || '';
}

type SelectedVideo = { videoId: string | null; title: string; videoUrl: string } | null;

const ExploreScreen = () => {
  const { t } = useTranslation();
  const [content, setContent] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedVideo, setSelectedVideo] = useState<SelectedVideo>(null);
  const [selectedBlog, setSelectedBlog] = useState<ExploreContentItem | null>(null);

  useEffect(() => {
    loadContent();
  }, []);

  const loadContent = async () => {
    try {
      const response = await exploreAPI.get();
      setContent(response.data.content || []);
    } catch (error) {
      console.error('Failed to load content:', error);
    } finally {
      setLoading(false);
    }
  };

  const onVideoCardPress = (item: any) => {
    if (item.type !== 'VIDEO' || !item.videoUrl) return;
    const videoId = getYouTubeVideoId(item.videoUrl);
    setSelectedVideo({
      videoId,
      title: item.titleEn || '',
      videoUrl: item.videoUrl,
    });
  };

  const onBlogCardPress = (item: any) => {
    if (item.type !== 'BLOG') return;
    setSelectedBlog(item as ExploreContentItem);
  };

  const onCardPress = (item: any) => {
    if (item.type === 'VIDEO') onVideoCardPress(item);
    else if (item.type === 'BLOG') onBlogCardPress(item);
  };

  const toggleLanguage = () => {
    const current = i18n.language;
    i18n.changeLanguage(current === 'en' ? 'ml' : 'en');
  };

  return (
    <>
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>{t('explore.title')}</Text>
          <TouchableOpacity style={styles.languageButton} onPress={toggleLanguage}>
            <Text style={styles.languageText}>
              {i18n.language === 'en' ? 'മലയാളം' : 'English'}
            </Text>
          </TouchableOpacity>
        </View>

        {content.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={styles.card}
            onPress={() => onCardPress(item)}
            activeOpacity={0.7}
          >
            {item.category ? (
              <Text style={styles.categoryLabel}>{item.category}</Text>
            ) : null}
            <Text style={styles.cardTitle}>{getDisplayTitle(item)}</Text>
            {item.type === 'VIDEO' && item.videoUrl && (
              <Text style={styles.videoLabel}>{t('explore.watchVideo')}</Text>
            )}
          </TouchableOpacity>
        ))}
      </ScrollView>
      <YouTubeEmbedModal
        visible={!!selectedVideo}
        onClose={() => setSelectedVideo(null)}
        videoId={selectedVideo?.videoId ?? null}
        videoUrl={selectedVideo?.videoUrl}
        title={selectedVideo?.title}
      />
      <ExploreDetailModal
        visible={!!selectedBlog}
        onClose={() => setSelectedBlog(null)}
        item={selectedBlog}
        language={i18n.language}
      />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
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
  categoryLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  videoLabel: {
    marginTop: 5,
    color: '#007AFF',
    fontSize: 14,
  },
});

export default ExploreScreen;
