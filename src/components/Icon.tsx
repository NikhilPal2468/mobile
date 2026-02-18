import React from 'react';
import { Text, StyleSheet } from 'react-native';

interface IconProps {
  name: string;
  size?: number;
  color?: string;
}

// Simple icon component using emoji/unicode as fallback
const iconMap: { [key: string]: string } = {
  home: '🏠',
  school: '🏫',
  explore: '🔍',
  person: '👤',
  chat: '💬',
  send: '📤',
  close: '✕',
  add: '+',
};

const Icon: React.FC<IconProps> = ({ name, size = 24, color = '#000' }) => {
  const icon = iconMap[name] || '•';
  
  return (
    <Text style={[styles.icon, { fontSize: size, color }]}>
      {icon}
    </Text>
  );
};

const styles = StyleSheet.create({
  icon: {
    textAlign: 'center',
  },
});

export default Icon;
