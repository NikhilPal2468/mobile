import React from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native';

export interface SelectOption<T = string> {
  label: string;
  value: T;
}

interface SelectModalProps<T = string> {
  visible: boolean;
  onClose: () => void;
  options: SelectOption<T>[];
  selectedValue: T | undefined;
  onSelect: (value: T) => void;
  label?: string;
  placeholder?: string;
}

function SelectModal<T = string>({
  visible,
  onClose,
  options,
  selectedValue,
  onSelect,
  label,
  placeholder = 'Select',
}: SelectModalProps<T>) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <TouchableOpacity
        style={styles.overlay}
        activeOpacity={1}
        onPress={onClose}
      >
        <View style={styles.content} onStartShouldSetResponder={() => true}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>{label || placeholder}</Text>
            <TouchableOpacity onPress={onClose} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
          <ScrollView style={styles.list}>
            {options.map((opt) => (
              <TouchableOpacity
                key={String(opt.value)}
                style={[
                  styles.option,
                  selectedValue === opt.value && styles.optionSelected,
                ]}
                onPress={() => {
                  onSelect(opt.value);
                  onClose();
                }}
              >
                <Text
                  style={[
                    styles.optionText,
                    selectedValue === opt.value && styles.optionTextSelected,
                  ]}
                >
                  {opt.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </TouchableOpacity>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  content: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    maxHeight: '70%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#000',
  },
  cancelText: {
    fontSize: 17,
    color: '#007AFF',
  },
  list: {
    maxHeight: 320,
  },
  option: {
    padding: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E5E5EA',
  },
  optionSelected: {
    backgroundColor: '#E8F4FF',
  },
  optionText: {
    fontSize: 17,
    color: '#000',
  },
  optionTextSelected: {
    fontWeight: '600',
    color: '#007AFF',
  },
});

export default SelectModal;
