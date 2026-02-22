import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ViewStyle, TextStyle } from 'react-native';
import InfoModal from './InfoModal';

interface FieldLabelProps {
  label: string;
  helperText?: string;
  infoTitle?: string;
  infoBody?: string;
  containerStyle?: ViewStyle;
  labelStyle?: TextStyle;
}

function nonEmpty(s?: string) {
  return typeof s === 'string' && s.trim().length > 0;
}

export default function FieldLabel({
  label,
  helperText,
  infoTitle,
  infoBody,
  containerStyle,
  labelStyle,
}: FieldLabelProps) {
  const [open, setOpen] = useState(false);

  const showInfo = useMemo(() => nonEmpty(infoTitle) && nonEmpty(infoBody), [infoTitle, infoBody]);
  const showHelper = useMemo(() => nonEmpty(helperText), [helperText]);

  return (
    <View style={[styles.container, containerStyle]}>
      <View style={styles.topRow}>
        <Text style={[styles.label, labelStyle]}>{label}</Text>
        {showInfo && (
          <>
            <TouchableOpacity
              style={styles.infoButton}
              onPress={() => setOpen(true)}
              accessibilityRole="button"
              accessibilityLabel={`${label} info`}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Text style={styles.infoText}>i</Text>
            </TouchableOpacity>
            <InfoModal
              visible={open}
              title={String(infoTitle)}
              body={String(infoBody)}
              onClose={() => setOpen(false)}
            />
          </>
        )}
      </View>
      {showHelper ? <Text style={styles.helper}>{helperText}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 6,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
  },
  label: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  helper: {
    marginTop: 3,
    fontSize: 12,
    color: '#666',
  },
  infoButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#007AFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#007AFF',
    lineHeight: 14,
  },
});

