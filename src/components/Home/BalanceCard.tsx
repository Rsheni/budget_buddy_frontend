import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '../../constants/colors';

interface BalanceProps {
  balance: number;
  income: number;
  expense: number;
}

const BalanceCard = ({ balance, income, expense }: BalanceProps) => {
  
  // 1. Calculate Percentage
  // Avoid division by zero if income is 0
  const percentage = income > 0 ? (expense / income) * 100 : 0;
  
  // Cap the visual bar at 100% so it doesn't break layout
  const barWidth = percentage > 100 ? 100 : percentage;

  // 2. Determine Status Logic
  let statusMessage = "☑ 30% Of Your Expenses, Looks Good.";
  let barColor = COLORS.white; // Default pill color

  if (percentage >= 100) {
    statusMessage = "⚠️ You have exceeded your income!";
    barColor = '#FF4D4D'; // Red warning
  } else if (percentage >= 85) {
    statusMessage = "❗ Careful! You are close to your income limit.";
    barColor = '#FFD700'; // Yellow warning
  } else {
    statusMessage = `☑ ${percentage.toFixed(0)}% Of Your Expenses, Looks Good.`;
    barColor = COLORS.white; // Good
  }


  return (
    <View style={styles.container}>
      <Text style={styles.label}>Current Balance Of Your Wallet</Text>
      <Text style={styles.amount}>Rs. {balance.toLocaleString()}</Text>
      
      {/* Dark Progress Bar */}
      <View style={styles.progressBg}>
        <View style={[
            styles.progressFill, 
            { width: `${barWidth}%`, backgroundColor: COLORS.white,height: 25,
    
     } 
          ]} />
        <View style={[styles.progressLabelContainer, { backgroundColor: barColor }]}>
            <Text style={styles.percentageText}>{percentage.toFixed(0)}%</Text>
        </View>
        {/* Target Amount (Income) */}
          <Text style={styles.targetText}>{income.toLocaleString()}</Text>
        </View>
      
      {/* Dynamic Footer Text */}
        <Text style={[
          styles.footerText, 
          percentage >= 85 && { color: '#D9534F', fontWeight: 'bold' } // Turn text red if high
        ]}>
          {statusMessage}
        </Text>
      </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 30,
    
  },
  label: { color: COLORS.textDark, fontSize: 13, marginBottom: 5, fontWeight: '500' },
  amount: { color: COLORS.blue, fontSize: 32, fontWeight: 'bold', marginBottom: 20 }, // Big Blue Text
  
  progressBg: {
    height: 31,
    backgroundColor: '#1E1E1E', // Dark Grey/Black bar
    borderRadius: 17.5,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 1,
    marginBottom: 15,
    justifyContent: 'space-between'
  },
  progressFill: {
    position: 'absolute',
    left: 0,
    height: '100%',
    borderRadius: 17.5,
  },
  progressLabelContainer: {
    backgroundColor:COLORS.white,
    paddingHorizontal: 15,
    height: 25,
    borderRadius: 12.5,
    justifyContent: 'center',
    marginLeft: 2
  },
  percentageText: { color: COLORS.textDark, fontSize: 12, fontWeight: 'bold' },
  targetText: { color: COLORS.white, fontSize: 12, marginRight: 15 },
  
  footerText: { color: COLORS.textDark, fontSize: 12, opacity: 0.8 }
});

export default BalanceCard;