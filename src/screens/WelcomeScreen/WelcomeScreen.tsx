import React from 'react';
import { View, Text, StyleSheet, Image, StatusBar, TouchableOpacity } from 'react-native';
import { COLORS } from '../../constants/colors';
import CustomButton from '../../components/CustomButton';

const WelcomeScreen = ({ navigation }: any) => {

  const handleLogin = () => {
    // Navigate to Home Page
    navigation.replace('Home');
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={COLORS.background} barStyle="dark-content" />

      <View style={styles.contentContainer}>
        <Image 
          source={{ uri: 'https://img.icons8.com/ios-filled/100/00D09C/bar-chart.png' }} 
          style={styles.logo} 
        />
        
        <Text style={styles.title}>BudgetBuddy</Text>
        <Text style={styles.subtitle}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod.
        </Text>

        <View style={styles.buttonContainer}>
          {/* UPDATED BUTTON HERE */}
          <CustomButton 
            title="Log In" 
            onPress={handleLogin} 
          />
          
          <CustomButton 
            title="Sign Up" 
            variant="secondary"
            onPress={() => console.log("Sign Up Pressed")} 
          />

          <TouchableOpacity>
            <Text style={styles.forgotPassword}>Forgot Password?</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background, 
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
  },
  logo: {
    width: 80,
    height: 80,
    marginBottom: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.textMedium,
    textAlign: 'center',
    marginBottom: 50,
    lineHeight: 20,
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
  },
  forgotPassword: {
    color: COLORS.textDark,
    fontSize: 14,
    marginTop: 10,
    fontWeight: '600',
  }
});

export default WelcomeScreen;