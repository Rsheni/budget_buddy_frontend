import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, StatusBar, SafeAreaView, ScrollView, Image, Dimensions } from 'react-native';
import { COLORS } from '../../constants/colors';
import { fetchHomeData } from '../../api/homeService';
import CustomBottomNav from '../../navigation/CustomBottomNav';

// Import Tabs
import PersonalTab from './PersonalTab';
import GoalTab from './GoalTab';
import SharedTab from './SharedTab';

const { width } = Dimensions.get('window');

// Data Interface
interface HomeData {
  personal: any;
  goals: any;
  shared: any;
}

const HomeScreen = ({ navigation }: any) => {
  const [activeTab, setActiveTab] = useState('Personal');
  const [data, setData] = useState<HomeData | null>(null);

  useEffect(() => {
    const loadData = async () => {
      const result = await fetchHomeData();
      setData(result);
    };
    loadData();
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={COLORS.primary} barStyle="light-content" />

      {/* HEADER SECTION */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
           <View>
             <Text style={styles.greeting}>Hi, Welcome Back</Text>
             <Text style={styles.subGreeting}>Good Morning</Text>
           </View>
           {/* Notification Icon (X=364, Y=61) */}
           <View style={styles.bellIcon}>
             <Image source={{ uri: 'https://img.icons8.com/ios/50/ffffff/appointment-reminders.png' }} style={{ width: 24, height: 24 }} />
           </View>
        </View>

        {/* TOP TAB SWITCHER (X=35) */}
        <View style={styles.tabContainer}>
          {['Personal', 'Goal Status', 'Shared'].map((tab) => (
            <TouchableOpacity 
              key={tab} 
              style={styles.tabButton}
              onPress={() => setActiveTab(tab)}
            >
              <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>
                {tab}
              </Text>
              {/* Active Indicator Line */}
              {activeTab === tab && <View style={styles.activeLine} />}
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* CONTENT AREA */}
      <ScrollView 
        style={styles.contentContainer} 
        contentContainerStyle={{ paddingBottom: 120 }} // Space for Bottom Nav
        showsVerticalScrollIndicator={false}
      >
        {data ? (
          <>
            {activeTab === 'Personal' && <PersonalTab data={data.personal} />}
            {activeTab === 'Goal Status' && <GoalTab data={data.goals} />}
            {activeTab === 'Shared' && <SharedTab data={data.shared} />}
          </>
        ) : (
          <Text style={{ textAlign: 'center', marginTop: 50, color: COLORS.textLight }}>Loading...</Text>
        )}
      </ScrollView>

       <CustomBottomNav activeTab="Home" navigation={navigation} />

    </View>
  );
};

// Helper for Icons (Replace URIs with local assets if you have them)
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

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  
  // Header Styles
  header: {
    backgroundColor: COLORS.primary,
    paddingTop: 50, // Status Bar Space
    paddingBottom: 20,
    
    paddingHorizontal: 35, // X=35 Alignment
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 25,
  },
  greeting: { fontSize: 20, fontWeight: 'bold', color: COLORS.textDark, fontFamily: 'sans-serif-medium' },
  subGreeting: { fontSize: 14, color: COLORS.textMedium, opacity: 0.8 },
  bellIcon: { 
    width: 40, height: 40, 
    borderRadius: 12, 
    backgroundColor: 'rgba(255,255,255,0.2)', 
    justifyContent: 'center', alignItems: 'center' 
  },

  // Tab Styles
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  tabButton: {
    alignItems: 'center',
    paddingBottom: 5,
  },
  tabText: {
    fontSize: 14,
    color: COLORS.textDark,
    opacity: 0.5,
    fontWeight: '600',
  },
  activeTabText: {
    opacity: 1,
    fontWeight: 'bold',
  },
  activeLine: {
    width: 40,
    height: 3,
    backgroundColor: COLORS.textDark,
    marginTop: 5,
    borderRadius: 2,
  },

  contentContainer: {
    flex: 1,
    paddingHorizontal: 35, // X=35 Alignment for body content
    paddingTop: 20,
  },

  // Bottom Nav Styles (From Figma: H=108, Radius=40)
  bottomNav: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 90, // Adjusted slightly for screen fit
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 20,
    elevation: 20, // Shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -5 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  navItem: {
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 25,
  },
  activeNavItem: {
    backgroundColor: COLORS.primary, // Green Circle
  },
  navIcon: {
    width: 24,
    height: 24,
  }
});

export default HomeScreen;