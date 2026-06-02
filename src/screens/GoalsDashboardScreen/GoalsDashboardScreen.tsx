import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, SafeAreaView, StatusBar } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { API_URL } from '../../constants/config';
import { COLORS } from '../../constants/colors';
import CustomBottomNav from '../../navigation/CustomBottomNav';

const GoalCard = ({ goal, status, navigation }: { goal: any, status: string, navigation: any }) => {
  const isCompleted = status === 'Completed';
  
  return (
    <View style={styles.card}>
      <Image source={{ uri: goal.image }} style={styles.cardImage} />
      <View style={styles.cardContent}>
        <View style={styles.cardHeader}>
          <Text style={styles.goalTitle}>{goal.title}</Text>
          <View style={[styles.tag, { backgroundColor: isCompleted ? '#E2FCEE' : (goal.tagColor + '20') }]}>
            <Text style={[styles.tagText, { color: isCompleted ? '#00D09E' : goal.tagColor }]}>
              {isCompleted ? 'DONE' : goal.tag.toUpperCase()}
            </Text>
          </View>
        </View>

        <View style={styles.amountRow}>
          <Text style={styles.amountText}>
            Rs. {goal.current.toLocaleString()} / Rs. {goal.target.toLocaleString()}
          </Text>
          <Text style={styles.percentageText}>{goal.percentage}%</Text>
        </View>

        <View style={styles.progressBarBg}>
          <View 
            style={[
              styles.progressBarFill, 
              { width: `${goal.percentage}%`, backgroundColor: isCompleted ? '#00D09E' : '#00D09E' }
            ]} 
          />
        </View>

        <View style={styles.footer}>
          <View style={styles.deadlineRow}>
            {isCompleted ? (
              <Text style={styles.deadlineText}>Goal Achieved on {goal.achievedDate}</Text>
            ) : (
              <>
                <Icon name="time-outline" size={14} color="#9BA4B5" />
                <Text style={styles.deadlineText}>{goal.deadline}</Text>
              </>
            )}
          </View>
          <TouchableOpacity 
            style={styles.viewDetailsButton}
            onPress={() => navigation.navigate('GoalDetails', { goalId: goal.id })}
          >
            <Text style={styles.viewDetailsText}>View Details</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const GoalsDashboardScreen = ({ navigation }: any) => {
  const { token } = useAuth();
  const [activeTab, setActiveTab] = useState('Active');
  const [goals, setGoals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchGoals = async () => {
    try {
      const response = await axios.get(`${API_URL}/goals`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setGoals(response.data);
    } catch (error) {
      console.error('Error fetching goals:', error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchGoals();
    }, [token])
  );

  const activeGoals = goals.filter(g => g.status === 'active');
  const completedGoals = goals.filter(g => g.status === 'achieved');

  const goalsToShow = activeTab === 'Active' ? activeGoals : completedGoals;

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text>Loading goals...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFF" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity>
          <View style={styles.avatarContainer}>
             <Icon name="person-circle-outline" size={32} color="#333" />
          </View>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Goals Dashboard</Text>
        <TouchableOpacity>
          <Icon name="notifications-outline" size={24} color="#333" />
        </TouchableOpacity>
      </View>

      {/* Tabs */}
      <View style={styles.tabContainer}>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'Active' && styles.activeTab]} 
          onPress={() => setActiveTab('Active')}
        >
          <Text style={[styles.tabText, activeTab === 'Active' && styles.activeTabText]}>Active</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'Completed' && styles.activeTab]} 
          onPress={() => setActiveTab('Completed')}
        >
          <Text style={[styles.tabText, activeTab === 'Completed' && styles.activeTabText]}>Completed</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {goalsToShow.map((goal) => (
          <GoalCard key={goal.id} goal={goal} status={activeTab} navigation={navigation} />
        ))}
      </ScrollView>

      <CustomBottomNav activeTab="Goals" navigation={navigation} />

      {/* Floating Action Button */}
      <TouchableOpacity 
        style={styles.fab} 
        onPress={() => navigation.navigate('CreateGoal')}
      >
        <Icon name="add" size={30} color="#FFF" />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  avatarContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
  },
  tabContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  tab: {
    flex: 1,
    paddingVertical: 15,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 3,
    borderBottomColor: '#00D09E',
  },
  tabText: {
    fontSize: 14,
    color: '#9BA4B5',
    fontWeight: '600',
  },
  activeTabText: {
    color: '#333',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 110, // Space for bottom nav
  },
  card: {
    backgroundColor: '#FFF',
    borderRadius: 20,
    marginBottom: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#F0F0F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  cardImage: {
    width: '100%',
    height: 150,
    resizeMode: 'cover',
  },
  cardContent: {
    padding: 15,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  goalTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
  },
  tag: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  tagText: {
    fontSize: 12,
    fontWeight: '600',
  },
  amountRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  amountText: {
    fontSize: 14,
    color: '#9BA4B5',
    fontWeight: '500',
  },
  percentageText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#333',
  },
  progressBarBg: {
    height: 8,
    backgroundColor: '#F0F4F8',
    borderRadius: 4,
    marginBottom: 15,
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  deadlineRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  deadlineText: {
    fontSize: 12,
    color: '#9BA4B5',
    marginLeft: 4,
  },
  viewDetailsButton: {
    backgroundColor: '#00D09E',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 10,
  },
  viewDetailsText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '700',
  },
  fab: {
    position: 'absolute',
    right: 25,
    bottom: 100,
    backgroundColor: '#00D09E',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#00D09E',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
  },
});

export default GoalsDashboardScreen;
