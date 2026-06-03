import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, SafeAreaView, StatusBar, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { API_URL } from '../../constants/config';
import { COLORS } from '../../constants/colors';

const MilestoneItem = ({ milestone, isLast }: { milestone: any, isLast: boolean }) => {
  return (
    <View style={styles.milestoneRow}>
      <View style={styles.milestoneIndicator}>
        <View style={[styles.milestoneDot, { backgroundColor: milestone.reached ? '#00D09E' : '#E6E6E6' }]}>
          {milestone.reached && <Icon name="checkmark" size={12} color="#FFF" />}
        </View>
        {!isLast && <View style={[styles.milestoneLine, { backgroundColor: milestone.reached ? '#00D09E' : '#E6E6E6' }]} />}
      </View>
      <View style={styles.milestoneContent}>
        <View style={styles.milestoneHeader}>
          <Text style={[styles.milestoneTitle, !milestone.reached && styles.disabledMilestoneTitle]}>
            {milestone.title}
          </Text>
          {milestone.reached && (
            <View style={styles.reachedBadge}>
              <Text style={styles.reachedText}>REACHED</Text>
            </View>
          )}
        </View>
        <Text style={[styles.milestoneDescription, !milestone.reached && styles.disabledMilestoneDescription]}>
          {milestone.description}
        </Text>
      </View>
    </View>
  );
};

const GoalDetailsScreen = ({ navigation, route }: any) => {
  const { goalId } = route.params;
  const { token } = useAuth();
  const [contribution, setContribution] = useState('');
  const [goal, setGoal] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchGoalDetails = async () => {
    try {
      const response = await axios.get(`${API_URL}/goals/${goalId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setGoal(response.data);
    } catch (error) {
      console.error('Error fetching goal:', error);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchGoalDetails();
  }, []);

  const handleAddContribution = async () => {
    try {
      const amount = parseFloat(contribution);
      if (isNaN(amount) || amount <= 0) return;

      const response = await axios.post(
        `${API_URL}/goals/${goalId}/contribute`,
        { amount },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      // Update local state or re-fetch
      setGoal(response.data);
      setContribution('');
      Alert.alert('Success', 'Successfully added to goal!');
    } catch (error) {
      console.error('Error adding contribution:', error);
      Alert.alert('Error', 'Failed to add contribution');
    }
  };

  const getPercentage = () => {
    if (!goal) return 0;
    const pct = (goal.currentAmount / goal.targetAmount) * 100;
    return Math.min(100, Math.round(pct));
  };

  const milestones = goal ? [
    { id: 1, title: 'Starter (25%)', description: "High five! You're off to a great start. 🎉", reached: getPercentage() >= 25 },
    { id: 2, title: `First Rs.${Math.round(goal.targetAmount * 0.4)}`, description: 'Keep going!', reached: getPercentage() >= 40 },
    { id: 3, title: 'Halfway Point (50%)', description: 'Almost halfway there!', reached: getPercentage() >= 50 },
    { id: 4, title: 'Goal Achieved (100%)', description: 'Goal reached! 🚗', reached: getPercentage() >= 100 },
  ] : [];

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text>Loading goal details...</Text>
      </View>
    );
  }

  if (!goal) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text>Goal not found</Text>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={{ color: '#00D09E', marginTop: 10 }}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFF" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="chevron-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Goal Details</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <TouchableOpacity onPress={() => console.log('Notification pressed')} style={{ marginRight: 15 }}>
            <Icon name="notifications-outline" size={22} color="#333" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('EditGoal', { goalId: goal._id })}>
            <Icon name="pencil" size={20} color="#333" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Goal Progress Overview */}
        <View style={styles.overviewSection}>
          <View style={styles.detailsHeaderRow}>
            <Text style={styles.categoryTitle}>{goal.goalName.toUpperCase()}</Text>
            <View style={[styles.priorityBadge, { backgroundColor: goal.status === 'achieved' ? '#E2FCEE' : (goal.priorityColor + '20') }]}>
              <Text style={[styles.priorityBadgeText, { color: goal.status === 'achieved' ? '#00D09E' : goal.priorityColor }]}>
                {goal.status === 'achieved' ? 'DONE' : goal.priorityLabel.toUpperCase()}
              </Text>
            </View>
          </View>
          
          <View style={styles.amountRow}>
            <Text style={styles.mainAmount}>Rs. {goal.currentAmount.toLocaleString()}</Text>
            <Text style={styles.targetLabel}>of Rs. {goal.targetAmount.toLocaleString()} target</Text>
          </View>
          
          <View style={styles.progressBarBg}>
            <View style={[styles.progressBarFill, { width: `${getPercentage()}%` }]} />
          </View>
          
          <View style={styles.progressSummary}>
            <Icon name="time-outline" size={14} color="#00D09E" />
            <Text style={styles.progressSummaryText}>{getPercentage()}% of goal reached</Text>
          </View>
        </View>

        {/* Monthly Breakdown Card */}
        <View style={[styles.breakdownCard, !goal.targetDate && styles.inactiveCard]}>
          <View style={styles.cardHeader}>
            <Icon 
              name="calendar-outline" 
              size={20} 
              color={goal.targetDate ? '#00D09E' : '#9BA4B5'} 
            />
            <Text style={[styles.cardHeaderTitle, !goal.targetDate && { color: '#9BA4B5' }]}>
              Monthly Breakdown
            </Text>
          </View>
          {goal.targetDate ? (
            <>
              <Text style={styles.breakdownText}>
                To reach your goal by <Text style={styles.boldText}>{new Date(goal.targetDate).toLocaleDateString(undefined, { month: 'short', year: 'numeric' })}</Text>, you need to save:
              </Text>
              <Text style={styles.highlightAmount}>RS. {Math.round(goal.monthlySavingsNeeded || 0).toLocaleString()} <Text style={styles.perMonth}>/ month</Text></Text>
            </>
          ) : (
            <View style={styles.inactiveContent}>
              <Text style={styles.inactiveText}>Please add a target time to see your monthly savings plan.</Text>
            </View>
          )}
        </View>

        {/* Milestones Timeline */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Milestones</Text>
          <View style={styles.milestonesContainer}>
            {milestones.map((milestone, index) => (
              <MilestoneItem 
                key={milestone.id} 
                milestone={milestone} 
                isLast={index === milestones.length - 1} 
              />
            ))}
          </View>
        </View>

        {/* Contribution Section */}
        <View style={styles.contributionSection}>
          <Text style={styles.sectionTitle}>Make a Contribution</Text>
          <Text style={styles.inputLabel}>Contribution Amount</Text>
          <View style={styles.inputContainer}>
            <Text style={styles.currencyPrefix}>Rs. </Text>
            <TextInput 
              style={styles.input}
              value={contribution}
              onChangeText={setContribution}
              keyboardType="numeric"
              placeholder="0.00"
            />
          </View>
          <TouchableOpacity style={styles.addButton} onPress={handleAddContribution}>
            <Text style={styles.addButtonText}>Add to Goal</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
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
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  overviewSection: {
    marginBottom: 25,
  },
  categoryTitle: {
    fontSize: 12,
    color: '#00D09E',
    fontWeight: '700',
    marginBottom: 0,
    letterSpacing: 1,
  },
  detailsHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  priorityBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  priorityBadgeText: {
    fontSize: 10,
    fontWeight: '800',
  },
  amountRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  mainAmount: {
    fontSize: 32,
    fontWeight: '800',
    color: '#333',
  },
  targetLabel: {
    fontSize: 12,
    color: '#9BA4B5',
  },
  progressBarBg: {
    height: 10,
    backgroundColor: '#F0F4F8',
    borderRadius: 5,
    marginBottom: 12,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#00D09E',
    borderRadius: 5,
  },
  progressSummary: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  progressSummaryText: {
    fontSize: 12,
    color: '#9BA4B5',
    marginLeft: 6,
  },
  breakdownCard: {
    backgroundColor: '#F7FAFC',
    borderRadius: 16,
    padding: 20,
    marginBottom: 30,
    borderWidth: 1,
    borderColor: '#EEF2F7',
  },
  inactiveCard: {
    backgroundColor: '#F7F7F7',
    borderColor: '#EEEEEE',
    opacity: 0.8,
  },
  inactiveContent: {
    marginTop: 5,
  },
  inactiveText: {
    fontSize: 13,
    color: '#9BA4B5',
    fontStyle: 'italic',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  cardHeaderTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
    marginLeft: 8,
  },
  breakdownText: {
    fontSize: 14,
    color: '#718096',
    lineHeight: 20,
  },
  boldText: {
    color: '#333',
    fontWeight: '700',
  },
  highlightAmount: {
    fontSize: 24,
    fontWeight: '800',
    color: '#00D09E',
    marginTop: 8,
  },
  perMonth: {
    fontSize: 14,
    color: '#9BA4B5',
    fontWeight: '500',
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
    marginBottom: 20,
  },
  milestonesContainer: {
    paddingLeft: 5,
  },
  milestoneRow: {
    flexDirection: 'row',
    marginBottom: 0,
  },
  milestoneIndicator: {
    alignItems: 'center',
    width: 24,
  },
  milestoneDot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
    borderWidth: 4,
    borderColor: '#FFF',
  },
  milestoneLine: {
    width: 2,
    flex: 1,
    marginTop: -2,
    zIndex: 1,
  },
  milestoneContent: {
    flex: 1,
    marginLeft: 15,
    paddingBottom: 25,
  },
  milestoneHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  milestoneTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#333',
  },
  disabledMilestoneTitle: {
    color: '#CBD5E0',
    fontWeight: '500',
  },
  reachedBadge: {
    backgroundColor: '#E2FCEE',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  reachedText: {
    fontSize: 10,
    color: '#00D09E',
    fontWeight: '800',
  },
  milestoneDescription: {
    fontSize: 13,
    color: '#9BA4B5',
    lineHeight: 18,
  },
  disabledMilestoneDescription: {
    color: '#E2E8F0',
  },
  contributionSection: {
    backgroundColor: '#F9FAFB',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  inputLabel: {
    fontSize: 12,
    color: '#9BA4B5',
    fontWeight: '500',
    marginBottom: 8,
  },
  inputContainer: {
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    height: 50,
    marginBottom: 20,
  },
  currencyPrefix: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
  },
  input: {
    flex: 1,
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
    padding: 0,
  },
  addButton: {
    backgroundColor: '#00D09E',
    height: 55,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#00D09E',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 3,
  },
  addButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '700',
  },
});

export default GoalDetailsScreen;
