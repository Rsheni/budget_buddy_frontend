import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { COLORS } from '../constants/colors';
import Icon from 'react-native-vector-icons/Ionicons';

interface BottomNavProps {
  activeTab: string;
  navigation: any;
}

const CustomBottomNav = ({ activeTab, navigation }: BottomNavProps) => {

  const menuItems = [
    { name: 'Home', icon: 'home' },
    { name: 'Stats', icon: 'stats-chart' },
    { name: 'Goals', icon: 'flag' },
    { name: 'Groups', icon: 'people' },
    { name: 'Wallets', icon: 'layers' },
    { name: 'Profile', icon: 'person' },
  ];

  const handlePress = (item: string) => {
    // If exact mapping is required for old screen names, map them back
    // However depending on the new routes:
    if (item === 'Home') navigation.navigate('Home');
    else if (item === 'Transactions' || item === 'Stats') navigation.navigate('Transactions');
    else if (item === 'Categories' || item === 'Wallets') navigation.navigate('Categories');
    else if (item === 'Goals') navigation.navigate('GoalsDashboard');
    else navigation.navigate('Home'); // fallback
  };

  return (
    <View style={styles.bottomNav}>
      {menuItems.map((item, index) => {
        const isActive = activeTab === item.name;
        // Temporary logic since HomeScreen provides 'Home' but what if we pass 'Goals' directly?
        // We'll fall back to styling it active if selected
        const tintColor = isActive ? '#00D09E' : '#9BA4B5';

        return (
          <TouchableOpacity 
            key={index} 
            style={styles.navItem}
            onPress={() => handlePress(item.name)}
          >
            <Icon 
              name={item.icon} 
              size={24} 
              color={tintColor} 
            />
            <Text style={[styles.navText, { color: tintColor, fontWeight: isActive ? '600' : '500' }]}>
              {item.name}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  bottomNav: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 90, 
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 10,
    elevation: 20, 
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -5 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    zIndex: 1000 
  },
  navItem: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1, // evenly space all 6 items
  },
  navText: {
    fontSize: 10,
    marginTop: 4,
  }
});

export default CustomBottomNav;