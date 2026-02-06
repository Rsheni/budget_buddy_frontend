import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { COLORS } from '../constants/colors';

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

interface CustomButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary';
  iconName?: string;
  iconColor?: string;
}

const CustomButton: React.FC<CustomButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  iconName,
  iconColor
}) => {
  return (
    <TouchableOpacity
      style={[styles.container, variant === 'secondary' && styles.secondaryContainer]}
      onPress={onPress}
    >
      <View style={styles.content}>
        {iconName && (
          <Icon
            name={iconName}
            size={20}
            color={iconColor || (variant === 'secondary' ? COLORS.primary : COLORS.white)}
            style={styles.icon}
          />
        )}
        <Text style={[styles.text, variant === 'secondary' && styles.secondaryText]}>
          {title}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.primary,
    width: '100%',
    paddingVertical: 15,
    borderRadius: 30,
    alignItems: 'center',
    marginBottom: 15,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginRight: 10,
  },
  secondaryContainer: {
    backgroundColor: '#E8FDF5',
  },
  text: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
  secondaryText: {
    color: COLORS.primary,
  },
});

export default CustomButton;