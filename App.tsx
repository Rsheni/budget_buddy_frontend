import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import TransactionScreen from './src/screens/TransactionScreen/TransactionScreen';
import AddIncomeScreen from './src/screens/AddIncomeScreen/AddIncomeScreen';

// Import Screens
import LaunchScreen from './src/screens/LaunchScreen/LaunchScreen';
import WelcomeScreen from './src/screens/WelcomeScreen/WelcomeScreen';
import HomeScreen from './src/screens/HomeScreen/HomeScreen';

const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Launch" component={LaunchScreen} />
        <Stack.Screen name="Welcome" component={WelcomeScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Transactions" component={TransactionScreen} />
        <Stack.Screen name="AddIncome" component={AddIncomeScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;