import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Image, StatusBar } from 'react-native';
import { COLORS } from '../../constants/colors';

const LaunchScreen = ({ navigation }: any) => {

  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.replace('Welcome'); // Navigate to Welcome (1-B)
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <View style={styles.container}>
      {/* Status bar matches the green background */}
      <StatusBar backgroundColor={COLORS.primary} barStyle="light-content" />
      
      {/* White Icon */}
      <Image 
        source={{ uri: 'https://img.icons8.com/ios-filled/100/ffffff/bar-chart.png' }} 
        style={styles.logo} 
      />
      
      <Text style={styles.title}>BudgetBuddy</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.primary, // #00D09E
    justifyContent: 'center',        // Fixed the typo here
    alignItems: 'center',
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: COLORS.white,
    letterSpacing: 1,
  },
});

export default LaunchScreen;