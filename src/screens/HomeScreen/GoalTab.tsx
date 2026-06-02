import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import Icon from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const CircularProgress = ({ percentage, color, radius, strokeWidth }: any) => {
  const halfCircle = radius + strokeWidth;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (circumference * percentage) / 100;

  return (
    <View style={{ width: radius * 2, height: radius * 2, justifyContent: 'center', alignItems: 'center' }}>
      <Svg height={radius * 2 + strokeWidth * 2} width={radius * 2 + strokeWidth * 2} style={{ position: 'absolute' }}>
        <Circle
          cx="50%"
          cy="50%"
          r={radius}
          stroke="#E6E6E6"
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        <Circle
          cx="50%"
          cy="50%"
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          fill="transparent"
          rotation="-90"
          originX={halfCircle}
          originY={halfCircle}
        />
      </Svg>
      <Text style={styles.progressText}>{Math.round(percentage)}%</Text>
    </View>
  );
};

const GoalTab = ({ data, navigation }: any) => {
  const goals = data?.list || [];
  const totalSavings = data?.totalSavings || 0;

  return (
    <View style={styles.container}>
      {/* Total Saved Card */}
      <View style={styles.cardContainer}>
        <View style={styles.totalSavedCard}>
          <Text style={styles.totalSavedLabel}>Total Saved Across Goals</Text>
          <View style={styles.totalSavedRow}>
            <Text style={styles.totalSavedAmount}>Rs. {totalSavings.toLocaleString()}</Text>
            <Text style={styles.greenText}>+12% this month</Text>
          </View>
        </View>
      </View>

      {/* Active Goals Section */}
      <View style={styles.activeGoalsHeader}>
        <Text style={styles.activeGoalsTitle}>Active Goals</Text>
        <TouchableOpacity onPress={() => navigation?.navigate('SavingsGoals')}>
          <Text style={styles.seeAllText}>See All</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.goalsList}>
        {goals.map((goal: any) => (
          <View key={goal.id} style={styles.goalCard}>
            <View style={styles.goalProgressContainer}>
              <CircularProgress percentage={goal.percentage} color="#00D09E" radius={25} strokeWidth={5} />
            </View>
            
            <View style={styles.goalInfo}>
              <Text style={styles.goalTitle}>{goal.title}</Text>
              <View style={styles.goalAmountRow}>
                <Text style={styles.savedAmountText}>Rs. {goal.savedAmount}</Text>
                <Text style={styles.targetAmountText}> of Rs. {goal.targetAmount}</Text>
              </View>
              <View style={styles.daysRow}>
                <Icon name="time-outline" size={14} color="#999" style={styles.timeIcon} />
                <Text style={styles.daysRemainingText}>{goal.daysRemaining}</Text>
              </View>
            </View>
            
            <View style={styles.goalIconContainer}>
              {goal.iconType === 'beach' ? (
                <MaterialCommunityIcons name="umbrella-outline" size={20} color="#999" />
              ) : goal.iconType === 'laptop' ? (
                <Icon name="laptop-outline" size={20} color="#999" />
              ) : (
                <Icon name={goal.iconType} size={20} color="#999" />
              )}
            </View>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // Add negative margin to stretch outside of HomeScreen horizontal padding
    marginHorizontal: -15, 
    paddingBottom: 20,
    marginTop: -20, // To merge closely with Header
  },
  cardContainer: {
    paddingHorizontal: 20,
    zIndex: 3,
  },
  totalSavedCard: {
    backgroundColor: '#F0FFF7',
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: '#E2FCEE',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  totalSavedLabel: {
    fontSize: 14,
    color: '#555',
    marginBottom: 8,
  },
  totalSavedRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
  },
  totalSavedAmount: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000',
  },
  greenText: {
    fontSize: 13,
    color: '#00D09E',
    fontWeight: '600',
  },
  activeGoalsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: 25,
    marginBottom: 15,
  },
  activeGoalsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  seeAllText: {
    fontSize: 14,
    color: '#00D09E',
    fontWeight: '600',
  },
  goalsList: {
    paddingHorizontal: 20,
    gap: 15,
  },
  goalCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#F0F0F0',
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 2,
  },
  goalProgressContainer: {
    marginRight: 15,
  },
  progressText: {
    position: 'absolute',
    fontSize: 12,
    fontWeight: 'bold',
    color: '#000',
  },
  goalInfo: {
    flex: 1,
  },
  goalTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 4,
  },
  goalAmountRow: {
    flexDirection: 'row',
    marginBottom: 6,
  },
  savedAmountText: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#00D09E',
  },
  targetAmountText: {
    fontSize: 13,
    color: '#666',
  },
  daysRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeIcon: {
    marginRight: 4,
  },
  daysRemainingText: {
    fontSize: 12,
    color: '#999',
  },
  goalIconContainer: {
    padding: 8,
  },
});

export default GoalTab;