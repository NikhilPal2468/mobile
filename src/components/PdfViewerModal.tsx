import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, Modal, ActivityIndicator } from 'react-native';
import { useTranslation } from 'react-i18next';
import * as FileSystem from 'expo-file-system';
import Pdf from 'react-native-pdf';

interface PdfViewerModalProps {
  visible: boolean;
  onClose: () => void;
  /** Data URL for the PDF, e.g. 'data:application/pdf;base64,...' */
  dataUrl: string | null;
  loading?: boolean;
}

const BASE64_ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';

/**
 * Pure JS base64 encode (for environments like React Native where btoa is undefined).
 */
function base64EncodeBytes(bytes: Uint8Array): string {
  let result = '';
  for (let i = 0; i < bytes.length; i += 3) {
    const a = bytes[i] ?? 0;
    const b = i + 1 < bytes.length ? bytes[i + 1]! : 0;
    const c = i + 2 < bytes.length ? bytes[i + 2]! : 0;
    result += BASE64_ALPHABET[a >> 2];
    result += BASE64_ALPHABET[((a & 3) << 4) | (b >> 4)];
    result += i + 1 < bytes.length ? BASE64_ALPHABET[((b & 15) << 2) | (c >> 6)] : '=';
    result += i + 2 < bytes.length ? BASE64_ALPHABET[c & 63] : '=';
  }
  return result;
}

/**
 * Converts ArrayBuffer to base64 string. Uses btoa when available (e.g. web),
 * otherwise a pure JS implementation for React Native.
 */
export function arrayBufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  const btoaFn = typeof global !== 'undefined' && (global as any).btoa;
  if (btoaFn) {
    let binary = '';
    const chunkSize = 8192;
    for (let i = 0; i < bytes.length; i += chunkSize) {
      const chunk = bytes.subarray(i, i + chunkSize);
      binary += String.fromCharCode.apply(null, chunk as unknown as number[]);
    }
    return btoaFn(binary);
  }
  return base64EncodeBytes(bytes);
}

/** Use native PDF viewer (react-native-pdf) with a temp file to avoid WebView parentNode crash on iOS. */
const PdfViewerModal: React.FC<PdfViewerModalProps> = ({
  visible,
  onClose,
  dataUrl,
  loading = false,
}) => {
  const { t } = useTranslation();
  const [fileUri, setFileUri] = useState<string | null>(null);
  const [writeError, setWriteError] = useState(false);
  const currentPathRef = useRef<string | null>(null);

  useEffect(() => {
    if (!dataUrl || !visible) {
      setFileUri(null);
      setWriteError(false);
      const toDelete = currentPathRef.current;
      currentPathRef.current = null;
      if (toDelete) FileSystem.deleteAsync(toDelete, { idempotent: true }).catch(() => {});
      return;
    }
    const prefix = 'data:application/pdf;base64,';
    const base64 = dataUrl.startsWith(prefix) ? dataUrl.slice(prefix.length) : dataUrl;
    const path = (FileSystem.cacheDirectory ?? '') + `preview-${Date.now()}.pdf`;
    let cancelled = false;
    (async () => {
      try {
        await FileSystem.writeAsStringAsync(path, base64, {
          encoding: FileSystem.EncodingType.Base64,
        });
        if (!cancelled) {
          currentPathRef.current = path;
          setFileUri(path);
          setWriteError(false);
        } else {
          FileSystem.deleteAsync(path, { idempotent: true }).catch(() => {});
        }
      } catch {
        if (!cancelled) {
          setFileUri(null);
          setWriteError(true);
        }
      }
    })();
    return () => {
      cancelled = true;
      const toDelete = currentPathRef.current;
      currentPathRef.current = null;
      if (toDelete) FileSystem.deleteAsync(toDelete, { idempotent: true }).catch(() => {});
    };
  }, [dataUrl, visible]);

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
        {loading || (dataUrl && !fileUri && !writeError) ? (
          <View style={styles.centered}>
            <ActivityIndicator size="large" color="#007AFF" />
            <Text style={styles.loadingText}>{t('common.loading')}</Text>
          </View>
        ) : fileUri ? (
          <Pdf
            source={{ uri: fileUri }}
            style={styles.pdfView}
            trustAllCerts={false}
            onError={(e) => console.warn('PDF render error', e)}
          />
        ) : (
          <View style={styles.centered}>
            <Text style={styles.errorText}>{t('admission.pdfNotAvailable')}</Text>
            <Text style={styles.errorHint}>{t('admission.pdfNotAvailableHint')}</Text>
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
    justifyContent: 'flex-end',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  closeButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  closeButtonText: {
    fontSize: 17,
    color: '#007AFF',
    fontWeight: '600',
  },
  pdfView: {
    flex: 1,
    backgroundColor: '#fff',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666',
  },
  errorText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  errorHint: {
    marginTop: 8,
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
  },
});

export default PdfViewerModal;
