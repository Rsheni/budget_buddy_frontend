import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { COLORS } from '../constants/colors';
import Icon from 'react-native-vector-icons/Ionicons';

interface BottomNavProps {
  activeTab: string;
  navigation: any;
}

const CustomBottomNav = ({ activeTab, navigation }: BottomNavProps) => {

<<<<<<< HEAD
  const menuItems = ['Home', 'Analysis', 'Groups', 'Stack', 'Profile'];

  const handlePress = (item: string) => {
    if (item === 'Home') {
      navigation.navigate('Home');
    } else if (item === 'Groups') {
      navigation.navigate('Groups');
    } else if (item === 'Stack') {
      // Navigate to Category List (This is the 4th Icon)
      navigation.navigate('Categories');
    } else {
      console.log(`Navigate to ${item}`);
    }
  };

  const getIcon = (name: string) => {
    switch(name) {
      case 'Home': return 'https://img.icons8.com/ios-filled/50/000000/home.png';
      case 'Analysis': return 'https://img.icons8.com/ios/50/000000/bar-chart.png';
      case 'Groups': return 'https://img.icons8.com/ios-filled/50/000000/user-group-man-man.png';
      case 'Stack': return 'https://img.icons8.com/ios/50/000000/layers.png';
      case 'Profile': return 'https://img.icons8.com/ios/50/000000/user.png';
      default: return '';
    }
=======
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
>>>>>>> a953567fb935e3e82369509be30a665ece9da1f8
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