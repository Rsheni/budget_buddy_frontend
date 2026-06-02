import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthProvider, useAuth } from './src/context/AuthContext';

// Import Screens
import LaunchScreen from './src/screens/LaunchScreen/LaunchScreen';
import WelcomeScreen from './src/screens/WelcomeScreen/WelcomeScreen';
import HomeScreen from './src/screens/HomeScreen/HomeScreen';
import TransactionScreen from './src/screens/TransactionScreen/TransactionScreen';
import AddIncomeScreen from './src/screens/AddIncomeScreen/AddIncomeScreen';
import CategoryScreen from './src/screens/CategoryScreen/CategoryScreen';
import CreateCategoryScreen from './src/screens/CategoryScreen/CreateCategoryScreen';
import CategoryDetailScreen from './src/screens/CategoryScreen/CategoryDetailScreen';
import CreateGroupScreen from './src/screens/GroupScreen/CreateGroupScreen';
import GroupListScreen from './src/screens/GroupScreen/GroupListScreen';
import GroupDetailScreen from './src/screens/GroupScreen/GroupDetailScreen';
import GroupSettingsScreen from './src/screens/GroupScreen/GroupSettingsScreen';
import AddGroupExpenseScreen from './src/screens/GroupScreen/AddGroupExpenseScreen';
import InvitationPreviewScreen from './src/screens/GroupScreen/InvitationPreviewScreen';
import SettleUpScreen from './src/screens/GroupScreen/SettleUpScreen';
import SettlePaymentScreen from './src/screens/GroupScreen/SettlePaymentScreen';
import SettlementHistoryScreen from './src/screens/GroupScreen/SettlementHistoryScreen';

// Auth Screens
import SignInScreen from './src/screens/Auth/SignInScreen';
import RegisterScreen from './src/screens/Auth/RegisterScreen';
import SecurityPinScreen from './src/screens/Auth/SecurityPinScreen';

const Stack = createNativeStackNavigator();

const Navigation = () => {
  const { token, loading } = useAuth();

  if (loading) {
    return <LaunchScreen />; // Or a splash screen
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!token ? (
          // Auth Stack
          <>
            <Stack.Screen name="Launch" component={LaunchScreen} />
            <Stack.Screen name="Welcome" component={WelcomeScreen} />
            <Stack.Screen name="SignIn" component={SignInScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
            <Stack.Screen name="SecurityPin" component={SecurityPinScreen} />
          </>
        ) : (
          // Main App Stack
          <>
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="Transactions" component={TransactionScreen} />
            <Stack.Screen name="AddIncome" component={AddIncomeScreen} />
            <Stack.Screen name="Categories" component={CategoryScreen} />
            <Stack.Screen name="CreateCategory" component={CreateCategoryScreen} />
            <Stack.Screen name="CategoryDetail" component={CategoryDetailScreen} />
            <Stack.Screen name="Groups" component={GroupListScreen} />
            <Stack.Screen name="CreateGroup" component={CreateGroupScreen} />
            <Stack.Screen name="GroupDetail" component={GroupDetailScreen} />
            <Stack.Screen name="GroupSettings" component={GroupSettingsScreen} />
            <Stack.Screen name="AddGroupExpense" component={AddGroupExpenseScreen} />
            <Stack.Screen name="InvitationPreview" component={InvitationPreviewScreen} />
            <Stack.Screen name="SettleUp" component={SettleUpScreen} />
            <Stack.Screen name="SettlePayment" component={SettlePaymentScreen} />
            <Stack.Screen name="SettlementHistory" component={SettlementHistoryScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <Navigation />
    </AuthProvider>
  );
};

export default App;