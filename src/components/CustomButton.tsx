import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { COLORS } from '../constants/colors';

interface CustomButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary'; // 'primary' = Green, 'secondary' = Light
}

const CustomButton: React.FC<CustomButtonProps> = ({ title, onPress, variant = 'primary' }) => {
  return (
    <TouchableOpacity
      style={[styles.container, variant === 'secondary' && styles.secondaryContainer]}
      onPress={onPress}
    >
      <Text style={[styles.text, variant === 'secondary' && styles.secondaryText]}>
        {title}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.primary,
    width: '100%',
    paddingVertical: 15,
    borderRadius: 30, // Rounded corners
    alignItems: 'center',
    marginBottom: 15,
  },
  secondaryContainer: {
    backgroundColor: '#E8FDF5', // Very light green background
  },
  text: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
  secondaryText: {
    color: COLORS.primary, // Green text
  },
});

export default CustomButton;