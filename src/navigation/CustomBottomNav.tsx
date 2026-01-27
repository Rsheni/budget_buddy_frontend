import React from 'react';
import { View, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { COLORS } from '../constants/colors';

interface BottomNavProps {
  activeTab: string;
  navigation: any;
}

const CustomBottomNav = ({ activeTab, navigation }: BottomNavProps) => {

  const menuItems = ['Home', 'Analysis', 'Swap', 'Stack', 'Profile'];

  const handlePress = (item: string) => {
    if (item === 'Home') {
      navigation.navigate('Home');
    } else if (item === 'Swap') {
      // Navigate to Transaction List
      navigation.navigate('Transactions');
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
      case 'Swap': return 'https://img.icons8.com/ios/50/000000/replace.png';
      case 'Stack': return 'https://img.icons8.com/ios/50/000000/layers.png';
      case 'Profile': return 'https://img.icons8.com/ios/50/000000/user.png';
      default: return '';
    }
  };

  return (
    <View style={styles.bottomNav}>
      {menuItems.map((item, index) => (
        <TouchableOpacity 
          key={index} 
          style={[styles.navItem, activeTab === item && styles.activeNavItem]}
          onPress={() => handlePress(item)}
        >
          <Image 
            source={{ uri: getIcon(item) }} 
            style={[
              styles.navIcon, 
              { tintColor: activeTab === item ? COLORS.textDark : COLORS.textDark }
            ]} 
          />
        </TouchableOpacity>
      ))}
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
    paddingHorizontal: 20,
    elevation: 20, 
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -5 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    zIndex: 1000 
  },
  navItem: {
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 25,
  },
  activeNavItem: {
    backgroundColor: COLORS.primary, 
  },
  navIcon: {
    width: 24,
    height: 24,
  }
});

export default CustomBottomNav;