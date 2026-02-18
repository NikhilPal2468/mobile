import React, { useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
// Signature canvas requires development build - conditionally import
let SignatureCanvasLib: any = null;
try {
  SignatureCanvasLib = require('react-native-signature-canvas').default;
} catch (e) {
  console.warn('Signature canvas not available in Expo Go. Development build required.');
}
import { useTranslation } from 'react-i18next';

interface SignatureCanvasProps {
  onSave: (signatureUri: string) => void;
  label: string;
}

const SignatureCanvasComponent: React.FC<SignatureCanvasProps> = ({ onSave, label }) => {
  const { t } = useTranslation();
  const signatureRef = useRef<any>(null);

  const handleOK = (signature: string) => {
    onSave(signature);
  };

  const handleClear = () => {
    signatureRef.current?.clearSignature();
  };

  const handleConfirm = () => {
    signatureRef.current?.readSignature();
  };

  const style = `
    body,html {
      width: 100%;
      height: 100%;
      margin: 0;
      padding: 0;
    }
    .m-signature-pad {
      position: absolute;
      font-size: 10px;
      width: 100%;
      height: 100%;
      border: 1px solid #ddd;
      background-color: #fff;
      box-shadow: 0 1px 4px rgba(0, 0, 0, 0.27), 0 0 40px rgba(0, 0, 0, 0.08) inset;
      border-radius: 4px;
    }
  `;

  if (!SignatureCanvasLib) {
    return (
      <View style={styles.container}>
        <Text style={styles.label}>{label}</Text>
        <View style={[styles.canvasContainer, styles.placeholder]}>
          <Text style={styles.placeholderText}>
            Signature canvas requires a development build.{'\n'}
            Run: npx expo run:ios
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.canvasContainer}>
        <SignatureCanvasLib
          ref={signatureRef}
          onOK={handleOK}
          descriptionText={t('form.step13.drawSignature')}
          clearText={t('common.clear')}
          confirmText={t('common.save')}
          webStyle={style}
          autoClear={false}
        />
      </View>
      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.clearButton} onPress={handleClear}>
          <Text style={styles.clearButtonText}>{t('common.clear')}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.confirmButton} onPress={handleConfirm}>
          <Text style={styles.confirmButtonText}>{t('common.save')}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 10,
    color: '#333',
  },
  canvasContainer: {
    height: 200,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#fff',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  clearButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
    marginRight: 5,
  },
  clearButtonText: {
    color: '#333',
    fontSize: 14,
    fontWeight: '600',
  },
  confirmButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#007AFF',
    alignItems: 'center',
    marginLeft: 5,
  },
  confirmButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  placeholder: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  placeholderText: {
    color: '#666',
    fontSize: 12,
    textAlign: 'center',
  },
});

export default SignatureCanvasComponent;
