import React from 'react';
import { View, StyleSheet, TouchableOpacity, Text, Modal, Linking, Dimensions } from 'react-native';
import { WebView } from 'react-native-webview';
import { useTranslation } from 'react-i18next';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const EMBED_HEIGHT = Math.round((SCREEN_WIDTH * 9) / 16);

interface YouTubeEmbedModalProps {
  visible: boolean;
  onClose: () => void;
  videoId: string | null;
  /** Original URL; used for "Open in browser" when videoId is null */
  videoUrl?: string | null;
  title?: string;
}

const YouTubeEmbedModal: React.FC<YouTubeEmbedModalProps> = ({
  visible,
  onClose,
  videoId,
  videoUrl,
  title,
}) => {
  const { t } = useTranslation();

  const htmlSource = videoId
    ? {
        html: `<!DOCTYPE html>
<html>
<head>
  <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">
  <style>*{margin:0;padding:0;} html,body{width:100%;height:100%;} iframe{position:absolute;left:0;top:0;width:100%;height:100%;}</style>
</head>
<body>
  <iframe
    src="https://www.youtube.com/embed/${videoId}?playsinline=1"
    frameborder="0"
    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
    allowfullscreen
  ></iframe>
</body>
</html>`,
        baseUrl: 'https://www.youtube.com',
      }
    : null;

  const openInBrowser = () => {
    if (videoUrl) {
      Linking.openURL(videoUrl);
    }
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          {title ? (
            <Text style={styles.titleText} numberOfLines={1}>
              {title}
            </Text>
          ) : null}
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Text style={styles.closeButtonText}>{t('common.close')}</Text>
          </TouchableOpacity>
        </View>
        {htmlSource ? (
          <View style={styles.embedContainer}>
            <WebView
              source={htmlSource}
              style={styles.webView}
              allowsInlineMediaPlayback
              mediaPlaybackRequiresUserAction={false}
              scrollEnabled={false}
              originWhitelist={['*']}
            />
          </View>
        ) : (
          <View style={styles.fallback}>
            <Text style={styles.fallbackText}>{t('explore.openInBrowser')}</Text>
            <TouchableOpacity style={styles.browserButton} onPress={openInBrowser}>
              <Text style={styles.browserButtonText}>{t('explore.openInBrowser')}</Text>
            </TouchableOpacity>
          </View>
        )}
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
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  titleText: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    marginRight: 8,
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
  embedContainer: {
    width: '100%',
    height: EMBED_HEIGHT,
    backgroundColor: '#000',
  },
  webView: {
    flex: 1,
    width: '100%',
    height: EMBED_HEIGHT,
  },
  fallback: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  fallbackText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
  },
  browserButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    backgroundColor: '#007AFF',
    borderRadius: 8,
  },
  browserButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default YouTubeEmbedModal;
